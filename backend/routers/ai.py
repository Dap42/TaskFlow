from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from services import crud_service as crud
import schemas
import database
import models
from routers.tasks import get_current_user
import os
import httpx
import json

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
GEMINI_API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent?key={GEMINI_API_KEY}"


@router.post("/summary", response_model=schemas.AISummaryResponse)
async def generate_summary(current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    tasks = await crud.get_tasks(db, user_id=current_user.id)

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500, detail="Gemini API Key not configured")

    # 1. Calculate Deterministic Stats
    total = len(tasks)
    completed = len([t for t in tasks if t.status == "completed"])
    pending = len([t for t in tasks if t.status != "completed"])
    
    # Calculate overdue (naive check, assuming deadline is naive or UTC)
    # In a real app, handle timezones carefully.
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc)
    overdue_tasks = [
        t for t in tasks 
        if t.deadline and t.deadline < now and t.status != "completed"
    ]
    overdue = len(overdue_tasks)
    
    high_priority_tasks = [
        t for t in tasks 
        if t.priority == "high" and t.status != "completed"
    ]
    high_priority = len(high_priority_tasks)
    
    completion_rate = int((completed / total * 100) if total > 0 else 0)

    stats = schemas.AIStats(
        total=total,
        completed=completed,
        pending=pending,
        overdue=overdue,
        highPriority=high_priority,
        completionRate=completion_rate
    )

    # 2. Prepare Data for AI
    # We only send relevant info to save tokens and reduce noise
    task_summary_list = []
    for t in tasks:
        if t.status != "completed": # Focus AI on what's left
            task_summary_list.append({
                "title": t.title,
                "category": t.category,
                "priority": t.priority,
                "deadline": str(t.deadline) if t.deadline else "None"
            })

    # 3. Prompt Engineering for JSON Output
    prompt = f"""
    You are a productivity assistant. Analyze these pending tasks for user {current_user.email}.
    
    Stats:
    - Completion Rate: {completion_rate}%
    - Overdue: {overdue}
    - High Priority Pending: {high_priority}

    Pending Tasks:
    {json.dumps(task_summary_list[:20], indent=2)} 
    (List truncated to top 20 if too long)

    Return a JSON object with exactly this structure:
    {{
        "insights": [
            {{ "type": "warning" | "success" | "info", "title": "Short Title", "description": "One sentence description" }}
        ],
        "actionItems": [
            "Actionable advice 1",
            "Actionable advice 2"
        ]
    }}

    Rules:
    - Generate 3-4 insights based on the stats and tasks.
    - If completion rate < 50%, include a warning insight.
    - If overdue > 0, include a warning insight.
    - "actionItems" should be specific recommendations based on the tasks provided.
    - Do NOT return markdown formatting, just raw JSON.
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    # 4. Call Gemini
    ai_insights = []
    ai_actions = []

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(GEMINI_API_URL, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()
            
            text_response = data["candidates"][0]["content"]["parts"][0]["text"]
            
            # Clean up potential markdown code blocks
            text_response = text_response.replace("```json", "").replace("```", "").strip()
            
            parsed_ai = json.loads(text_response)
            ai_insights = parsed_ai.get("insights", [])
            ai_actions = parsed_ai.get("actionItems", [])

        except Exception as e:
            print(f"AI Generation failed: {e}")
            # Fallback if AI fails
            ai_insights = [{
                "type": "info",
                "title": "AI Unavailable",
                "description": "Could not generate personalized insights at this time."
            }]
            ai_actions = ["Focus on high priority tasks", "Check your deadlines"]

    # 5. Get Top Priority Tasks (Local Logic)
    # Sort by deadline (asc) then priority (high > medium > low)
    # For simplicity here, just taking the high_priority_tasks list we already filtered
    # and sorting by deadline.
    
    def task_sort_key(t):
        # Sort by deadline (nulls last), then priority
        d = t.deadline if t.deadline else datetime.max.replace(tzinfo=timezone.utc)
        p_rank = {"high": 0, "medium": 1, "low": 2}.get(t.priority, 3)
        return (d, p_rank)

    top_tasks_objects = sorted(
        [t for t in tasks if t.status != "completed"], 
        key=task_sort_key
    )[:3]

    return schemas.AISummaryResponse(
        stats=stats,
        insights=ai_insights,
        actionItems=ai_actions,
        topTasks=top_tasks_objects
    )

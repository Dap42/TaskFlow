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


@router.post("/summary")
async def generate_summary(current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    tasks = await crud.get_tasks(db, user_id=current_user.id)

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500, detail="Gemini API Key not configured")

    # Prepare data for AI
    task_list = []
    for t in tasks:
        task_list.append({
            "title": t.title,
            "category": t.category,
            "priority": t.priority,
            "status": t.status,
            "deadline": str(t.deadline) if t.deadline else "None"
        })

    prompt = f"""
    Analyze the following tasks for user {current_user.email} and provide a weekly productivity summary and actionable advice.
    Focus on what has been completed vs pending, and highlight high priority items that are due soon.
    Keep it concise and motivating.
    
    Tasks:
    {json.dumps(task_list, indent=2)}
    """

    payload = {
        "contents": [{
            "parts": [{"text": prompt}]
        }]
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(GEMINI_API_URL, json=payload, timeout=30.0)
            response.raise_for_status()
            data = response.json()

            # Extract text from Gemini response
            try:
                summary_text = data["candidates"][0]["content"]["parts"][0]["text"]
            except (KeyError, IndexError):
                summary_text = "AI could not generate a summary at this time."

            return {"summary": summary_text}

        except httpx.HTTPStatusError as e:
            print(f"Gemini API Error: {e.response.text}")
            raise HTTPException(
                status_code=500, detail="Failed to generate AI summary")
        except Exception as e:
            print(f"Error: {e}")
            raise HTTPException(
                status_code=500, detail="An error occurred while generating summary")

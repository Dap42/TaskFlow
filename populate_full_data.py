import requests
import json
import random
from datetime import datetime, timedelta

API_URL = "https://taskflow-production-a883.up.railway.app"
EMAIL = "darpanbansal01@gmail.com"
PASSWORD = "Darpan@2005"

def login():
    print(f"Logging in as {EMAIL}...")
    response = requests.post(
        f"{API_URL}/auth/login",
        data={"username": EMAIL, "password": PASSWORD},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    if response.status_code == 200:
        print("Login successful!")
        return response.json()["access_token"]
    else:
        print(f"Login failed: {response.text}")
        exit(1)

def create_subtask(token, task_id, title, is_completed):
    response = requests.post(
        f"{API_URL}/tasks/{task_id}/subtasks/",
        json={"title": title, "is_completed": is_completed},
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )
    if response.status_code == 200 or response.status_code == 201:
        print(f"  -> Added subtask: {title}")
    else:
        print(f"  -> Failed to add subtask: {response.text}")

def create_task(token, task):
    response = requests.post(
        f"{API_URL}/tasks/",
        json=task,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
    )
    if response.status_code == 200 or response.status_code == 201:
        created_task = response.json()
        print(f"Created task: {task['title']}")
        return created_task["id"]
    else:
        print(f"Failed to create task {task['title']}: {response.text}")
        return None

def generate_data():
    categories = ["work", "personal", "development", "meeting", "documentation"]
    priorities = ["low", "medium", "high"]
    statuses = ["pending", "in_progress", "completed"]
    
    tasks_data = [
        {"title": "Implement Dark Mode", "description": "Add dark mode support using Tailwind CSS.", "category": "development", "subtasks": ["Define color palette", "Add toggle button", "Test on mobile"]},
        {"title": "Buy Groceries", "description": "Weekly grocery run.", "category": "personal", "subtasks": ["Milk", "Eggs", "Bread", "Vegetables", "Chicken"]},
        {"title": "Q4 Roadmap Planning", "description": "Define goals and milestones for Q4.", "category": "meeting", "subtasks": ["Review Q3 performance", "Brainstorm new features", "Assign resources"]},
        {"title": "Fix API Latency", "description": "Optimize database queries to reduce latency.", "category": "development", "subtasks": ["Analyze slow queries", "Add indexes", "Cache results"]},
        {"title": "Write User Guide", "description": "Create a comprehensive guide for new users.", "category": "documentation", "subtasks": ["Draft outline", "Write introduction", "Add screenshots", "Review with team"]},
        {"title": "Car Service", "description": "Take the car for routine maintenance.", "category": "personal", "subtasks": ["Book appointment", "Drop off car", "Pick up car"]},
        {"title": "Design System Update", "description": "Update the UI kit with new components.", "category": "work", "subtasks": ["Update buttons", "Redesign cards", "Standardize typography"]},
        {"title": "Client Meeting", "description": "Discuss project requirements with the client.", "category": "meeting", "subtasks": ["Prepare slides", "Gather requirements", "Send follow-up email"]},
        {"title": "Learn Rust", "description": "Complete the Rust programming book.", "category": "development", "subtasks": ["Read Chapter 1", "Read Chapter 2", "Build a small CLI tool"]},
        {"title": "Plan Vacation", "description": "Itinerary for the upcoming trip.", "category": "personal", "subtasks": ["Book flights", "Reserve hotel", "Pack bags"]},
        {"title": "Database Backup", "description": "Ensure automated backups are working.", "category": "development", "subtasks": ["Check logs", "Test restore procedure"]},
        {"title": "Team Building Event", "description": "Organize a fun activity for the team.", "category": "work", "subtasks": ["Choose venue", "Send invites", "Order food"]},
        {"title": "Refactor Auth Module", "description": "Improve security and code quality.", "category": "development", "subtasks": ["Audit current code", "Implement JWT rotation", "Update tests"]},
        {"title": "Pay Utility Bills", "description": "Electricity, Water, Internet.", "category": "personal", "subtasks": ["Check amounts", "Pay online"]},
        {"title": "Update Portfolio", "description": "Add recent projects to personal website.", "category": "personal", "subtasks": ["Select projects", "Write descriptions", "Update screenshots"]},
        {"title": "Code Review", "description": "Review pending PRs.", "category": "development", "subtasks": ["PR #45", "PR #48", "PR #52"]},
        {"title": "Marketing Campaign", "description": "Launch the social media campaign.", "category": "work", "subtasks": ["Create graphics", "Write copy", "Schedule posts"]},
        {"title": "Clean Garage", "description": "Organize tools and throw away trash.", "category": "personal", "subtasks": ["Sort tools", "Recycle boxes", "Sweep floor"]},
        {"title": "Update Dependencies", "description": "Upgrade npm packages to latest versions.", "category": "development", "subtasks": ["Run npm audit", "Update react", "Update next.js", "Fix breaking changes"]},
        {"title": "Prepare Tax Documents", "description": "Gather receipts and forms.", "category": "personal", "subtasks": ["Find W2", "Collect receipts", "Send to accountant"]}
    ]

    token = login()

    for task_info in tasks_data:
        # Randomize task properties
        priority = random.choice(priorities)
        status = random.choice(statuses)
        days_offset = random.randint(1, 30)
        deadline = (datetime.now() + timedelta(days=days_offset)).isoformat()

        task_payload = {
            "title": task_info["title"],
            "description": task_info["description"],
            "category": task_info["category"],
            "priority": priority,
            "status": status,
            "deadline": deadline
        }

        task_id = create_task(token, task_payload)

        if task_id and "subtasks" in task_info:
            for subtask_title in task_info["subtasks"]:
                # Randomize subtask completion
                is_completed = random.choice([True, False])
                create_subtask(token, task_id, subtask_title, is_completed)

def main():
    try:
        generate_data()
        print("\nAll data generated successfully!")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()

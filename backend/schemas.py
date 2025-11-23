from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str

    class Config:
        from_attributes = True


class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    priority: str
    deadline: Optional[datetime] = None
    status: Optional[str] = "pending"

    @field_validator('deadline', mode='before')
    def parse_deadline(cls, v):
        if v == "":
            return None
        return v


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None


class Task(TaskBase):
    id: str
    owner_id: str
    created_at: datetime
    subtasks: List['Subtask'] = []

    class Config:
        from_attributes = True


# Subtask Schemas
class SubtaskBase(BaseModel):
    title: str
    is_completed: Optional[bool] = False


class SubtaskCreate(SubtaskBase):
    pass


class SubtaskUpdate(BaseModel):
    title: Optional[str] = None
    is_completed: Optional[bool] = None


class Subtask(SubtaskBase):
    id: str
    task_id: str

    class Config:
        from_attributes = True


class AIInsight(BaseModel):
    type: str  # success, warning, info
    title: str
    description: str


class AIStats(BaseModel):
    total: int
    completed: int
    pending: int
    overdue: int
    highPriority: int
    completionRate: int


class AISummaryResponse(BaseModel):
    stats: AIStats
    insights: List[AIInsight]
    actionItems: List[str]
    topTasks: List[Task]


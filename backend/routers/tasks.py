from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from services import crud_service as crud
import schemas
import database
import models
from utils import ALGORITHM, SECRET_KEY
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db: AsyncSession = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = await crud.get_user_by_email(db, email=email)
    if user is None:
        raise credentials_exception
    return user


@router.post("/", response_model=schemas.Task)
async def create_task(task: schemas.TaskCreate, current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    """
    Create a new task.
    
    Args:
        task: Task data
        current_user: Authenticated user
        db: Database session
    """
    return await crud.create_task(db=db, task=task, user_id=current_user.id)


@router.get("/", response_model=List[schemas.Task])
async def read_tasks(skip: int = 0, limit: int = 100, current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    """
    Retrieve all tasks for the current user.
    
    Args:
        skip: Pagination skip
        limit: Pagination limit
        current_user: Authenticated user
        db: Database session
    """
    tasks = await crud.get_tasks(db, skip=skip, limit=limit, user_id=current_user.id)
    return tasks


@router.get("/{task_id}", response_model=schemas.Task)
async def read_task(task_id: str, current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    """
    Retrieve a specific task by ID.
    
    Args:
        task_id: Task ID
        current_user: Authenticated user
        db: Database session
    """
    task = await crud.get_task(db, task_id=task_id, user_id=current_user.id)
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=schemas.Task)
async def update_task(task_id: str, task: schemas.TaskUpdate, current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    updated_task = await crud.update_task(db, task_id=task_id, task=task, user_id=current_user.id)
    if updated_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated_task


@router.delete("/{task_id}", response_model=schemas.Task)
async def delete_task(task_id: str, current_user: models.User = Depends(get_current_user), db: AsyncSession = Depends(database.get_db)):
    deleted_task = await crud.delete_task(db, task_id=task_id, user_id=current_user.id)
    if deleted_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return deleted_task

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import schemas
import database
import models
from routers.tasks import get_current_user
from sqlalchemy.future import select
from sqlalchemy import update, delete

router = APIRouter(
    prefix="/tasks/{task_id}/subtasks",
    tags=["subtasks"],
)


async def get_subtask(db: AsyncSession, subtask_id: str, task_id: str):
    result = await db.execute(
        select(models.Subtask).filter(
            models.Subtask.id == subtask_id,
            models.Subtask.task_id == task_id
        )
    )
    return result.scalars().first()


@router.post("/", response_model=schemas.Subtask)
async def create_subtask(
    task_id: str,
    subtask: schemas.SubtaskCreate,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    # Verify task exists and belongs to user
    task_result = await db.execute(
        select(models.Task).filter(
            models.Task.id == task_id,
            models.Task.owner_id == current_user.id
        )
    )
    task = task_result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_subtask = models.Subtask(**subtask.dict(), task_id=task_id)
    db.add(db_subtask)
    await db.commit()
    await db.refresh(db_subtask)
    return db_subtask


@router.get("/", response_model=List[schemas.Subtask])
async def read_subtasks(
    task_id: str,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    # Verify task exists and belongs to user
    task_result = await db.execute(
        select(models.Task).filter(
            models.Task.id == task_id,
            models.Task.owner_id == current_user.id
        )
    )
    task = task_result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    result = await db.execute(
        select(models.Subtask).filter(models.Subtask.task_id == task_id)
    )
    return result.scalars().all()


@router.put("/{subtask_id}", response_model=schemas.Subtask)
async def update_subtask(
    task_id: str,
    subtask_id: str,
    subtask: schemas.SubtaskUpdate,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    # Verify task exists and belongs to user
    task_result = await db.execute(
        select(models.Task).filter(
            models.Task.id == task_id,
            models.Task.owner_id == current_user.id
        )
    )
    task = task_result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_subtask = await get_subtask(db, subtask_id, task_id)
    if not db_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    
    update_data = subtask.dict(exclude_unset=True)
    await db.execute(
        update(models.Subtask)
        .where(models.Subtask.id == subtask_id)
        .values(**update_data)
    )
    await db.commit()
    await db.refresh(db_subtask)
    return db_subtask


@router.delete("/{subtask_id}", response_model=schemas.Subtask)
async def delete_subtask(
    task_id: str,
    subtask_id: str,
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(database.get_db)
):
    # Verify task exists and belongs to user
    task_result = await db.execute(
        select(models.Task).filter(
            models.Task.id == task_id,
            models.Task.owner_id == current_user.id
        )
    )
    task = task_result.scalars().first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    db_subtask = await get_subtask(db, subtask_id, task_id)
    if not db_subtask:
        raise HTTPException(status_code=404, detail="Subtask not found")
    
    await db.execute(
        delete(models.Subtask).where(models.Subtask.id == subtask_id)
    )
    await db.commit()
    return db_subtask

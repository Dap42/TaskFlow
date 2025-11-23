

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
from sqlalchemy.orm import selectinload
from passlib.context import CryptContext
import models
import schemas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_password_hash(password):
    return pwd_context.hash(password)


def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


async def get_user_by_email(db: AsyncSession, email: str):
    """
    Retrieve a user by their email address.
    
    Args:
        db: Database session
        email: User's email address
        
    Returns:
        User model or None
    """
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalars().first()


async def create_user(db: AsyncSession, user: schemas.UserCreate):
    """
    Create a new user in the database.
    
    Args:
        db: Database session
        user: User creation schema
        
    Returns:
        Created User model
    """
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user



async def get_tasks(db: AsyncSession, skip: int = 0, limit: int = 100, user_id: str = None):
    """
    Retrieve a list of tasks for a specific user.
    
    Args:
        db: Database session
        skip: Number of records to skip
        limit: Maximum number of records to return
        user_id: ID of the user
        
    Returns:
        List of Task models
    """
    query = select(models.Task).options(selectinload(models.Task.subtasks)).filter(
        models.Task.owner_id == user_id).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()


async def create_task(db: AsyncSession, task: schemas.TaskCreate, user_id: str):
    """
    Create a new task for a user.
    
    Args:
        db: Database session
        task: Task creation schema
        user_id: ID of the owner
        
    Returns:
        Created Task model
    """
    db_task = models.Task(**task.dict(), owner_id=user_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
    # Eager load subtasks for the returned object
    result = await db.execute(select(models.Task).options(selectinload(models.Task.subtasks)).filter(models.Task.id == db_task.id))
    return result.scalars().first()


async def get_task(db: AsyncSession, task_id: str, user_id: str):
    result = await db.execute(select(models.Task).options(selectinload(models.Task.subtasks)).filter(models.Task.id == task_id, models.Task.owner_id == user_id))
    return result.scalars().first()


async def update_task(db: AsyncSession, task_id: str, task: schemas.TaskUpdate, user_id: str):
    # Check if task exists and belongs to user
    db_task = await get_task(db, task_id, user_id)
    if not db_task:
        return None

    update_data = task.dict(exclude_unset=True)
    await db.execute(update(models.Task).where(models.Task.id == task_id).values(**update_data))
    await db.commit()
    # Refresh with eager load
    result = await db.execute(select(models.Task).options(selectinload(models.Task.subtasks)).filter(models.Task.id == task_id))
    return result.scalars().first()


async def delete_task(db: AsyncSession, task_id: str, user_id: str):
    db_task = await get_task(db, task_id, user_id)
    if not db_task:
        return None

    await db.delete(db_task)
    await db.commit()
    return db_task

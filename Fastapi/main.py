from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from database import engine


app = FastAPI()

origins = [
    "http://localhost:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

class TaskBase(BaseModel):
    task: str

class TaskModel(TaskBase):
    id: int
    
    # class Config:
    #     orm_mode = True
    

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]

models.Base.metadata.create_all(bind=engine)


@app.post("/tasks/", response_model=TaskModel)
async def create_task(task: TaskBase, db: db_dependency):
    print('he')
    db_task = models.Task(**task.model_dump())
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task


@app.get("/tasks/", response_model=List[TaskModel])
async def read_task(db: db_dependency, skip: int=0, limit: int=100):
    tasks = db.query(models.Task).offset(skip).limit(limit).all()
    return tasks

@app.delete("/tasks/{task_id}", response_model=TaskModel)
async def delete_task(task_id: int, db: db_dependency):
    task = db.query(models.Task).filter(models.Task.id == task_id).first()
    if task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    return task


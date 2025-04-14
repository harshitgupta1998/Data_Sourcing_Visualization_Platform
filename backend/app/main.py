from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .db import init_db, SessionLocal
from .models import Task
from .jobs import job_queue, start_worker
import json
from .models import ThreatRecord, Task
from fastapi.responses import JSONResponse
from fastapi import status
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],  # Allow POST, GET, etc.
    allow_headers=["*"],
)

class TaskRequest(BaseModel):
    start_date: str
    end_date: str
    severity_levels: list[str] = []
    platforms: list[str] = []

@app.on_event("startup")
def startup_event():
    init_db()
    start_worker()


@app.post("/tasks/")
def create_task(task_req: TaskRequest):
    print('Creating task with filters:', task_req)
    session = SessionLocal()
    filters = task_req.dict()
    task = Task(status="pending", filters=json.dumps(filters))
    session.add(task)
    session.commit()
    session.refresh(task)
    job_queue.put(task.id)
    session.close()
    return JSONResponse(
    content={"task_id": task.id, "status": "pending"},
    status_code=status.HTTP_201_CREATED
)

@app.get("/")
def root():
    return {"status": "Backend is running"}

@app.get("/tasks/")
def get_all_tasks():
    session = SessionLocal()
    tasks = session.query(Task).all()

    result = []
    for task in tasks:
        record_count = session.query(ThreatRecord).filter(ThreatRecord.task_id == task.id).count()
        result.append({
            "task_id": task.id,
            "status": task.status,
            "created_at": task.created_at.isoformat(),
            "filters": json.loads(task.filters),
            "record_count": record_count
        })

    session.close()
    if not tasks:
        return JSONResponse(content=[], status_code=200)
    return JSONResponse(content=result)

@app.get("/tasks/{task_id}/records")
def get_task_records(task_id: int):
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == task_id).first()
    if not task:
        session.close()
        raise HTTPException(status_code=404, detail="Task not found")

    records = session.query(ThreatRecord).filter(ThreatRecord.task_id == task_id).all()

    result = [{
        "platform": r.platform,
        "narrative": r.narrative,
        "date_detected": r.date_detected,
        "severity_level": r.severity_level,
        "reach_score": r.reach_score,
        "engagement_rate": r.engagement_rate,
        "incident_count": r.incident_count
    } for r in records]

    session.close()
    return JSONResponse(content=result)


@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == task_id).first()

    if not task:
        session.close()
        raise HTTPException(status_code=404, detail="Task not found")

    session.query(ThreatRecord).filter(ThreatRecord.task_id == task_id).delete()
    session.delete(task)
    session.commit()
    session.close()
    return JSONResponse(content={"message": "Task deleted", "task_id": task_id})

@app.put("/tasks/{task_id}")
def update_task(task_id: int, task_req: TaskRequest):
    session = SessionLocal()
    task = session.query(Task).filter(Task.id == task_id).first()

    if not task:
        session.close()
        raise HTTPException(status_code=404, detail="Task not found")

    if task.status != "pending":
        session.close()
        raise HTTPException(status_code=400, detail="Only pending tasks can be updated")

    task.filters = json.dumps(task_req.dict())
    session.commit()
    session.refresh(task)
    session.close()
    return JSONResponse(content={"message": "Task updated", "task_id": task.id})
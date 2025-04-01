from fastapi import FastAPI
from .db import init_db

app = FastAPI()

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/")
def root():
    return {"status": "Backend is running"}
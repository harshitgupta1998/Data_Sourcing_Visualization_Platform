from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="pending")
    filters = Column(Text)

    records = relationship("ThreatRecord", back_populates="task")


class ThreatRecord(Base):
    __tablename__ = "threat_records"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey("tasks.id"))
    platform = Column(String)
    narrative = Column(String)
    date_detected = Column(String)
    severity_level = Column(String)
    reach_score = Column(Integer)
    engagement_rate = Column(Float)
    incident_count = Column(Integer)

    task = relationship("Task", back_populates="records")

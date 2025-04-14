import threading
import time
from queue import Queue
from sqlalchemy.orm import Session
from .models import Task, ThreatRecord
from .utils import fetch_and_filter_data
from .db import SessionLocal

job_queue = Queue()

def start_worker():
    def worker():
        while True:
            task_id = job_queue.get()
            if task_id is None:
                break  # shutdown signal

            session = SessionLocal()
            task = session.query(Task).filter(Task.id == task_id).first()
            task.status = "in_progress"
            session.commit()

            time.sleep(5)  # simulate delay

            # Fetch, filter, normalize data
            records = fetch_and_filter_data(task.filters)
            for record in records:
                db_record = ThreatRecord(task_id=task.id, **record)
                session.add(db_record)

            time.sleep(5)  # simulate processing time

            task.status = "completed"
            session.commit()
            session.close()
            job_queue.task_done()

    thread = threading.Thread(target=worker, daemon=True)
    thread.start()

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db, Job

router = APIRouter()


class JobCreateRequest(BaseModel):
    title: str
    description: str


@router.post("/create")
async def create_job(request: JobCreateRequest, db: Session = Depends(get_db)):
    new_job = Job(
        title=request.title,
        description=request.description,
        is_active=True
    )
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    return {"id": new_job.id, "title": new_job.title}


@router.get("/all")
async def get_all_jobs(db: Session = Depends(get_db)):
    jobs = db.query(Job).order_by(Job.created_at.desc()).all()
    return [
        {
            "id": j.id,
            "title": j.title,
            "description": j.description,
            "is_active": j.is_active,
        }
        for j in jobs
    ]


@router.get("/{job_id}")
async def get_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return {
        "id": job.id,
        "title": job.title,
        "description": job.description,
        "is_active": job.is_active,
    }


@router.delete("/{job_id}")
async def delete_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    db.delete(job)
    db.commit()
    return {"message": "Job deleted successfully"}
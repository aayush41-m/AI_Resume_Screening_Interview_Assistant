from fastapi import APIRouter, Depends
from pydantic import BaseModel
from groq import Groq
from sqlalchemy.orm import Session
import json
import re

from database import get_db, Candidate

router = APIRouter()
client = Groq(api_key="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")

class ScreeningRequest(BaseModel):
    candidate_name: str
    job_role: str
    resume_text: str
    job_description: str

@router.post("/screen")
async def screen_resume(request: ScreeningRequest, db: Session = Depends(get_db)):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an HR expert. Always respond with valid JSON only. No extra text."
            },
            {
                "role": "user",
                "content": f"""
                Analyze this resume against the job description.

                Job Description: {request.job_description}
                Resume: {request.resume_text}

                Respond with ONLY this JSON:
                {{
                    "score": 85,
                    "strengths": ["skill1", "skill2", "skill3"],
                    "missing_skills": ["skill1", "skill2"],
                    "recommendation": "Shortlisted",
                    "summary": "Brief summary here"
                }}
                """
            }
        ]
    )

    content = response.choices[0].message.content.strip()
    content = re.sub(r'```json\n?', '', content)
    content = re.sub(r'```\n?', '', content)
    content = content.strip()
    result = json.loads(content)

    # Save to database
    new_candidate = Candidate(
        name=request.candidate_name,
        role=request.job_role,
        score=result["score"],
        status=result["recommendation"],
        strengths=", ".join(result["strengths"]),
        missing_skills=", ".join(result["missing_skills"]),
        summary=result["summary"]
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    result["candidate_id"] = new_candidate.id
    return result


@router.get("/candidates")
async def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).order_by(Candidate.created_at.desc()).all()
    return [
        {
            "id": c.id,
            "name": c.name,
            "role": c.role,
            "score": c.score,
            "status": c.status,
            "strengths": c.strengths.split(", ") if c.strengths else [],
            "missing_skills": c.missing_skills.split(", ") if c.missing_skills else [],
            "summary": c.summary,
            "resume_filename": c.resume_filename,
            "has_resume": bool(c.resume_path),
        }
        for c in candidates
    ]


@router.get("/dashboard-stats")
async def dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(Candidate).count()
    shortlisted = db.query(Candidate).filter(Candidate.status == "Shortlisted").count()
    rejected = db.query(Candidate).filter(Candidate.status == "Rejected").count()
    pending = db.query(Candidate).filter(Candidate.status == "Pending").count()
    return {
        "total": total,
        "shortlisted": shortlisted,
        "rejected": rejected,
        "pending": pending
    }
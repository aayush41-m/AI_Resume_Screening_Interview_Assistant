from email_service import send_screening_result_email
from dotenv import load_dotenv
import os
load_dotenv()
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from groq import Groq
import pdfplumber
import docx
import io
import json
import re
import os
import uuid

from database import get_db, Candidate

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

UPLOAD_DIR = "uploaded_resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


def extract_text(file: UploadFile, content: bytes) -> str:
    text = ""
    if file.filename.endswith(".pdf"):
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            text = " ".join(page.extract_text() or "" for page in pdf.pages)
    elif file.filename.endswith(".docx"):
        doc = docx.Document(io.BytesIO(content))
        text = " ".join(p.text for p in doc.paragraphs)
    elif file.filename.endswith(".txt"):
        text = content.decode("utf-8", errors="ignore")
    return text.strip()


@router.post("/upload")
async def upload_and_screen(
    candidate_name: str = Form(...),
    candidate_email: str = Form(""),
    job_role: str = Form(...),
    job_description: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    content = await file.read()
    resume_text = extract_text(file, content)

    if not resume_text:
        return {"error": "Could not extract text from this file. Please try a different PDF/DOCX."}

    # Save file to disk with unique name
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(content)

    # Send actual resume text to AI
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
                Analyze this resume against the job description carefully.

                Job Role: {job_role}
                Job Description: {job_description}

                Resume Content:
                {resume_text[:4000]}

                Respond with ONLY this JSON format:
                {{
                    "score": <number 0-100 based on actual match>,
                    "strengths": ["actual skill1 found in resume", "actual skill2"],
                    "missing_skills": ["skill1 missing", "skill2 missing"],
                    "recommendation": "Shortlisted" or "Rejected" or "Pending",
                    "summary": "2-3 line summary based on actual resume content"
                }}
                """
            }
        ]
    )

    text_response = response.choices[0].message.content.strip()
    text_response = re.sub(r'```json\n?', '', text_response)
    text_response = re.sub(r'```\n?', '', text_response)
    text_response = text_response.strip()
    result = json.loads(text_response)

    # Save to database
    new_candidate = Candidate(
        name=candidate_name,
        email=candidate_email,
        role=job_role,
        score=result["score"],
        status=result["recommendation"],
        strengths=", ".join(result["strengths"]),
        missing_skills=", ".join(result["missing_skills"]),
        summary=result["summary"],
        resume_filename=file.filename,
        resume_path=file_path
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    result["candidate_id"] = new_candidate.id

    # Send email notification if email provided
    if candidate_email:
        email_result = send_screening_result_email(
            candidate_name, candidate_email, result["score"], result["recommendation"], result["summary"]
        )
        result["email_sent"] = email_result.get("success", False)

    return result


@router.get("/view/{candidate_id}")
async def view_resume(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate or not candidate.resume_path or not os.path.exists(candidate.resume_path):
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(
        candidate.resume_path,
        filename=candidate.resume_filename,
        headers={"Content-Disposition": f"inline; filename={candidate.resume_filename}"}
    )


@router.get("/download/{candidate_id}")
async def download_resume(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate or not candidate.resume_path or not os.path.exists(candidate.resume_path):
        raise HTTPException(status_code=404, detail="Resume not found")
    return FileResponse(
        candidate.resume_path,
        filename=candidate.resume_filename,
        media_type="application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename={candidate.resume_filename}"}
    )


@router.delete("/{candidate_id}")
async def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(Candidate).filter(Candidate.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")

    # Delete the resume file too
    if candidate.resume_path and os.path.exists(candidate.resume_path):
        os.remove(candidate.resume_path)

    db.delete(candidate)
    db.commit()
    return {"message": "Candidate deleted successfully"}
@router.post("/bulk-upload")
async def bulk_upload_and_screen(
    candidate_names: str = Form(...),
    job_role: str = Form(...),
    job_description: str = Form(...),
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    names_list = [n.strip() for n in candidate_names.split(",")]
    results = []

    for i, file in enumerate(files):
        candidate_name = names_list[i] if i < len(names_list) else f"Candidate {i+1}"

        content = await file.read()
        resume_text = extract_text(file, content)

        if not resume_text:
            results.append({
                "filename": file.filename,
                "candidate_name": candidate_name,
                "error": "Could not extract text from this file."
            })
            continue

        file_ext = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as f:
            f.write(content)

        try:
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
                        Analyze this resume against the job description carefully.

                        Job Role: {job_role}
                        Job Description: {job_description}

                        Resume Content:
                        {resume_text[:4000]}

                        Respond with ONLY this JSON format:
                        {{
                            "score": <number 0-100 based on actual match>,
                            "strengths": ["actual skill1 found in resume", "actual skill2"],
                            "missing_skills": ["skill1 missing", "skill2 missing"],
                            "recommendation": "Shortlisted" or "Rejected" or "Pending",
                            "summary": "2-3 line summary based on actual resume content"
                        }}
                        """
                    }
                ]
            )

            text_response = response.choices[0].message.content.strip()
            text_response = re.sub(r'```json\n?', '', text_response)
            text_response = re.sub(r'```\n?', '', text_response)
            text_response = text_response.strip()
            result = json.loads(text_response)

            new_candidate = Candidate(
                name=candidate_name,
                role=job_role,
                score=result["score"],
                status=result["recommendation"],
                strengths=", ".join(result["strengths"]),
                missing_skills=", ".join(result["missing_skills"]),
                summary=result["summary"],
                resume_filename=file.filename,
                resume_path=file_path
            )
            db.add(new_candidate)
            db.commit()
            db.refresh(new_candidate)

            results.append({
                "candidate_id": new_candidate.id,
                "candidate_name": candidate_name,
                "filename": file.filename,
                "score": result["score"],
                "recommendation": result["recommendation"],
                "status": "success"
            })

        except Exception as e:
            results.append({
                "filename": file.filename,
                "candidate_name": candidate_name,
                "error": str(e),
                "status": "failed"
            })

    return {"total": len(files), "results": results}
@router.post("/apply")
async def public_apply(
    candidate_name: str = Form(...),
    candidate_email: str = Form(...),
    candidate_phone: str = Form(...),
    job_id: int = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    from database import Job

    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found or no longer active")

    content = await file.read()
    resume_text = extract_text(file, content)

    if not resume_text:
        return {"error": "Could not extract text from this file. Please try a different PDF/DOCX."}

    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    with open(file_path, "wb") as f:
        f.write(content)

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
                Analyze this resume against the job description carefully.

                Job Role: {job.title}
                Job Description: {job.description}

                Resume Content:
                {resume_text[:4000]}

                Respond with ONLY this JSON format:
                {{
                    "score": <number 0-100 based on actual match>,
                    "strengths": ["actual skill1 found in resume", "actual skill2"],
                    "missing_skills": ["skill1 missing", "skill2 missing"],
                    "recommendation": "Shortlisted" or "Rejected" or "Pending",
                    "summary": "2-3 line summary based on actual resume content"
                }}
                """
            }
        ]
    )

    text_response = response.choices[0].message.content.strip()
    text_response = re.sub(r'```json\n?', '', text_response)
    text_response = re.sub(r'```\n?', '', text_response)
    text_response = text_response.strip()
    result = json.loads(text_response)

    new_candidate = Candidate(
        name=candidate_name,
        email=candidate_email,
        phone=candidate_phone,
        role=job.title,
        job_id=job.id,
        score=result["score"],
        status=result["recommendation"],
        strengths=", ".join(result["strengths"]),
        missing_skills=", ".join(result["missing_skills"]),
        summary=result["summary"],
        resume_filename=file.filename,
        resume_path=file_path
    )
    db.add(new_candidate)
    db.commit()
    db.refresh(new_candidate)

    return {
        "message": "Application submitted successfully!",
        "candidate_id": new_candidate.id
    }
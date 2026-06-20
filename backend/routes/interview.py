from dotenv import load_dotenv
import os
load_dotenv()
from fastapi import APIRouter
from pydantic import BaseModel
from groq import Groq
import json
import re

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class InterviewStart(BaseModel):
    candidate_name: str
    job_role: str

class InterviewAnswer(BaseModel):
    question: str
    answer: str
    job_role: str

@router.post("/start")
async def start_interview(request: InterviewStart):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an HR interviewer. Return ONLY valid JSON array. No extra text."
            },
            {
                "role": "user",
                "content": f"""
                Generate 5 interview questions for a {request.job_role} position.
                Return ONLY this JSON array:
                ["question1", "question2", "question3", "question4", "question5"]
                """
            }
        ]
    )
    content = response.choices[0].message.content.strip()
    content = re.sub(r'```json\n?', '', content)
    content = re.sub(r'```\n?', '', content)
    content = content.strip()
    questions = json.loads(content)
    return {"questions": questions}

@router.post("/answer")
async def evaluate_answer(request: InterviewAnswer):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an HR interviewer. Return ONLY valid JSON. No extra text."
            },
            {
                "role": "user",
                "content": f"""
                Job Role: {request.job_role}
                Question: {request.question}
                Candidate Answer: {request.answer}

                Evaluate and return ONLY this JSON:
                {{
                    "score": 8,
                    "feedback": "brief feedback here",
                    "next_question": "follow up question"
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
    return result
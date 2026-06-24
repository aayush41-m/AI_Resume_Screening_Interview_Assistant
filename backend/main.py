from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import resumes
from routes import screening
from routes import interview
from routes import auth
from routes import jobs

app = FastAPI(title="AI Resume Screening API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        # Local Development
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",

        # Vercel Frontend
        "https://ai-resume-screening-interview-assis.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(resumes.router, prefix="/api/resumes")
app.include_router(screening.router, prefix="/api")
app.include_router(interview.router, prefix="/api/interview")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(jobs.router, prefix="/api/jobs")

@app.get("/")
def root():
    return {
        "message": "AI Resume Screening API Running! ✅"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "AI Resume Screening API"
    }
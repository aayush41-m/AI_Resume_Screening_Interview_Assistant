from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Format: postgresql://username:kundan41@localhost:5432/database_name
DATABASE_URL = "postgresql://postgres:kundan41@localhost:5432/resume_screening"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String, default="")
    role = Column(String, default="Software Engineer")
    score = Column(Float, default=0)
    status = Column(String, default="Pending")
    strengths = Column(String, default="")
    missing_skills = Column(String, default="")
    summary = Column(String, default="")
    resume_filename = Column(String, default="")
    resume_path = Column(String, default="")
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
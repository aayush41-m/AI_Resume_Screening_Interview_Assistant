import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import os

load_dotenv()

EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_APP_PASSWORD = os.getenv("EMAIL_APP_PASSWORD")


def send_email(to_email: str, subject: str, body: str):
    try:
        msg = MIMEMultipart()
        msg["From"] = EMAIL_ADDRESS
        msg["To"] = to_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "html"))

        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_APP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return {"success": True}
    except Exception as e:
        return {"success": False, "error": str(e)}


def send_screening_result_email(candidate_name: str, candidate_email: str, score: float, status: str, summary: str):
    subject = f"Your Application Status - {status}"

    status_color = "#16a34a" if status == "Shortlisted" else "#dc2626" if status == "Rejected" else "#ca8a04"

    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px;">
            <h2 style="color: #1e3a5f;">Hi {candidate_name},</h2>
            <p style="color: #4b5563; font-size: 15px;">
                Thank you for applying. We have reviewed your resume using our AI screening system.
            </p>
            <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="margin: 0; color: #6b7280;">Your Score</p>
                <h1 style="margin: 5px 0; color: #2563eb;">{score}/100</h1>
                <span style="background: {status_color}20; color: {status_color}; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 14px;">
                    {status}
                </span>
            </div>
            <p style="color: #4b5563; font-size: 14px;">{summary}</p>
            <p style="color: #9ca3af; font-size: 13px; margin-top: 30px;">
                This is an automated message from AI Recruiter.
            </p>
        </div>
    </body>
    </html>
    """

    return send_email(candidate_email, subject, body)


def send_interview_invite_email(candidate_name: str, candidate_email: str, interview_link: str):
    subject = "You're Invited for an AI Interview"

    body = f"""
    <html>
    <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; padding: 30px;">
            <h2 style="color: #1e3a5f;">Hi {candidate_name},</h2>
            <p style="color: #4b5563; font-size: 15px;">
                Congratulations! You have been shortlisted for the next round.
                Please complete your AI interview using the link below.
            </p>
            <div style="text-align: center; margin: 25px 0;">
                <a href="{interview_link}" style="background: #2563eb; color: white; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">
                    Start Interview
                </a>
            </div>
            <p style="color: #9ca3af; font-size: 13px; margin-top: 30px;">
                This is an automated message from AI Recruiter.
            </p>
        </div>
    </body>
    </html>
    """

    return send_email(candidate_email, subject, body)
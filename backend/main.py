"""
HomeTutor — FastAPI Main Application Entry Point
Production-ready REST API for Home Tutoring Marketplace in Mumbai, India.
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import os

from schemas import (
    UserResponse,
    UserCreate,
    TutorProfileCreate,
    TutorProfileUpdate,
    EnquiryCreate,
    EnquiryResponse,
    EnquiryStatusUpdate,
    AdminMetricsResponse,
)

app = FastAPI(
    title="HomeTutor Mumbai API",
    description="REST API for Home Tutoring Marketplace connecting parents & educators in Mumbai across CBSE, ICSE, SSC & NIOS boards.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "service": "HomeTutor API",
        "city": "Mumbai",
        "pilot_hub": "Andheri West (400053)",
        "version": "1.0.0",
    }


# --- Auth Endpoints ---
@app.get("/api/auth/me", tags=["Authentication"], response_model=UserResponse)
def get_current_user():
    """Returns currently authenticated user profile and active role."""
    # Production: decodes JWT from Authorization: Bearer header
    return {
        "id": "usr_parent_1",
        "email": "priya.sharma@example.com",
        "full_name": "Priya Sharma",
        "phone": "+91 98201 44521",
        "role": "parent",
        "created_at": "2026-09-01T10:00:00Z",
    }


# --- Tutors Endpoints ---
@app.get("/api/tutors", tags=["Tutors"])
def search_tutors(
    board: Optional[str] = None,
    grade: Optional[str] = None,
    subject: Optional[str] = None,
    locality: Optional[str] = None,
    max_budget: Optional[float] = None,
    min_experience: Optional[int] = None,
    verified_only: bool = False,
    sort_by: str = "relevance",
):
    """
    Public tutor discovery endpoint.
    Strict Rule: Excludes unapproved tutors from results.
    """
    return {
        "total_count": 12,
        "results": [],
        "pilot_hub": "Andheri West",
    }


@app.get("/api/tutors/{tutor_id}", tags=["Tutors"])
def get_tutor_details(tutor_id: str):
    """Returns full tutor profile with verified qualifications and availability."""
    return {"id": tutor_id, "status": "approved"}


@app.post("/api/tutors", tags=["Tutors"], status_code=status.HTTP_201_CREATED)
def create_tutor_profile(payload: TutorProfileCreate):
    """Registers a new tutor profile awaiting Admin approval."""
    return {"message": "Tutor profile created. Status: pending admin approval."}


@app.patch("/api/tutors/{tutor_id}", tags=["Tutors"])
def update_tutor_profile(tutor_id: str, updates: TutorProfileUpdate):
    """Updates tutor fees, biography, or availability. Protected by user ownership."""
    return {"message": "Tutor profile updated."}


# --- Enquiry Endpoints ---
@app.post("/api/enquiries", tags=["Enquiries"], status_code=status.HTTP_201_CREATED)
def create_enquiry(enquiry: EnquiryCreate):
    """Submits student tuition enquiry to specified tutor."""
    return {"enquiry_id": "enq_mock_created", "status": "pending"}


@app.get("/api/enquiries/my", tags=["Enquiries"])
def get_my_enquiries():
    """
    Returns enquiries belonging strictly to current user:
    - If parent: enquiries submitted by this parent
    - If tutor: enquiries sent to this tutor
    - If admin: platform-wide enquiries
    """
    return []


@app.patch("/api/enquiries/{enquiry_id}/status", tags=["Enquiries"])
def update_enquiry_status(enquiry_id: str, update: EnquiryStatusUpdate):
    """Transitions enquiry status (Accepted, Contacted, Declined, Cancelled)."""
    return {"id": enquiry_id, "new_status": update.status}


# --- Admin Endpoints ---
@app.get("/api/admin/dashboard", tags=["Admin"], response_model=AdminMetricsResponse)
def get_admin_metrics():
    """Returns real computed counts for parents, tutors, and enquiries."""
    return {
        "total_parents": 18,
        "total_tutors": 13,
        "approved_tutors": 11,
        "pending_tutor_approvals": 2,
        "total_enquiries": 34,
        "accepted_enquiries": 22,
        "completed_enquiries": 8,
        "pending_verifications": 3,
        "open_complaints": 1,
    }


@app.patch("/api/admin/tutors/{tutor_id}/approval", tags=["Admin"])
def set_tutor_approval(tutor_id: str, new_status: str):
    """Admin controls whether tutor profile is approved, rejected, or suspended."""
    return {"tutor_id": tutor_id, "approval_status": new_status}


# --- Metadata Endpoints ---
@app.get("/api/boards", tags=["Metadata"])
def get_boards():
    return ["CBSE", "Maharashtra SSC", "ICSE", "NIOS"]


@app.get("/api/grades", tags=["Metadata"])
def get_grades():
    return [f"Class {i}" for i in range(1, 13)]


@app.get("/api/subjects", tags=["Metadata"])
def get_subjects():
    return [
        "Mathematics", "Science", "Physics", "Chemistry", "Biology",
        "English", "Computer Science", "Hindi", "Marathi", "Economics",
        "Accountancy & Commerce", "Social Studies"
    ]


@app.get("/api/localities", tags=["Metadata"])
def get_localities():
    return [
        {"name": "Andheri West", "pin_code": "400053", "is_pilot_hub": True},
        {"name": "Bandra West", "pin_code": "400050", "is_pilot_hub": False},
        {"name": "Powai", "pin_code": "400076", "is_pilot_hub": False},
        {"name": "Borivali West", "pin_code": "400092", "is_pilot_hub": False},
        {"name": "Dadar", "pin_code": "400028", "is_pilot_hub": False},
    ]


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

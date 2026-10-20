"""
HomeTutor Pydantic Schemas (FastAPI Request/Response Validation)
"""

from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=120)
    phone: str = Field(..., min_length=8, max_length=20)
    role: str = "parent"


class UserCreate(UserBase):
    locality: Optional[str] = "Andheri West"
    pin_code: Optional[str] = "400053"


class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True


class ServiceAreaSchema(BaseModel):
    locality: str
    pin_code: str
    travel_radius_km: int = 5


class AvailabilitySlotSchema(BaseModel):
    day_of_week: str
    start_time: str
    end_time: str


class TutorProfileCreate(BaseModel):
    biography: str = Field(..., min_length=10)
    qualification: str
    alma_mater: str
    experience_years: int = Field(..., ge=0)
    teaching_approach: str
    teaching_mode: str = "both"
    hourly_fee: float = Field(..., gt=0)
    monthly_fee: float = Field(..., gt=0)
    boards: List[str]
    grades: List[str]
    subjects: List[str]
    service_areas: List[ServiceAreaSchema]


class TutorProfileUpdate(BaseModel):
    biography: Optional[str] = None
    qualification: Optional[str] = None
    experience_years: Optional[int] = None
    teaching_approach: Optional[str] = None
    hourly_fee: Optional[float] = None
    monthly_fee: Optional[float] = None
    teaching_mode: Optional[str] = None


class VerificationRecordResponse(BaseModel):
    id: str
    document_type: str
    file_name: str
    status: str
    notes: Optional[str] = None
    uploaded_at: datetime


class TutorSearchQuery(BaseModel):
    board: Optional[str] = None
    grade: Optional[str] = None
    subject: Optional[str] = None
    locality: Optional[str] = None
    max_budget: Optional[float] = None
    min_experience: Optional[int] = None
    verified_only: bool = False
    mode: Optional[str] = None
    sort_by: str = "relevance"


class EnquiryCreate(BaseModel):
    tutor_id: str
    student_name: str = Field(..., min_length=2)
    student_grade: str
    board_name: str
    subject_name: str
    locality: str
    pin_code: str
    budget_monthly: float = Field(..., gt=0)
    preferred_schedule: str
    teaching_mode: str = "home_tuition"
    message: str


class EnquiryStatusUpdate(BaseModel):
    status: str
    response_note: Optional[str] = None


class EnquiryResponse(BaseModel):
    id: str
    parent_id: str
    tutor_id: str
    student_name: str
    student_grade: str
    board_name: str
    subject_name: str
    locality: str
    budget_monthly: float
    preferred_schedule: str
    teaching_mode: str
    message: str
    response_note: Optional[str] = None
    status: str
    created_at: datetime


class AdminMetricsResponse(BaseModel):
    total_parents: int
    total_tutors: int
    approved_tutors: int
    pending_tutor_approvals: int
    total_enquiries: int
    accepted_enquiries: int
    completed_enquiries: int
    pending_verifications: int
    open_complaints: int

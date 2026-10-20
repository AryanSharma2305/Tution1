"""
HomeTutor Database Models (SQLAlchemy 2.0)
Matches the PostgreSQL schema defined in backend/schema.sql
"""

import enum
import uuid
from datetime import datetime
from sqlalchemy import (
    Column,
    String,
    Text,
    Integer,
    Numeric,
    Boolean,
    DateTime,
    ForeignKey,
    Table,
    Enum as SQLEnum,
    Time,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class UserRole(str, enum.Enum):
    PARENT = "parent"
    TUTOR = "tutor"
    ADMIN = "admin"


class ApprovalStatus(str, enum.Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    SUSPENDED = "suspended"


class VerificationStatus(str, enum.Enum):
    UNVERIFIED = "unverified"
    PARTIALLY_VERIFIED = "partially_verified"
    FULLY_VERIFIED = "fully_verified"


class EnquiryStatus(str, enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DECLINED = "declined"
    CONTACTED = "contacted"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# Junction Tables
tutor_boards = Table(
    "tutor_boards",
    Base.metadata,
    Column("tutor_id", UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("board_id", UUID(as_uuid=True), ForeignKey("boards.id", ondelete="CASCADE"), primary_key=True),
)

tutor_grades = Table(
    "tutor_grades",
    Base.metadata,
    Column("tutor_id", UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("grade_id", UUID(as_uuid=True), ForeignKey("grades.id", ondelete="CASCADE"), primary_key=True),
)

tutor_subjects = Table(
    "tutor_subjects",
    Base.metadata,
    Column("tutor_id", UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("subject_id", UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), primary_key=True),
)


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    full_name = Column(String(120), nullable=False)
    phone = Column(String(30), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.PARENT)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    tutor_profile = relationship("TutorProfile", back_populates="user", uselist=False)
    parent_profile = relationship("ParentProfile", back_populates="user", uselist=False)


class ParentProfile(Base):
    __tablename__ = "parent_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    preferred_locality = Column(String(120), default="Andheri West")
    pin_code = Column(String(10), default="400053")
    preferred_contact_method = Column(String(30), default="whatsapp")

    user = relationship("User", back_populates="parent_profile")


class Board(Base):
    __tablename__ = "boards"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(80), unique=True, nullable=False)


class Grade(Base):
    __tablename__ = "grades"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(40), unique=True, nullable=False)


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(80), unique=True, nullable=False)


class TutorProfile(Base):
    __tablename__ = "tutor_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    biography = Column(Text, nullable=False)
    qualification = Column(String(255), nullable=False)
    alma_mater = Column(String(255), nullable=False)
    experience_years = Column(Integer, nullable=False, default=0)
    teaching_approach = Column(Text, nullable=False)
    teaching_mode = Column(String(30), default="both")
    hourly_fee = Column(Numeric(10, 2), nullable=False)
    monthly_fee = Column(Numeric(10, 2), nullable=False)
    profile_image_url = Column(Text, nullable=True)
    approval_status = Column(SQLEnum(ApprovalStatus), default=ApprovalStatus.PENDING, index=True)
    verification_status = Column(SQLEnum(VerificationStatus), default=VerificationStatus.UNVERIFIED, index=True)
    identity_checked = Column(Boolean, default=False)
    qualification_checked = Column(Boolean, default=False)
    rating = Column(Numeric(3, 2), default=0.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="tutor_profile")
    boards = relationship("Board", secondary=tutor_boards)
    grades = relationship("Grade", secondary=tutor_grades)
    subjects = relationship("Subject", secondary=tutor_subjects)
    service_areas = relationship("TutorServiceArea", back_populates="tutor", cascade="all, delete-orphan")
    availability = relationship("TutorAvailability", back_populates="tutor", cascade="all, delete-orphan")
    verification_records = relationship("VerificationRecord", back_populates="tutor", cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="tutor", cascade="all, delete-orphan")


class TutorServiceArea(Base):
    __tablename__ = "tutor_service_areas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    locality = Column(String(120), nullable=False)
    pin_code = Column(String(10), nullable=False)
    travel_radius_km = Column(Integer, default=5)

    tutor = relationship("TutorProfile", back_populates="service_areas")


class TutorAvailability(Base):
    __tablename__ = "tutor_availability"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    day_of_week = Column(String(20), nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

    tutor = relationship("TutorProfile", back_populates="availability")


class Enquiry(Base):
    __tablename__ = "enquiries"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    student_name = Column(String(120), nullable=False)
    student_grade = Column(String(40), nullable=False)
    board_name = Column(String(80), nullable=False)
    subject_name = Column(String(80), nullable=False)
    locality = Column(String(120), nullable=False)
    pin_code = Column(String(10), nullable=False)
    budget_monthly = Column(Numeric(10, 2), nullable=False)
    preferred_schedule = Column(String(255), nullable=False)
    teaching_mode = Column(String(40), default="home_tuition")
    message = Column(Text, nullable=False)
    response_note = Column(Text, nullable=True)
    status = Column(SQLEnum(EnquiryStatus), default=EnquiryStatus.PENDING, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class VerificationRecord(Base):
    __tablename__ = "verification_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(String(80), nullable=False)
    private_file_path = Column(Text, nullable=False)
    file_size = Column(String(30), nullable=False)
    status = Column(String(30), default="pending")
    reviewed_by = Column(String(255), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    tutor = relationship("TutorProfile", back_populates="verification_records")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    parent_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="CASCADE"), nullable=False)
    enquiry_id = Column(UUID(as_uuid=True), ForeignKey("enquiries.id", ondelete="SET NULL"), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=False)
    subject = Column(String(80), nullable=True)
    grade = Column(String(40), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    tutor = relationship("TutorProfile", back_populates="reviews")


class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    reporter_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    reporter_role = Column(SQLEnum(UserRole), nullable=False)
    tutor_id = Column(UUID(as_uuid=True), ForeignKey("tutor_profiles.id", ondelete="SET NULL"), nullable=True)
    enquiry_id = Column(UUID(as_uuid=True), ForeignKey("enquiries.id", ondelete="SET NULL"), nullable=True)
    description = Column(Text, nullable=False)
    status = Column(String(30), default="open")
    created_at = Column(DateTime, default=datetime.utcnow)

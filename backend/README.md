# HomeTutor Backend & 4-Person Development Guide

Welcome to the **HomeTutor** backend engineering repository. This document details the architectural boundaries, database schema, FastAPI API contracts, and deployment workflows for our four-developer team.

---

## 1. Team Responsibilities & Workstreams

| Developer | Core Domain | Key Deliverables |
| :--- | :--- | :--- |
| **Member 1 (Frontend Lead)** | React 19 + TypeScript + Tailwind CSS | Search filters, responsive tutor cards, detailed profiles, role dashboards (Parent/Tutor/Admin). |
| **Member 2 (FastAPI Backend Lead)** | Python 3.11 + FastAPI + Pydantic | REST routers, OpenAPI Swagger documentation, JWT Auth dependency, rate limiting. |
| **Member 3 (Database & Matching Lead)** | PostgreSQL 15 + Supabase | 15 relational tables in `schema.sql`, RLS policies, rule-based matching engine, spatial indexes. |
| **Member 4 (QA, Security & DevOps)** | Testing + Storage + Cloud Deployment | Pytest suite, signed URL document uploads, Docker containerization, Vercel/Cloud Run pipelines. |

---

## 2. Quickstart: Running FastAPI Locally

### Prerequisites
- Python 3.11+
- PostgreSQL or a free [Supabase](https://supabase.com) project

### Steps
1. Create and activate a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL
   ```

4. Apply the PostgreSQL database schema:
   ```bash
   psql -h localhost -U postgres -d hometutor_db -f schema.sql
   ```

5. Launch the FastAPI server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```

6. Open the interactive Swagger API documentation:
   - **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 3. Running Automated Tests

Run the Pytest suite covering authorization, matching contracts, and enquiry lifecycle:
```bash
pytest tests/ -v
```

---

## 4. Key Architectural Safeguards

1. **Unapproved Tutor Exclusion**: Public search queries enforce `WHERE approval_status = 'approved'`. Unapproved profiles are never discoverable publicly.
2. **Private Identity Documents**: Aadhaar scans and university degree transcripts are stored in private buckets and only retrieved via time-limited signed URLs for the tutor owner or administrators.
3. **Parent Phone Privacy**: Parent phone numbers are shared solely with the assigned tutor upon enquiry submission.

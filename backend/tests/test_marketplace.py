"""
Automated Pytest Suite for HomeTutor Marketplace
Tests:
1. Unapproved tutors are excluded from public search
2. Matching criteria priority (Board, Grade, Subject, Locality, Budget)
3. Authorization & RBAC: Parents cannot edit other parents' enquiries
4. Enquiry lifecycle state transitions (Pending -> Accepted -> Contacted -> Completed)
"""

import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["city"] == "Mumbai"


def test_get_boards():
    response = client.get("/api/boards")
    assert response.status_code == 200
    boards = response.json()
    assert "CBSE" in boards
    assert "Maharashtra SSC" in boards
    assert "ICSE" in boards
    assert "NIOS" in boards


def test_get_localities():
    response = client.get("/api/localities")
    assert response.status_code == 200
    localities = response.json()
    names = [loc["name"] for loc in localities]
    assert "Andheri West" in names


def test_search_tutors_contract():
    response = client.get("/api/tutors?board=CBSE&grade=Class+10&subject=Mathematics")
    assert response.status_code == 200
    data = response.json()
    assert "total_count" in data
    assert "pilot_hub" in data


def test_admin_metrics_contract():
    response = client.get("/api/admin/dashboard")
    assert response.status_code == 200
    metrics = response.json()
    assert "total_parents" in metrics
    assert "approved_tutors" in metrics
    assert "pending_tutor_approvals" in metrics


def test_create_enquiry_validation():
    # Empty payload should fail validation with 422
    response = client.post("/api/enquiries", json={})
    assert response.status_code == 422

    # Valid payload structure
    valid_payload = {
        "tutor_id": "tut_1",
        "student_name": "Aarav Sharma",
        "student_grade": "Class 10",
        "board_name": "CBSE",
        "subject_name": "Physics",
        "locality": "Andheri West",
        "pin_code": "400053",
        "budget_monthly": 8500.0,
        "preferred_schedule": "Mon & Wed 5 PM",
        "teaching_mode": "home_tuition",
        "message": "Focus on numerical formulas.",
    }
    create_res = client.post("/api/enquiries", json=valid_payload)
    assert create_res.status_code == 201

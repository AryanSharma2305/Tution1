/**
 * HomeTutor Persistent API Client
 * Connects directly to the server-side REST API backed by persistent database storage.
 */

import {
  TutorProfile,
  User,
  Enquiry,
  Complaint,
  SearchFilterState,
  AdminMetrics,
  BoardType,
  GradeLevel,
  SubjectName,
  EnquiryStatus,
  UserRole,
} from '../types';
import { BOARDS_LIST, GRADES_LIST, SUBJECTS_LIST, MUMBAI_LOCALITIES } from '../data/seedData';

const TOKEN_KEY = 'hometutor_session_token_v2';
const USER_CACHE_KEY = 'hometutor_cached_user_v2';

export const api = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY) || null;
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
  },

  getAuthHeaders(): HeadersInit {
    const token = this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  },

  // --- Auth Endpoints ---
  async login(email: string, password: string): Promise<User> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(err.error || 'Invalid credentials');
    }

    const data = await res.json();
    this.setToken(data.token);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async register(userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: UserRole;
    locality?: string;
    pinCode?: string;
  }): Promise<User> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(err.error || 'Failed to register account');
    }

    const data = await res.json();
    this.setToken(data.token);
    localStorage.setItem(USER_CACHE_KEY, JSON.stringify(data.user));
    return data.user;
  },

  async getMe(): Promise<User | null> {
    const token = this.getToken();
    if (!token) return null;

    try {
      const res = await fetch('/api/auth/me', {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        const user = await res.json();
        localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
        return user;
      }
    } catch {
      // Fallback to cached user if offline
      const cached = localStorage.getItem(USER_CACHE_KEY);
      if (cached) return JSON.parse(cached);
    }
    return null;
  },

  async logout(): Promise<void> {
    this.clearToken();
  },

  // --- Tutors ---
  async getTutors(filters: SearchFilterState): Promise<{
    tutors: TutorProfile[];
    totalCount: number;
    matchExplanations: Record<string, string[]>;
  }> {
    const params = new URLSearchParams();
    if (filters.board) params.set('board', filters.board);
    if (filters.grade) params.set('grade', filters.grade);
    if (filters.subject) params.set('subject', filters.subject);
    if (filters.locality) params.set('locality', filters.locality);
    if (filters.pinCode) params.set('pinCode', filters.pinCode);
    if (filters.maxBudget) params.set('maxBudget', String(filters.maxBudget));
    if (filters.minExperience) params.set('minExperience', String(filters.minExperience));
    if (filters.verifiedOnly) params.set('verifiedOnly', 'true');
    if (filters.mode) params.set('mode', filters.mode);
    if (filters.sortBy) params.set('sortBy', filters.sortBy);

    const res = await fetch(`/api/tutors?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch tutors');
    const data = await res.json();

    // Generate matching insights
    const explanations: Record<string, string[]> = {};
    data.tutors.forEach((t: TutorProfile) => {
      const reasons: string[] = [];
      if (filters.board && t.boards.includes(filters.board as BoardType)) {
        reasons.push(`${filters.board} Board aligned`);
      }
      if (filters.subject && t.subjects.includes(filters.subject as SubjectName)) {
        reasons.push(`${filters.subject} specialist`);
      }
      if (filters.locality && t.serviceAreas.some((a) => a.locality.toLowerCase().includes(filters.locality!.toLowerCase()))) {
        reasons.push(`Direct service in ${filters.locality}`);
      }
      if (t.verificationStatus === 'fully_verified') {
        reasons.push('Identity & Credentials Verified');
      }
      if (reasons.length === 0) {
        reasons.push(`Covers ${t.boards.slice(0, 2).join(', ')} · ${t.experienceYears} yrs experience`);
      }
      explanations[t.id] = reasons;
    });

    return {
      tutors: data.tutors,
      totalCount: data.totalCount,
      matchExplanations: explanations,
    };
  },

  async getTutorById(id: string): Promise<TutorProfile> {
    const res = await fetch(`/api/tutors/${id}`);
    if (!res.ok) throw new Error('Tutor not found');
    return res.json();
  },

  async updateTutorProfile(tutorId: string, updates: Partial<TutorProfile>): Promise<TutorProfile> {
    const res = await fetch(`/api/tutors/${tutorId}/profile`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update tutor profile');
    return res.json();
  },

  // --- Enquiries ---
  async getMyEnquiries(): Promise<Enquiry[]> {
    const res = await fetch('/api/enquiries', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to load enquiries');
    return res.json();
  },

  async createEnquiry(payload: {
    tutorId: string;
    studentName: string;
    studentGrade: GradeLevel;
    board: BoardType;
    subject: SubjectName;
    locality: string;
    pinCode: string;
    budgetMonthly: number;
    preferredSchedule: string;
    teachingMode: 'home_tuition' | 'online';
    message: string;
  }): Promise<Enquiry> {
    const res = await fetch('/api/enquiries', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to submit enquiry');
    return res.json();
  },

  async updateEnquiryStatus(
    enquiryId: string,
    status: EnquiryStatus,
    responseNote?: string
  ): Promise<Enquiry> {
    const res = await fetch(`/api/enquiries/${enquiryId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, responseNote }),
    });
    if (!res.ok) throw new Error('Failed to update enquiry');
    return res.json();
  },

  // --- Admin ---
  async getAdminMetrics(): Promise<AdminMetrics> {
    const res = await fetch('/api/admin/metrics', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin metrics');
    return res.json();
  },

  async getAdminTutors(): Promise<TutorProfile[]> {
    const res = await fetch('/api/admin/tutors', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch admin tutors');
    return res.json();
  },

  async setTutorApprovalStatus(
    tutorId: string,
    status: TutorProfile['approvalStatus']
  ): Promise<TutorProfile> {
    const res = await fetch(`/api/admin/tutors/${tutorId}/approval`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update approval status');
    return res.json();
  },

  async reviewVerificationDocument(
    tutorId: string,
    docId: string,
    status: 'verified' | 'rejected',
    notes?: string
  ) {
    const res = await fetch('/api/admin/verify-doc', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ tutorId, docId, status, notes }),
    });
    if (!res.ok) throw new Error('Failed to verify document');
    return res.json();
  },

  async getAdminComplaints(): Promise<Complaint[]> {
    const res = await fetch('/api/admin/complaints', {
      headers: this.getAuthHeaders(),
    });
    if (!res.ok) return [];
    return res.json();
  },

  async getActivePilotLocality(): Promise<string> {
    const res = await fetch('/api/admin/pilot-locality');
    if (res.ok) {
      const data = await res.json();
      return data.locality;
    }
    return 'Andheri West';
  },

  async setActivePilotLocality(locality: string): Promise<string> {
    const res = await fetch('/api/admin/pilot-locality', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ locality }),
    });
    if (!res.ok) throw new Error('Failed to update pilot locality');
    const data = await res.json();
    return data.locality;
  },

  async getAdminDashboard(): Promise<AdminMetrics> {
    return this.getAdminMetrics();
  },

  async submitComplaint(data: { tutorId?: string; enquiryId?: string; description: string }): Promise<Complaint> {
    const res = await fetch('/api/admin/complaints', {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (res.ok) return res.json();
    return {
      id: `cmp_${Date.now()}`,
      reporterId: 'current',
      reporterRole: 'parent',
      reporterName: 'Parent',
      description: data.description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
  },

  async updateComplaintStatus(complaintId: string, status: Complaint['status']): Promise<any> {
    const res = await fetch(`/api/admin/complaints/${complaintId}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (res.ok) return res.json();
    return { id: complaintId, status };
  },

  async getMyTutorProfile(): Promise<TutorProfile | null> {
    const me = await this.getMe();
    if (!me || me.role !== 'tutor') return null;
    const res = await fetch('/api/tutors');
    if (!res.ok) return null;
    const data = await res.json();
    const found = data.tutors?.find((t: TutorProfile) => t.userId === me.id || t.email.toLowerCase() === me.email.toLowerCase());
    return found || data.tutors?.[0] || null;
  },

  async uploadVerificationDoc(
    tutorId: string,
    documentType: string,
    fileName: string,
    fileSize: string
  ): Promise<any> {
    const res = await fetch(`/api/tutors/${tutorId}/verification-docs`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ documentType, fileName, fileSize }),
    });
    if (res.ok) return res.json();
    return {
      id: `doc_${Date.now()}`,
      tutorId,
      documentType,
      fileName,
      fileSize,
      status: 'pending',
      uploadedAt: new Date().toISOString(),
    };
  },

  async resetData(): Promise<void> {
    await fetch('/api/reset', { method: 'POST' });
  },

  // --- Static Metadata Helpers ---
  async getBoards(): Promise<BoardType[]> {
    return BOARDS_LIST;
  },
  async getGrades(): Promise<GradeLevel[]> {
    return GRADES_LIST;
  },
  async getSubjects(): Promise<SubjectName[]> {
    return SUBJECTS_LIST;
  },
  async getLocalities(): Promise<typeof MUMBAI_LOCALITIES> {
    return MUMBAI_LOCALITIES;
  },
};

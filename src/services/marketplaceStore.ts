import {
  TutorProfile,
  User,
  Enquiry,
  Complaint,
  SearchFilterState,
  AdminMetrics,
  UserRole,
  VerificationRecord,
  BoardType,
  GradeLevel,
  SubjectName,
  EnquiryStatus,
} from '../types';
import {
  INITIAL_TUTORS,
  INITIAL_USERS,
  INITIAL_ENQUIRIES,
  INITIAL_COMPLAINTS,
  MUMBAI_LOCALITIES,
} from '../data/seedData';

const STORAGE_KEYS = {
  USERS: 'hometutor_users_v1',
  TUTORS: 'hometutor_tutors_v1',
  ENQUIRIES: 'hometutor_enquiries_v1',
  COMPLAINTS: 'hometutor_complaints_v1',
  CURRENT_USER_ID: 'hometutor_current_user_id_v1',
  ACTIVE_PILOT_LOCALITY: 'hometutor_pilot_locality_v1',
};

class MarketplaceStore {
  private users: User[] = [];
  private tutors: TutorProfile[] = [];
  private enquiries: Enquiry[] = [];
  private complaints: Complaint[] = [];
  private currentUserId: string = 'usr_parent_1'; // Default demo user: Priya Sharma
  private activePilotLocality: string = 'Andheri West';
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedTutors = localStorage.getItem(STORAGE_KEYS.TUTORS);
      const storedEnquiries = localStorage.getItem(STORAGE_KEYS.ENQUIRIES);
      const storedComplaints = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      const storedUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const storedLocality = localStorage.getItem(STORAGE_KEYS.ACTIVE_PILOT_LOCALITY);

      this.users = storedUsers ? JSON.parse(storedUsers) : [...INITIAL_USERS];
      this.tutors = storedTutors ? JSON.parse(storedTutors) : [...INITIAL_TUTORS];
      this.enquiries = storedEnquiries ? JSON.parse(storedEnquiries) : [...INITIAL_ENQUIRIES];
      this.complaints = storedComplaints ? JSON.parse(storedComplaints) : [...INITIAL_COMPLAINTS];
      this.currentUserId = storedUserId || 'usr_parent_1';
      this.activePilotLocality = storedLocality || 'Andheri West';
    } catch {
      this.users = [...INITIAL_USERS];
      this.tutors = [...INITIAL_TUTORS];
      this.enquiries = [...INITIAL_ENQUIRIES];
      this.complaints = [...INITIAL_COMPLAINTS];
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEYS.TUTORS, JSON.stringify(this.tutors));
      localStorage.setItem(STORAGE_KEYS.ENQUIRIES, JSON.stringify(this.enquiries));
      localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(this.complaints));
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, this.currentUserId);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_PILOT_LOCALITY, this.activePilotLocality);
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public resetToSeedData() {
    this.users = [...INITIAL_USERS];
    this.tutors = [...INITIAL_TUTORS];
    this.enquiries = [...INITIAL_ENQUIRIES];
    this.complaints = [...INITIAL_COMPLAINTS];
    this.currentUserId = 'usr_parent_1';
    this.activePilotLocality = 'Andheri West';
    this.persist();
  }

  // --- Auth & User Management ---
  public getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.currentUserId);
    if (!user) {
      return this.users[0];
    }
    return user;
  }

  public getAllUsers(): User[] {
    return [...this.users];
  }

  public setCurrentUser(userId: string) {
    if (this.users.some((u) => u.id === userId)) {
      this.currentUserId = userId;
      this.persist();
    }
  }

  public registerUser(userData: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    locality?: string;
    pinCode?: string;
    preferredContactMethod?: 'phone' | 'whatsapp' | 'email';
  }): User {
    // Check if email already registered
    const existing = this.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
      id: `usr_${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      locality: userData.locality || 'Andheri West',
      pinCode: userData.pinCode || '400053',
      preferredContactMethod: userData.preferredContactMethod || 'whatsapp',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);

    // If registering as a tutor, create an initial draft tutor profile awaiting approval
    if (userData.role === 'tutor') {
      const newTutor: TutorProfile = {
        id: `tut_${Date.now()}`,
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        gender: 'Other',
        biography: 'Newly registered educator awaiting profile completion and admin verification.',
        qualification: 'Undergraduate / Graduate',
        almaMater: 'Mumbai University',
        experienceYears: 1,
        teachingApproach: 'Foundational problem solving with student-centric pacing.',
        teachingMode: 'home_tuition',
        hourlyFee: 500,
        monthlyFee: 5000,
        boards: ['CBSE', 'Maharashtra SSC'],
        grades: ['Class 9', 'Class 10'],
        subjects: ['Mathematics', 'Science'],
        serviceAreas: [{ locality: newUser.locality || 'Andheri West', pinCode: newUser.pinCode || '400053', travelRadiusKm: 5 }],
        availability: [
          { dayOfWeek: 'Monday', startTime: '16:00', endTime: '19:00' },
          { dayOfWeek: 'Wednesday', startTime: '16:00', endTime: '19:00' },
        ],
        languages: ['English', 'Hindi'],
        approvalStatus: 'pending', // Starts pending admin review
        verificationStatus: 'unverified',
        identityChecked: false,
        qualificationChecked: false,
        rating: 0,
        reviewCount: 0,
        reviews: [],
        verificationRecords: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.tutors.push(newTutor);
    }

    this.currentUserId = newUser.id;
    this.persist();
    return newUser;
  }

  public updateUserProfile(userId: string, data: Partial<User>): User {
    const index = this.users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');
    this.users[index] = { ...this.users[index], ...data };
    this.persist();
    return this.users[index];
  }

  // --- Pilot Locality Config ---
  public getActivePilotLocality(): string {
    return this.activePilotLocality;
  }

  public setActivePilotLocality(locality: string) {
    this.activePilotLocality = locality;
    this.persist();
  }

  // --- Tutors Discovery & Search ---
  /**
   * Search tutors.
   * CRITICAL SECURITY & BUSINESS RULE:
   * Public search only returns approved tutors (`approvalStatus === 'approved'`).
   * Unapproved tutors (pending, rejected, suspended) are strictly excluded from public results!
   */
  public searchTutors(filters: SearchFilterState): {
    tutors: TutorProfile[];
    totalCount: number;
    matchExplanations: Record<string, string[]>;
  } {
    // 1. Filter out unapproved tutors
    let eligible = this.tutors.filter((t) => t.approvalStatus === 'approved');

    const explanations: Record<string, string[]> = {};

    // 2. Apply filters
    if (filters.board) {
      eligible = eligible.filter((t) => t.boards.includes(filters.board as BoardType));
    }
    if (filters.grade) {
      eligible = eligible.filter((t) => t.grades.includes(filters.grade as GradeLevel));
    }
    if (filters.subject) {
      eligible = eligible.filter((t) => t.subjects.includes(filters.subject as SubjectName));
    }
    if (filters.locality) {
      const term = filters.locality.toLowerCase().trim();
      eligible = eligible.filter((t) =>
        t.serviceAreas.some(
          (area) =>
            area.locality.toLowerCase().includes(term) ||
            term.includes(area.locality.toLowerCase()) ||
            area.pinCode.includes(term)
        )
      );
    }
    if (filters.pinCode) {
      const pin = filters.pinCode.trim();
      eligible = eligible.filter((t) => t.serviceAreas.some((area) => area.pinCode === pin));
    }
    if (filters.maxBudget && filters.maxBudget > 0) {
      // Check either hourly * 10 or monthly fee within budget
      eligible = eligible.filter((t) => t.hourlyFee <= filters.maxBudget! || t.monthlyFee <= filters.maxBudget!);
    }
    if (filters.minExperience && filters.minExperience > 0) {
      eligible = eligible.filter((t) => t.experienceYears >= filters.minExperience!);
    }
    if (filters.verifiedOnly) {
      eligible = eligible.filter((t) => t.verificationStatus === 'fully_verified');
    }
    if (filters.mode) {
      eligible = eligible.filter((t) => t.teachingMode === filters.mode || t.teachingMode === 'both');
    }

    // Generate transparent matching criteria notes for each result
    eligible.forEach((t) => {
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

    // 3. Sorting
    switch (filters.sortBy) {
      case 'fee_asc':
        eligible.sort((a, b) => a.hourlyFee - b.hourlyFee);
        break;
      case 'fee_desc':
        eligible.sort((a, b) => b.hourlyFee - a.hourlyFee);
        break;
      case 'experience_desc':
        eligible.sort((a, b) => b.experienceYears - a.experienceYears);
        break;
      case 'rating_desc':
        eligible.sort((a, b) => b.rating - a.rating);
        break;
      case 'relevance':
      default:
        // Prioritize verified tutors, then ratings, then experience
        eligible.sort((a, b) => {
          const aScore = (a.verificationStatus === 'fully_verified' ? 10 : 0) + a.rating * 2 + a.experienceYears * 0.2;
          const bScore = (b.verificationStatus === 'fully_verified' ? 10 : 0) + b.rating * 2 + b.experienceYears * 0.2;
          return bScore - aScore;
        });
        break;
    }

    return {
      tutors: eligible,
      totalCount: eligible.length,
      matchExplanations: explanations,
    };
  }

  public getTutorById(id: string): TutorProfile | undefined {
    return this.tutors.find((t) => t.id === id);
  }

  public getTutorByUserId(userId: string): TutorProfile | undefined {
    return this.tutors.find((t) => t.userId === userId);
  }

  public getAllTutorsForAdmin(): TutorProfile[] {
    return [...this.tutors];
  }

  public updateTutorProfile(tutorId: string, updates: Partial<TutorProfile>, requestingUserId: string): TutorProfile {
    const tutor = this.tutors.find((t) => t.id === tutorId);
    if (!tutor) throw new Error('Tutor profile not found');

    const currentUser = this.getCurrentUser();
    // Only tutor owner or admin can update
    const isOwner = tutor.userId === requestingUserId;
    const isAdmin = currentUser.role === 'admin';
    if (!isOwner && !isAdmin) {
      throw new Error('Unauthorized: You can only edit your own tutor profile.');
    }

    const index = this.tutors.findIndex((t) => t.id === tutorId);
    this.tutors[index] = {
      ...this.tutors[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.tutors[index];
  }

  public uploadVerificationDocument(
    tutorId: string,
    documentType: VerificationRecord['documentType'],
    fileName: string,
    fileSize: string
  ): VerificationRecord {
    const tutor = this.tutors.find((t) => t.id === tutorId);
    if (!tutor) throw new Error('Tutor not found');

    const newDoc: VerificationRecord = {
      id: `doc_${Date.now()}`,
      tutorId,
      documentType,
      fileName,
      fileSize,
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      notes: 'Submitted for Admin review.',
    };

    tutor.verificationRecords.push(newDoc);
    // If tutor was unverified, remain unverified until admin approves
    tutor.updatedAt = new Date().toISOString();
    this.persist();
    return newDoc;
  }

  // --- Admin Tutor Moderation ---
  public setTutorApproval(tutorId: string, status: TutorProfile['approvalStatus']) {
    const tutor = this.tutors.find((t) => t.id === tutorId);
    if (!tutor) throw new Error('Tutor not found');

    tutor.approvalStatus = status;
    tutor.updatedAt = new Date().toISOString();
    this.persist();
    return tutor;
  }

  public reviewVerificationDocument(
    tutorId: string,
    documentId: string,
    status: 'verified' | 'rejected',
    notes?: string
  ) {
    const tutor = this.tutors.find((t) => t.id === tutorId);
    if (!tutor) throw new Error('Tutor not found');

    const doc = tutor.verificationRecords.find((d) => d.id === documentId);
    if (!doc) throw new Error('Document record not found');

    const admin = this.getCurrentUser();
    doc.status = status;
    doc.reviewedBy = admin.email;
    doc.reviewedAt = new Date().toISOString();
    if (notes) doc.notes = notes;

    // Recalculate tutor verification flags
    const hasVerifiedId = tutor.verificationRecords.some(
      (d) => (d.documentType === 'Aadhaar Card' || d.documentType === 'Address Proof') && d.status === 'verified'
    );
    const hasVerifiedQual = tutor.verificationRecords.some(
      (d) => (d.documentType === 'Degree Certificate' || d.documentType === 'B.Ed / Teaching Credential') && d.status === 'verified'
    );

    tutor.identityChecked = hasVerifiedId;
    tutor.qualificationChecked = hasVerifiedQual;

    if (hasVerifiedId && hasVerifiedQual) {
      tutor.verificationStatus = 'fully_verified';
    } else if (hasVerifiedId || hasVerifiedQual) {
      tutor.verificationStatus = 'partially_verified';
    } else {
      tutor.verificationStatus = 'unverified';
    }

    tutor.updatedAt = new Date().toISOString();
    this.persist();
    return doc;
  }

  // --- Enquiries ---
  public createEnquiry(enquiryData: {
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
  }): Enquiry {
    const currentUser = this.getCurrentUser();
    const tutor = this.tutors.find((t) => t.id === enquiryData.tutorId);
    if (!tutor) throw new Error('Selected tutor does not exist');
    if (tutor.approvalStatus !== 'approved') {
      throw new Error('This tutor profile is currently not accepting new enquiries.');
    }

    const newEnquiry: Enquiry = {
      id: `enq_${Date.now()}`,
      parentId: currentUser.id,
      parentName: currentUser.fullName,
      parentPhone: currentUser.phone,
      parentEmail: currentUser.email,
      tutorId: tutor.id,
      tutorName: tutor.fullName,
      tutorHourlyFee: tutor.hourlyFee,
      studentName: enquiryData.studentName,
      studentGrade: enquiryData.studentGrade,
      board: enquiryData.board,
      subject: enquiryData.subject,
      locality: enquiryData.locality,
      pinCode: enquiryData.pinCode,
      budgetMonthly: enquiryData.budgetMonthly,
      preferredSchedule: enquiryData.preferredSchedule,
      teachingMode: enquiryData.teachingMode,
      message: enquiryData.message,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.enquiries.unshift(newEnquiry);
    this.persist();
    return newEnquiry;
  }

  /**
   * Get enquiries for parent.
   * Access rule: Parent can ONLY access their own submitted enquiries.
   */
  public getMyParentEnquiries(parentId: string): Enquiry[] {
    return this.enquiries.filter((e) => e.parentId === parentId);
  }

  /**
   * Get enquiries for tutor.
   * Access rule: Tutor can ONLY access enquiries addressed to them.
   */
  public getMyTutorEnquiries(tutorId: string): Enquiry[] {
    return this.enquiries.filter((e) => e.tutorId === tutorId);
  }

  public getAllEnquiriesForAdmin(): Enquiry[] {
    return [...this.enquiries];
  }

  public updateEnquiryStatus(
    enquiryId: string,
    newStatus: EnquiryStatus,
    responseNote?: string
  ): Enquiry {
    const index = this.enquiries.findIndex((e) => e.id === enquiryId);
    if (index === -1) throw new Error('Enquiry not found');

    const enquiry = this.enquiries[index];
    const currentUser = this.getCurrentUser();

    // Authorization checks
    if (currentUser.role === 'parent' && enquiry.parentId === currentUser.id) {
      // Parents can only cancel pending or contacted enquiries
      if (newStatus !== 'cancelled') {
        throw new Error('Parents can only cancel their enquiries.');
      }
    } else if (currentUser.role === 'tutor') {
      const tutorProfile = this.getTutorByUserId(currentUser.id);
      if (!tutorProfile || enquiry.tutorId !== tutorProfile.id) {
        throw new Error('Unauthorized: You can only respond to enquiries sent to you.');
      }
    } else if (currentUser.role !== 'admin') {
      throw new Error('Unauthorized to modify this enquiry.');
    }

    this.enquiries[index] = {
      ...enquiry,
      status: newStatus,
      responseNote: responseNote !== undefined ? responseNote : enquiry.responseNote,
      updatedAt: new Date().toISOString(),
    };

    this.persist();
    return this.enquiries[index];
  }

  // --- Complaints ---
  public createComplaint(data: {
    tutorId?: string;
    enquiryId?: string;
    description: string;
  }): Complaint {
    const user = this.getCurrentUser();
    let tutorName = undefined;
    if (data.tutorId) {
      const tutor = this.getTutorById(data.tutorId);
      if (tutor) tutorName = tutor.fullName;
    }

    const complaint: Complaint = {
      id: `cmp_${Date.now()}`,
      reporterId: user.id,
      reporterRole: user.role,
      reporterName: user.fullName,
      tutorId: data.tutorId,
      tutorName,
      enquiryId: data.enquiryId,
      description: data.description,
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    this.complaints.unshift(complaint);
    this.persist();
    return complaint;
  }

  public getAllComplaintsForAdmin(): Complaint[] {
    return [...this.complaints];
  }

  public updateComplaintStatus(complaintId: string, status: Complaint['status']): Complaint {
    const index = this.complaints.findIndex((c) => c.id === complaintId);
    if (index === -1) throw new Error('Complaint not found');
    this.complaints[index] = { ...this.complaints[index], status };
    this.persist();
    return this.complaints[index];
  }

  // --- Metrics ---
  public getAdminMetrics(): AdminMetrics {
    const totalParents = this.users.filter((u) => u.role === 'parent').length;
    const totalTutors = this.tutors.length;
    const approvedTutors = this.tutors.filter((t) => t.approvalStatus === 'approved').length;
    const pendingTutorApprovals = this.tutors.filter((t) => t.approvalStatus === 'pending').length;
    const totalEnquiries = this.enquiries.length;
    const acceptedEnquiries = this.enquiries.filter((e) => e.status === 'accepted').length;
    const completedEnquiries = this.enquiries.filter((e) => e.status === 'completed').length;

    let pendingVerifications = 0;
    this.tutors.forEach((t) => {
      pendingVerifications += t.verificationRecords.filter((d) => d.status === 'pending').length;
    });

    const openComplaints = this.complaints.filter((c) => c.status === 'open' || c.status === 'investigating').length;

    return {
      totalParents,
      totalTutors,
      approvedTutors,
      pendingTutorApprovals,
      totalEnquiries,
      acceptedEnquiries,
      completedEnquiries,
      pendingVerifications,
      openComplaints,
    };
  }
}

export const marketplaceStore = new MarketplaceStore();

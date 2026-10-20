export type UserRole = 'student' | 'parent' | 'tutor' | 'admin';

export type BoardType = 'CBSE' | 'Maharashtra SSC' | 'ICSE' | 'NIOS';

export type GradeLevel =
  | 'Class 1'
  | 'Class 2'
  | 'Class 3'
  | 'Class 4'
  | 'Class 5'
  | 'Class 6'
  | 'Class 7'
  | 'Class 8'
  | 'Class 9'
  | 'Class 10'
  | 'Class 11'
  | 'Class 12';

export type SubjectName =
  | 'Mathematics'
  | 'Science'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'English'
  | 'Computer Science'
  | 'Hindi'
  | 'Marathi'
  | 'Economics'
  | 'Accountancy & Commerce'
  | 'Social Studies';

export type TeachingMode = 'home_tuition' | 'online' | 'both';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export type VerificationStatus = 'unverified' | 'partially_verified' | 'fully_verified';

export interface VerificationRecord {
  id: string;
  tutorId: string;
  documentType: 'Aadhaar Card' | 'Degree Certificate' | 'B.Ed / Teaching Credential' | 'Address Proof';
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: 'pending' | 'verified' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  notes?: string;
}

export interface AvailabilitySlot {
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // e.g. "16:00"
  endTime: string;   // e.g. "19:00"
}

export interface ServiceArea {
  locality: string;
  pinCode: string;
  travelRadiusKm: number;
}

export interface Review {
  id: string;
  parentId: string;
  parentName: string;
  rating: number; // 1 - 5
  comment: string;
  subject: string;
  grade: string;
  createdAt: string;
}

export interface TutorProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  gender: 'Female' | 'Male' | 'Other';
  biography: string;
  qualification: string;
  almaMater: string;
  experienceYears: number;
  teachingApproach: string;
  teachingMode: TeachingMode;
  hourlyFee: number; // in INR
  monthlyFee: number; // in INR for regular tuition (e.g. 3-4 days/week)
  boards: BoardType[];
  grades: GradeLevel[];
  subjects: SubjectName[];
  serviceAreas: ServiceArea[];
  availability: AvailabilitySlot[];
  languages: string[];
  approvalStatus: ApprovalStatus;
  verificationStatus: VerificationStatus;
  identityChecked: boolean;
  qualificationChecked: boolean;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  verificationRecords: VerificationRecord[];
  createdAt: string;
  updatedAt: string;
}

export type EnquiryStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'contacted'
  | 'completed'
  | 'cancelled';

export interface Enquiry {
  id: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  tutorId: string;
  tutorName: string;
  tutorHourlyFee: number;
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
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  responseNote?: string;
}

export interface Complaint {
  id: string;
  reporterId: string;
  reporterRole: UserRole;
  reporterName: string;
  tutorId?: string;
  tutorName?: string;
  enquiryId?: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  locality?: string;
  pinCode?: string;
  preferredContactMethod?: 'phone' | 'whatsapp' | 'email';
  createdAt: string;
}

export interface SearchFilterState {
  board?: BoardType | '';
  grade?: GradeLevel | '';
  subject?: SubjectName | '';
  locality?: string;
  pinCode?: string;
  maxBudget?: number;
  minExperience?: number;
  verifiedOnly: boolean;
  mode?: TeachingMode | '';
  sortBy: 'relevance' | 'fee_asc' | 'fee_desc' | 'experience_desc' | 'rating_desc';
}

export interface AdminMetrics {
  totalParents: number;
  totalTutors: number;
  approvedTutors: number;
  pendingTutorApprovals: number;
  totalEnquiries: number;
  acceptedEnquiries: number;
  completedEnquiries: number;
  pendingVerifications: number;
  openComplaints: number;
}

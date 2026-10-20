import React, { useState } from 'react';
import { X, Code, Database, Users, Shield, Server, FileText } from 'lucide-react';

interface TechArchitectureModalProps {
  onClose: () => void;
}

export const TechArchitectureModal: React.FC<TechArchitectureModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'team' | 'schema' | 'fastapi' | 'security'>('team');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                HomeTutor Architecture & 4-Person Team Guide
              </h3>
              <p className="text-xs text-slate-400">
                FastAPI REST API · PostgreSQL DDL · Role-Based Access Control · Supabase Integration
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'team'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>4-Person Team Workstreams</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'schema'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>PostgreSQL Schema (15 Tables)</span>
          </button>

          <button
            onClick={() => setActiveTab('fastapi')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'fastapi'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>FastAPI Endpoints & Contracts</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'security'
                ? 'bg-white text-emerald-700 border-emerald-600 shadow-xs'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Safety, Privacy & RLS Policies</span>
          </button>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6">
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
                <strong>Development Organization:</strong> HomeTutor is architected with clear boundaries
                so 4 developers can ship simultaneously without merge conflicts or overlapping concerns.
                Backend source files are housed under <code>/backend</code> and frontend under <code>/src</code>.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Member 1: Frontend & UI Lead</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">React + TS</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Responsive marketplace discovery interface with board/grade/fee filters</li>
                    <li>Detailed tutor profile pages, weekly availability schedule grid</li>
                    <li>Role-specific dashboards for Parents, Tutors, and Admins</li>
                    <li>Mobile-first layout and WCAG AA accessibility compliance</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Member 2: FastAPI Backend Lead</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-medium">Python 3.11</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>FastAPI routers: <code>/api/auth</code>, <code>/api/tutors</code>, <code>/api/enquiries</code>, <code>/api/admin</code></li>
                    <li>Pydantic schemas for request validation & error reporting</li>
                    <li>JWT Bearer authentication dependency and RBAC middleware</li>
                    <li>Rate limiting and OpenAPI / Swagger documentation</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Member 3: PostgreSQL & Matching Lead</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-medium">SQL & RLS</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>15 relational tables with strict foreign keys and check constraints</li>
                    <li>Row-Level Security (RLS) policies for private enquiries and documents</li>
                    <li>Rule-based matching algorithm (Board, Grade, Subject, Locality, Budget)</li>
                    <li>Spatial and indexing optimizations for Mumbai PIN codes</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Member 4: QA, Security & Deployment</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-medium">DevOps & QA</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Pytest automated suite for authorization, matching, and enquiry state transitions</li>
                    <li>Signed URLs for private Aadhaar/Degree document uploads</li>
                    <li>Vercel frontend and Dockerized FastAPI backend deployment pipelines</li>
                    <li>Pilot launch feedback collection and audit log monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                Complete PostgreSQL Schema located in <code>backend/schema.sql</code>. All 15 required tables with constraints and indexes:
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 text-xs font-mono overflow-x-auto max-h-96 leading-relaxed">
{`-- Core Tables Defined in backend/schema.sql:
1. users (id UUID PRIMARY KEY, full_name, email UNIQUE, phone, role user_role, created_at, updated_at)
2. parent_profiles (id UUID, user_id FK->users, preferred_locality, preferred_contact_method)
3. tutor_profiles (id UUID, user_id FK->users, biography, qualification, alma_mater, experience_years, 
                   hourly_fee NUMERIC, monthly_fee NUMERIC, approval_status, verification_status)
4. boards (id UUID, name VARCHAR UNIQUE) -- CBSE, Maharashtra SSC, ICSE, NIOS
5. grades (id UUID, name VARCHAR UNIQUE) -- Class 1 to Class 12
6. subjects (id UUID, name VARCHAR UNIQUE) -- Mathematics, Science, Physics, Chemistry, etc.
7. tutor_boards (tutor_id FK, board_id FK, PRIMARY KEY (tutor_id, board_id))
8. tutor_grades (tutor_id FK, grade_id FK, PRIMARY KEY (tutor_id, grade_id))
9. tutor_subjects (tutor_id FK, subject_id FK, PRIMARY KEY (tutor_id, subject_id))
10. tutor_service_areas (id UUID, tutor_id FK, locality, pin_code, travel_radius_km)
11. tutor_availability (id UUID, tutor_id FK, day_of_week, start_time TIME, end_time TIME)
12. enquiries (id UUID, parent_id FK, tutor_id FK, student_grade, board_id, subject_id, 
               locality, budget, preferred_schedule, message, status enquiry_status)
13. verification_records (id UUID, tutor_id FK, document_type, private_file_path, status, reviewed_by)
14. reviews (id UUID, parent_id FK, tutor_id FK, enquiry_id FK, rating INT CHECK (1..5), comment)
15. complaints (id UUID, reporter_id FK, tutor_id FK, enquiry_id FK, description, status)

-- Index optimizations:
CREATE INDEX idx_tutor_approval ON tutor_profiles(approval_status);
CREATE INDEX idx_tutor_service_areas_pin ON tutor_service_areas(pin_code, locality);
CREATE INDEX idx_enquiries_parent ON enquiries(parent_id);
CREATE INDEX idx_enquiries_tutor ON enquiries(tutor_id);`}
              </pre>
            </div>
          )}

          {activeTab === 'fastapi' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-600">
                REST API routes implemented in <code>backend/main.py</code> and modular router files:
              </div>
              <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 text-slate-600 text-left">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Method</th>
                      <th className="px-4 py-2.5 font-semibold">Endpoint</th>
                      <th className="px-4 py-2.5 font-semibold">Role Required</th>
                      <th className="px-4 py-2.5 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                    <tr>
                      <td className="px-4 py-2 font-bold text-emerald-600">GET</td>
                      <td className="px-4 py-2">/api/auth/me</td>
                      <td className="px-4 py-2 text-slate-500">Authenticated</td>
                      <td className="px-4 py-2 font-sans">Current session user details & role</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-emerald-600">GET</td>
                      <td className="px-4 py-2">/api/tutors</td>
                      <td className="px-4 py-2 text-slate-500">Public</td>
                      <td className="px-4 py-2 font-sans">Search approved tutors (excludes unapproved!)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-emerald-600">GET</td>
                      <td className="px-4 py-2">/api/tutors/{'{id}'}</td>
                      <td className="px-4 py-2 text-slate-500">Public</td>
                      <td className="px-4 py-2 font-sans">Tutor profile with availability & verified flags</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-blue-600">POST</td>
                      <td className="px-4 py-2">/api/enquiries</td>
                      <td className="px-4 py-2 text-blue-700">Parent</td>
                      <td className="px-4 py-2 font-sans">Submit tuition enquiry for student</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-emerald-600">GET</td>
                      <td className="px-4 py-2">/api/enquiries/my</td>
                      <td className="px-4 py-2 text-blue-700">Parent / Tutor</td>
                      <td className="px-4 py-2 font-sans">Enquiries scoped strictly to requesting user</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-amber-600">PATCH</td>
                      <td className="px-4 py-2">/api/enquiries/{'{id}'}/status</td>
                      <td className="px-4 py-2 text-emerald-700">Tutor / Parent / Admin</td>
                      <td className="px-4 py-2 font-sans">Transition status (Accept, Decline, Contacted, Cancel)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-purple-600">GET</td>
                      <td className="px-4 py-2">/api/admin/dashboard</td>
                      <td className="px-4 py-2 text-purple-700 font-bold">Admin</td>
                      <td className="px-4 py-2 font-sans">Real platform metrics & pipeline volume</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-bold text-amber-600">PATCH</td>
                      <td className="px-4 py-2">/api/admin/tutors/{'{id}'}/approval</td>
                      <td className="px-4 py-2 text-purple-700 font-bold">Admin</td>
                      <td className="px-4 py-2 font-sans">Approve, reject, or suspend tutor listing</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs leading-relaxed text-slate-600">
              <h4 className="font-bold text-slate-900 text-sm">Trust, Safety & Access Control</h4>
              <p>
                Because home tutors enter students' homes in Mumbai, safety and privacy are non-negotiable architectural requirements:
              </p>
              <div className="space-y-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-900">1. Verification Distinction</div>
                  <div>
                    We strictly distinguish between <strong>Identity checked</strong> (UIDAI/Aadhaar cross-check), <strong>Qualification documents checked</strong> (original degree transcript review), and <strong>Profile approved</strong>. No tutor is ever labeled as "background-checked" without documented administrative verification.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-900">2. Privacy & Document Protection</div>
                  <div>
                    Aadhaar scans and degree transcripts are stored in private Supabase Storage buckets with server-signed 15-minute access URLs. Never exposed in public endpoints or client state.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-semibold text-slate-900">3. Row-Level Security (RLS)</div>
                  <div>
                    Parents can ONLY access enquiries matching their own user ID. Tutors can ONLY access enquiries explicitly addressed to their profile ID. Admins have oversight across all records.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Files located in <code>/backend</code> and <code>/src</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { User, TutorProfile, Enquiry, Complaint, AdminMetrics } from '../types';
import { api } from '../services/api';
import { MUMBAI_LOCALITIES } from '../data/seedData';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  FileCheck2,
  Settings,
  Search,
  MessageSquare,
  Award,
} from 'lucide-react';

interface AdminDashboardPageProps {
  currentUser: User;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ currentUser }) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activePilot, setActivePilot] = useState<string>('Andheri West');
  const [activeTab, setActiveTab] = useState<'tutors' | 'verification' | 'enquiries' | 'complaints' | 'settings'>('tutors');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadAdminData();
  }, [currentUser]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [m, tList, eList, cList, pLoc] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminTutors(),
        api.getMyEnquiries(), // As admin, returns all
        api.getAdminComplaints(),
        api.getActivePilotLocality(),
      ]);
      setMetrics(m);
      setTutors(tList);
      setEnquiries(eList);
      setComplaints(cList);
      setActivePilot(pLoc);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTutorApproval = async (tutorId: string, status: TutorProfile['approvalStatus']) => {
    try {
      await api.setTutorApprovalStatus(tutorId, status);
      await loadAdminData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update approval status.');
    }
  };

  const handleReviewDoc = async (
    tutorId: string,
    docId: string,
    status: 'verified' | 'rejected'
  ) => {
    const notes = prompt(`Enter audit note for this ${status} document:`, 'Audited by Mumbai Ops');
    if (notes === null) return;
    try {
      await api.reviewVerificationDocument(tutorId, docId, status, notes);
      await loadAdminData();
    } catch (err: any) {
      alert(err?.message || 'Failed to review document.');
    }
  };

  const handleResolveComplaint = async (complaintId: string) => {
    try {
      await api.updateComplaintStatus(complaintId, 'resolved');
      await loadAdminData();
    } catch (err: any) {
      alert(err?.message || 'Failed to resolve complaint.');
    }
  };

  const handleUpdatePilot = async (newLoc: string) => {
    try {
      await api.setActivePilotLocality(newLoc);
      setActivePilot(newLoc);
      alert(`Mumbai Pilot launch hub updated to ${newLoc}`);
    } catch (err: any) {
      alert(err?.message || 'Failed to update pilot hub.');
    }
  };

  if (loading || !metrics) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading Mumbai Operations Console...
      </div>
    );
  }

  // Flatten pending documents for easy audit view
  const allVerificationDocs: { tutor: TutorProfile; doc: any }[] = [];
  tutors.forEach((t) => {
    t.verificationRecords.forEach((d) => {
      allVerificationDocs.push({ tutor: t, doc: d });
    });
  });

  const filteredTutors = tutors.filter(
    (t) =>
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded">
              Mumbai Operations
            </span>
            <span className="text-xs font-medium text-slate-500">
              Pilot Hub: <strong className="text-slate-800">{activePilot}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Administrator Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('settings')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configure Locality Hub</span>
          </button>
        </div>
      </div>

      {/* Real KPI Metrics Cards (calculated directly from active records) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Parents
          </span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.totalParents}
          </div>
          <span className="text-[11px] text-slate-400">Registered families</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Approved Tutors
          </span>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">
            {metrics.approvedTutors}{' '}
            <span className="text-xs font-normal text-slate-400">/ {metrics.totalTutors} total</span>
          </div>
          <span className="text-[11px] text-slate-400">Publicly discoverable</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Pending Tutor Reviews
          </span>
          <div className="text-2xl font-bold text-amber-600 tabular-nums">
            {metrics.pendingTutorApprovals}
          </div>
          <span className="text-[11px] text-amber-700 font-medium">Needs onboarding action</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Enquiries
          </span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {metrics.totalEnquiries}
          </div>
          <span className="text-[11px] text-slate-400">
            {metrics.acceptedEnquiries} accepted · {metrics.completedEnquiries} completed
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('tutors')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'tutors'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Tutors Management</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 text-slate-700 font-mono">
            {tutors.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Document Audits</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 text-slate-700 font-mono">
            {allVerificationDocs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>All Enquiries</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 text-slate-700 font-mono">
            {enquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('complaints')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'complaints'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Complaints & Safety</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 text-slate-700 font-mono">
            {complaints.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Pilot Settings</span>
        </button>
      </div>

      {/* TAB 1: TUTORS MANAGEMENT */}
      {activeTab === 'tutors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search tutor name, email, or qualification..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <span className="text-xs text-slate-500">
              Approved tutors appear publicly; unapproved/pending tutors are excluded.
            </span>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tutor Name & Email</th>
                  <th className="px-4 py-3 font-semibold">Experience & Boards</th>
                  <th className="px-4 py-3 font-semibold">Fees</th>
                  <th className="px-4 py-3 font-semibold">Listing Status</th>
                  <th className="px-4 py-3 font-semibold">Verification Audit</th>
                  <th className="px-4 py-3 font-semibold text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTutors.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{t.fullName}</div>
                      <div className="text-[11px] text-slate-500">{t.email}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {t.qualification}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-800">{t.experienceYears} Years</div>
                      <div className="text-[11px] text-slate-500">{t.boards.join(', ')}</div>
                    </td>

                    <td className="px-4 py-3 tabular-nums">
                      <div className="font-bold text-slate-800">₹{t.hourlyFee}/hr</div>
                      <div className="text-[11px] text-slate-500">₹{t.monthlyFee}/mo</div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          t.approvalStatus === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : t.approvalStatus === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {t.approvalStatus}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium ${
                          t.verificationStatus === 'fully_verified'
                            ? 'bg-teal-50 text-teal-800 border border-teal-200'
                            : t.verificationStatus === 'partially_verified'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {t.verificationStatus.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.approvalStatus !== 'approved' && (
                          <button
                            onClick={() => handleTutorApproval(t.id, 'approved')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {t.approvalStatus !== 'suspended' && (
                          <button
                            onClick={() => handleTutorApproval(t.id, 'suspended')}
                            className="px-2 py-1 text-[11px] text-slate-600 hover:text-slate-900 border border-slate-200 rounded"
                          >
                            Suspend
                          </button>
                        )}
                        {t.approvalStatus !== 'rejected' && (
                          <button
                            onClick={() => handleTutorApproval(t.id, 'rejected')}
                            className="px-2 py-1 text-[11px] text-rose-600 hover:text-rose-700 border border-rose-200 rounded"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DOCUMENT VERIFICATION AUDIT */}
      {activeTab === 'verification' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed">
            <strong>Audit Guidelines:</strong> Verify that government identity documents (Aadhaar/Passport) match the applicant name and address. Verify that university degrees and B.Ed certificates contain genuine graduation years and university stamps.
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
            <table className="w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 text-slate-600 text-left">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tutor Applicant</th>
                  <th className="px-4 py-3 font-semibold">Document Type & File</th>
                  <th className="px-4 py-3 font-semibold">Uploaded Date</th>
                  <th className="px-4 py-3 font-semibold">Current Audit Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Audit Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allVerificationDocs.map(({ tutor, doc }) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-900">{tutor.fullName}</div>
                      <div className="text-[11px] text-slate-500">{tutor.email}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-800">{doc.documentType}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        {doc.fileName} ({doc.fileSize})
                      </div>
                      {doc.notes && (
                        <div className="text-[11px] text-slate-500 italic mt-0.5">
                          Note: {doc.notes}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                          doc.status === 'verified'
                            ? 'bg-emerald-100 text-emerald-800'
                            : doc.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleReviewDoc(tutor.id, doc.id, 'verified')}
                          className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
                        >
                          Mark Verified
                        </button>
                        <button
                          onClick={() => handleReviewDoc(tutor.id, doc.id, 'rejected')}
                          className="px-2 py-1 text-[11px] text-rose-600 hover:text-rose-700 border border-rose-200 rounded"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ALL ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden text-xs">
          <table className="w-full divide-y divide-slate-200">
            <thead className="bg-slate-50 text-slate-600 text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Ref & Date</th>
                <th className="px-4 py-3 font-semibold">Parent & Student</th>
                <th className="px-4 py-3 font-semibold">Assigned Tutor</th>
                <th className="px-4 py-3 font-semibold">Subject & Locality</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enquiries.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/60">
                  <td className="px-4 py-3 font-mono text-[11px] text-slate-500">
                    <div>{e.id}</div>
                    <div className="text-[10px]">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-900">{e.parentName}</div>
                    <div className="text-[11px] text-slate-500">
                      Student: {e.studentName} ({e.studentGrade})
                    </div>
                  </td>

                  <td className="px-4 py-3 font-medium text-slate-800">{e.tutorName}</td>

                  <td className="px-4 py-3">
                    <div>
                      {e.board} · {e.subject}
                    </div>
                    <div className="text-[11px] text-slate-400">{e.locality}</div>
                  </td>

                  <td className="px-4 py-3 tabular-nums font-semibold text-slate-800">
                    ₹{e.budgetMonthly.toLocaleString('en-IN')}/mo
                  </td>

                  <td className="px-4 py-3">
                    <span className="capitalize px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: COMPLAINTS & SAFETY */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
              Zero complaints reported across the platform.
            </div>
          ) : (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500" />
                      <span className="font-bold text-slate-900">
                        Report by {c.reporterName} ({c.reporterRole})
                      </span>
                      {c.tutorName && (
                        <span className="text-slate-500">regarding tutor {c.tutorName}</span>
                      )}
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${
                        c.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>

                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                    {c.description}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400">
                      Filed on {new Date(c.createdAt).toLocaleString()}
                    </span>
                    {c.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveComplaint(c.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        Mark Ticket Resolved
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: PILOT LAUNCH SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6 max-w-xl">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Configure Mumbai Pilot Target Hub
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select which Mumbai neighborhood serves as the platform's primary pilot focus for tutor recruitment and advertising.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Active Pilot Hub Locality
            </label>
            <select
              value={activePilot}
              onChange={(e) => handleUpdatePilot(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              {MUMBAI_LOCALITIES.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} ({l.zone}) — PIN {l.pinCode}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-900 text-xs">
            Current active hub: <strong>{activePilot}</strong>. Landing page banners and priority search defaults now reflect this selection.
          </div>
        </div>
      )}
    </div>
  );
};

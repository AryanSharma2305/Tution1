import React, { useState, useEffect } from 'react';
import { User, TutorProfile, Enquiry, VerificationRecord } from '../types';
import { api } from '../services/api';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Clock,
  Upload,
  AlertCircle,
  Save,
  Calendar,
  DollarSign,
  FileText,
  UserCheck,
} from 'lucide-react';
import { BOARDS_LIST, SUBJECTS_LIST, MUMBAI_LOCALITIES } from '../data/seedData';

interface TutorDashboardPageProps {
  currentUser: User;
}

export const TutorDashboardPage: React.FC<TutorDashboardPageProps> = ({ currentUser }) => {
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'enquiries' | 'profile' | 'verification'>('enquiries');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [responseModalEnquiry, setResponseModalEnquiry] = useState<Enquiry | null>(null);
  const [responseAction, setResponseAction] = useState<'accepted' | 'declined' | 'contacted'>('accepted');
  const [responseNote, setResponseNote] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Editable Profile fields
  const [hourlyFee, setHourlyFee] = useState<number>(800);
  const [monthlyFee, setMonthlyFee] = useState<number>(8000);
  const [biography, setBiography] = useState('');
  const [teachingApproach, setTeachingApproach] = useState('');
  const [qualification, setQualification] = useState('');

  // Upload verification record state
  const [uploadDocType, setUploadDocType] = useState<VerificationRecord['documentType']>('Degree Certificate');
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    try {
      const p = await api.getMyTutorProfile();
      setProfile(p);
      if (p) {
        setHourlyFee(p.hourlyFee);
        setMonthlyFee(p.monthlyFee);
        setBiography(p.biography);
        setTeachingApproach(p.teachingApproach);
        setQualification(p.qualification);
      }
      const enqs = await api.getMyEnquiries();
      setEnquiries(enqs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    try {
      setSaving(true);
      setFeedbackMsg(null);
      const updated = await api.updateTutorProfile(profile.id, {
        hourlyFee: Number(hourlyFee),
        monthlyFee: Number(monthlyFee),
        biography: biography.trim(),
        teachingApproach: teachingApproach.trim(),
        qualification: qualification.trim(),
      });
      setProfile(updated);
      setFeedbackMsg({ type: 'success', text: 'Tutor profile updated successfully.' });
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err?.message || 'Failed to update profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateEnquiryStatus = async () => {
    if (!responseModalEnquiry) return;
    try {
      await api.updateEnquiryStatus(responseModalEnquiry.id, responseAction, responseNote);
      setResponseModalEnquiry(null);
      setResponseNote('');
      await loadData();
    } catch (err: any) {
      alert(err?.message || 'Failed to update enquiry status.');
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    if (!uploadFileName.trim()) {
      alert('Please enter a mock document name (e.g. Mumbai_University_Degree.pdf)');
      return;
    }

    try {
      setUploading(true);
      await api.uploadVerificationDoc(
        profile.id,
        uploadDocType,
        uploadFileName.trim(),
        '1.8 MB'
      );
      setUploadFileName('');
      await loadData();
      alert('Document submitted successfully for Administrator audit.');
    } catch (err: any) {
      alert(err?.message || 'Failed to upload document.');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-xs text-slate-500">
        Loading Tutor Console...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">No Tutor Profile Linked</h2>
        <p className="text-xs text-slate-600">
          Your account is currently registered as a parent. Switch demo persona to Prof. Rajesh Kulkarni or register a tutor account to access this console.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Verification & Approval Status */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
              Tutor Console
            </span>
            {profile.approvalStatus === 'approved' ? (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                ● Approved & Listed in Mumbai Search
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-100 text-amber-800">
                ● Approval Pending (Admin Review)
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {profile.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Hourly: ₹{profile.hourlyFee}/hr · Monthly: ₹{profile.monthlyFee}/mo · Experience:{' '}
            {profile.experienceYears} Years
          </p>
        </div>

        <div className="flex items-center gap-2">
          {profile.verificationStatus === 'fully_verified' ? (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Fully Verified</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              <Clock className="w-4 h-4" />
              <span>Documents In Review</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Incoming Enquiries</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 text-slate-700 font-mono">
            {enquiries.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Edit Profile & Fees
        </button>

        <button
          onClick={() => setActiveTab('verification')}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'verification'
              ? 'border-emerald-600 text-slate-900'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>Verification Documents</span>
          <span className="px-1.5 py-0.2 rounded-full text-[11px] bg-slate-100 text-slate-700 font-mono">
            {profile.verificationRecords.length}
          </span>
        </button>
      </div>

      {/* TAB 1: INCOMING ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="space-y-4">
          {enquiries.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-xs text-slate-500">
              No parent enquiries received yet.
            </div>
          ) : (
            enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Enquiry from {enq.parentName}
                    </h3>
                    <div className="text-xs text-slate-500">
                      Phone: <span className="text-slate-900 font-medium">{enq.parentPhone}</span> · Locality: {enq.locality}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize bg-slate-100 text-slate-700">
                      Status: {enq.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400">Student & Board:</span>
                    <div className="font-semibold text-slate-800">
                      {enq.studentName} ({enq.studentGrade})
                    </div>
                    <div className="text-slate-600">
                      {enq.board} · {enq.subject}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Schedule & Mode:</span>
                    <div className="font-semibold text-slate-800">{enq.preferredSchedule}</div>
                    <div className="text-slate-600 capitalize">
                      {enq.teachingMode.replace('_', ' ')}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400">Parent Monthly Budget:</span>
                    <div className="font-bold text-slate-900 tabular-nums text-sm">
                      ₹{enq.budgetMonthly.toLocaleString('en-IN')}/mo
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-700">
                  <strong className="text-slate-900">Parent Request:</strong> "{enq.message}"
                </div>

                {enq.responseNote && (
                  <div className="p-3 bg-emerald-50 rounded-lg text-xs text-emerald-950">
                    <strong className="text-emerald-900">Your Response Note:</strong> "{enq.responseNote}"
                  </div>
                )}

                {/* Quick Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5">
                  <button
                    onClick={() => {
                      setResponseModalEnquiry(enq);
                      setResponseAction('contacted');
                      setResponseNote('Spoke with parent; scheduled trial class.');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    Mark Contacted
                  </button>

                  <button
                    onClick={() => {
                      setResponseModalEnquiry(enq);
                      setResponseAction('declined');
                      setResponseNote('Schedule conflict; unable to take this slot.');
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() => {
                      setResponseModalEnquiry(enq);
                      setResponseAction('accepted');
                      setResponseNote('Tuition accepted! Diagnostic session confirmed.');
                    }}
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Accept Enquiry
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: EDIT PROFILE & FEES */}
      {activeTab === 'profile' && (
        <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {feedbackMsg && (
            <div
              className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
                feedbackMsg.type === 'success'
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border border-rose-200 text-rose-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{feedbackMsg.text}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Hourly Fee (in ₹ INR)
              </label>
              <input
                type="number"
                min="300"
                step="50"
                value={hourlyFee}
                onChange={(e) => setHourlyFee(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Package Fee (in ₹ INR)
              </label>
              <input
                type="number"
                min="3000"
                step="500"
                value={monthlyFee}
                onChange={(e) => setMonthlyFee(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Qualifications & Alma Mater
            </label>
            <input
              type="text"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Educator Biography
            </label>
            <textarea
              rows={3}
              value={biography}
              onChange={(e) => setBiography(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teaching Approach & Pedagogy
            </label>
            <textarea
              rows={3}
              value={teachingApproach}
              onChange={(e) => setTeachingApproach(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: VERIFICATION DOCUMENTS */}
      {activeTab === 'verification' && (
        <div className="space-y-6">
          {/* Explainer card */}
          <div className="bg-emerald-50/70 border border-emerald-200 p-5 rounded-2xl text-xs text-emerald-950 space-y-2">
            <div className="font-bold text-sm flex items-center gap-2 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Secure Document Audit Policy</span>
            </div>
            <p className="leading-relaxed">
              Upload your government identity (Aadhaar or Passport) and degree certificates. Files are
              privately reviewed by the HomeTutor Mumbai administrator and are never revealed to parents
              or third parties.
            </p>
          </div>

          {/* Upload New Document Form */}
          <form onSubmit={handleUploadDocument} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Submit Verification Document</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Type
                </label>
                <select
                  value={uploadDocType}
                  onChange={(e) => setUploadDocType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Degree Certificate">Degree Convocation Certificate</option>
                  <option value="Aadhaar Card">Aadhaar Card (Govt ID)</option>
                  <option value="B.Ed / Teaching Credential">B.Ed / Teaching Credential</option>
                  <option value="Address Proof">Mumbai Address Proof</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  File Name / PDF Scan
                </label>
                <input
                  type="text"
                  placeholder="e.g. MSc_Physics_Degree_ICT.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={uploading}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1.5 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{uploading ? 'Submitting...' : 'Upload for Admin Audit'}</span>
              </button>
            </div>
          </form>

          {/* Existing Document Records */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Audit Records ({profile.verificationRecords.length})
            </h3>

            {profile.verificationRecords.length === 0 ? (
              <div className="text-xs text-slate-500 italic py-2">
                No documents uploaded yet. Submit your degree transcript to earn the Verified checkmark.
              </div>
            ) : (
              <div className="space-y-3">
                {profile.verificationRecords.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>{doc.documentType}</span>
                        <span className="font-mono text-slate-500 text-[11px]">({doc.fileName})</span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} · Size: {doc.fileSize}
                      </div>
                      {doc.notes && (
                        <div className="text-[11px] text-slate-600 italic">
                          Admin note: {doc.notes}
                        </div>
                      )}
                    </div>

                    <div>
                      {doc.status === 'verified' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 text-[11px]">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Audited & Verified</span>
                        </span>
                      )}
                      {doc.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-800 text-[11px]">
                          <Clock className="w-3 h-3" />
                          <span>Pending Admin Review</span>
                        </span>
                      )}
                      {doc.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold bg-rose-100 text-rose-800 text-[11px]">
                          <XCircle className="w-3 h-3" />
                          <span>Document Rejected</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Response Modal */}
      {responseModalEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Update Enquiry: {responseAction.toUpperCase()}
            </h3>
            <p className="text-xs text-slate-600">
              Parent: <strong>{responseModalEnquiry.parentName}</strong> ({responseModalEnquiry.studentName})
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Note to Parent / Scheduling Details
              </label>
              <textarea
                rows={3}
                value={responseNote}
                onChange={(e) => setResponseNote(e.target.value)}
                placeholder="e.g. Confirmed for Mon & Wed 5:30 PM. See you at your home."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResponseModalEnquiry(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateEnquiryStatus}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

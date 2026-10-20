import React, { useState, useEffect } from 'react';
import { User, Enquiry } from '../types';
import { api } from '../services/api';
import {
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Calendar,
  AlertCircle,
  MapPin,
  BookOpen,
  MessageSquare,
  Search,
} from 'lucide-react';

interface ParentDashboardPageProps {
  currentUser: User;
  onNavigateToSearch: () => void;
  onSelectTutor: (tutorId: string) => void;
}

export const ParentDashboardPage: React.FC<ParentDashboardPageProps> = ({
  currentUser,
  onNavigateToSearch,
  onSelectTutor,
}) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, [currentUser]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const list = await api.getMyEnquiries();
      setEnquiries(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEnquiry = async (enquiryId: string) => {
    if (!window.confirm('Are you sure you want to cancel this tuition enquiry?')) return;
    try {
      setCancellingId(enquiryId);
      await api.updateEnquiryStatus(enquiryId, 'cancelled');
      await loadEnquiries();
    } catch (err: any) {
      alert(err?.message || 'Failed to cancel enquiry');
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusBadge = (status: Enquiry['status']) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted by Tutor</span>
          </span>
        );
      case 'contacted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Tutor Contacted</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5" />
            <span>Awaiting Tutor Review</span>
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tuition Completed</span>
          </span>
        );
      case 'declined':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            <span>Declined by Tutor</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
            <span>Cancelled by You</span>
          </span>
        );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
            Parent Account
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Welcome, {currentUser.fullName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered Locality: <strong>{currentUser.locality || 'Andheri West'}</strong> ({currentUser.pinCode}) · Contact: {currentUser.phone}
          </p>
        </div>

        <button
          onClick={onNavigateToSearch}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 shrink-0"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Find Another Tutor</span>
        </button>
      </div>

      {/* Submitted Enquiries Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            My Submitted Enquiries ({enquiries.length})
          </h2>
          <span className="text-xs text-slate-500">
            Track status and responses in real-time
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading your tuition enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No enquiries submitted yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Find verified educators matching your child's board and grade in Mumbai and send an enquiry.
            </p>
            <button
              onClick={onNavigateToSearch}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Browse Tutors in Mumbai
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {enquiries.map((enq) => (
              <div
                key={enq.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        Enquiry for: {enq.tutorName}
                      </span>
                      <button
                        onClick={() => onSelectTutor(enq.tutorId)}
                        className="text-[11px] text-emerald-700 hover:underline font-medium"
                      >
                        (View Profile)
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Ref: {enq.id} · Submitted {new Date(enq.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>{getStatusBadge(enq.status)}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400">Student & Curriculum:</span>
                    <div className="font-semibold text-slate-800">
                      {enq.studentName} · {enq.studentGrade}
                    </div>
                    <div className="text-slate-600">
                      {enq.board} Board · {enq.subject}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400">Locality & Mode:</span>
                    <div className="font-semibold text-slate-800">{enq.locality}</div>
                    <div className="text-slate-600 capitalize">
                      {enq.teachingMode.replace('_', ' ')}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400">Budget & Timing:</span>
                    <div className="font-semibold text-slate-800 tabular-nums">
                      ₹{enq.budgetMonthly.toLocaleString('en-IN')}/mo
                    </div>
                    <div className="text-slate-600">{enq.preferredSchedule}</div>
                  </div>
                </div>

                {/* Parent Message & Tutor Response Note */}
                <div className="space-y-2 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
                    <strong className="text-slate-900">Your message:</strong> "{enq.message}"
                  </div>

                  {enq.responseNote && (
                    <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-100 text-emerald-950">
                      <strong className="text-emerald-900">Tutor Response Note:</strong> "{enq.responseNote}"
                    </div>
                  )}
                </div>

                {/* Cancel Enquiry Action */}
                {(enq.status === 'pending' || enq.status === 'contacted') && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleCancelEnquiry(enq.id)}
                      disabled={cancellingId === enq.id}
                      className="text-xs text-rose-600 hover:text-rose-700 font-medium"
                    >
                      {cancellingId === enq.id ? 'Cancelling...' : 'Cancel this enquiry'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

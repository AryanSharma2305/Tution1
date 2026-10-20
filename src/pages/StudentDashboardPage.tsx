import React, { useState, useEffect } from 'react';
import { User, Enquiry } from '../types';
import { api } from '../services/api';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  Sparkles,
  ArrowRight,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardPageProps {
  currentUser: User;
  onNavigateToSearch: () => void;
  onSelectTutor: (tutorId: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({
  currentUser,
  onNavigateToSearch,
  onSelectTutor,
}) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, [currentUser]);

  const loadStudentData = async () => {
    setLoading(true);
    try {
      const list = await api.getMyEnquiries();
      setEnquiries(list);
    } catch (err) {
      console.error('Failed to load student enquiries', err);
    } finally {
      setLoading(false);
    }
  };

  const activeClasses = enquiries.filter((e) => e.status === 'accepted' || e.status === 'contacted');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Student Welcome Banner with Gradient & Motion */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Learning Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {currentUser.fullName}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Targeted board preparation in Mumbai. Review upcoming sessions, connect with your verified
              home tutor, and monitor your exam readiness.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onNavigateToSearch}
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>Find a New Subject Tutor</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1"
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Active Tuition Courses
          </span>
          <div className="text-2xl font-bold text-slate-900 tabular-nums">
            {activeClasses.length}
          </div>
          <p className="text-xs text-slate-400">Underway with Mumbai educators</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1"
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Enquiries Sent
          </span>
          <div className="text-2xl font-bold text-emerald-600 tabular-nums">
            {enquiries.length}
          </div>
          <p className="text-xs text-slate-400">Across Mathematics, Science & more</p>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1"
        >
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Syllabus Target
          </span>
          <div className="text-2xl font-bold text-indigo-600">
            Board Prelims 2026
          </div>
          <p className="text-xs text-slate-400">Class 10 / 12 board milestone</p>
        </motion.div>
      </div>

      {/* My Learning Enquiries & Active Tutors */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            My Learning & Tuition Requests ({enquiries.length})
          </h2>
          <span className="text-xs text-slate-500">Live status synchronized with server</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 bg-white rounded-2xl border border-slate-200">
            Loading your courses...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No active tuition enquiries yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Ready to excel in Mathematics, Science, or English? Discover verified home tutors in Mumbai.
            </p>
            <button
              onClick={onNavigateToSearch}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
            >
              Browse Qualified Educators
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enquiries.map((enq) => (
              <motion.div
                key={enq.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400">Ref: {enq.id}</span>
                      <h3 className="text-base font-bold text-slate-900">{enq.subject} Guidance</h3>
                      <p className="text-xs text-slate-600">
                        Tutor: <strong>{enq.tutorName}</strong>
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold capitalize ${
                        enq.status === 'accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : enq.status === 'contacted'
                          ? 'bg-blue-100 text-blue-800'
                          : enq.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {enq.status}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                    <div className="text-slate-600">
                      <strong>Board & Grade:</strong> {enq.board} · {enq.studentGrade}
                    </div>
                    <div className="text-slate-600">
                      <strong>Preferred Schedule:</strong> {enq.preferredSchedule}
                    </div>
                    <div className="text-slate-600">
                      <strong>Locality:</strong> {enq.locality} (Mode: {enq.teachingMode.replace('_', ' ')})
                    </div>
                  </div>

                  {enq.responseNote && (
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 text-xs">
                      <strong>Tutor Note:</strong> "{enq.responseNote}"
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 tabular-nums">
                    ₹{enq.budgetMonthly.toLocaleString('en-IN')}/mo
                  </span>
                  <button
                    onClick={() => onSelectTutor(enq.tutorId)}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <span>View Tutor Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Practice & Board Resource Tools */}
      <div className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-800">
            Study Tip for Mumbai Students
          </div>
          <div className="text-sm font-semibold text-emerald-950">
            Prepare your NCERT/State Board chapter queries ahead of every session.
          </div>
          <p className="text-xs text-emerald-800/80">
            Home tutors customize every lesson around your weak problem sets and preliminary exam blueprints.
          </p>
        </div>
        <button
          onClick={onNavigateToSearch}
          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shrink-0 shadow-xs"
        >
          Explore Tutors by Subject
        </button>
      </div>
    </div>
  );
};

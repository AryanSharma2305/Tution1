import React, { useState } from 'react';
import { TutorProfile, User, BoardType, GradeLevel, SubjectName } from '../types';
import { BOARDS_LIST, GRADES_LIST, SUBJECTS_LIST, MUMBAI_LOCALITIES } from '../data/seedData';
import { api } from '../services/api';
import { X, Calendar, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';

interface EnquiryModalProps {
  tutor: TutorProfile;
  currentUser: User;
  onClose: () => void;
  onSuccess: (enquiryId: string) => void;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  tutor,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentGrade, setStudentGrade] = useState<GradeLevel>(
    tutor.grades.includes('Class 10') ? 'Class 10' : tutor.grades[0] || 'Class 10'
  );
  const [board, setBoard] = useState<BoardType>(tutor.boards[0] || 'CBSE');
  const [subject, setSubject] = useState<SubjectName>(tutor.subjects[0] || 'Mathematics');
  const [locality, setLocality] = useState(tutor.serviceAreas[0]?.locality || 'Andheri West');
  const [pinCode, setPinCode] = useState(tutor.serviceAreas[0]?.pinCode || '400053');
  const [budgetMonthly, setBudgetMonthly] = useState<number>(tutor.monthlyFee || 8000);
  const [preferredSchedule, setPreferredSchedule] = useState('Mon & Wed 5:30 PM - 7:00 PM');
  const [teachingMode, setTeachingMode] = useState<'home_tuition' | 'online'>('home_tuition');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedEnquiryId, setSubmittedEnquiryId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!studentName.trim()) {
      setError('Please provide the student’s name.');
      return;
    }
    if (!locality.trim()) {
      setError('Please specify your locality in Mumbai.');
      return;
    }
    if (budgetMonthly < 1000) {
      setError('Please enter a realistic monthly tuition budget in ₹.');
      return;
    }

    try {
      setLoading(true);
      const created = await api.createEnquiry({
        tutorId: tutor.id,
        studentName: studentName.trim(),
        studentGrade,
        board,
        subject,
        locality,
        pinCode,
        budgetMonthly: Number(budgetMonthly),
        preferredSchedule,
        teachingMode,
        message: message.trim() || `Enquiry for ${subject} guidance for ${studentName}.`,
      });
      setSubmittedEnquiryId(created.id);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/60 rounded-t-2xl">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Send Tuition Enquiry to {tutor.fullName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Standard fee: ₹{tutor.hourlyFee.toLocaleString('en-IN')}/hr or ₹{tutor.monthlyFee.toLocaleString('en-IN')}/month
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedEnquiryId ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Enquiry Submitted Successfully!</h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Your enquiry has been delivered to <strong>{tutor.fullName}</strong>. The tutor will
              review your student’s syllabus and schedule, and respond directly via HomeTutor.
            </p>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 inline-block">
              Enquiry Reference: <span className="font-mono font-medium text-slate-900">{submittedEnquiryId}</span>
            </div>
            <div className="pt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onSuccess(submittedEnquiryId);
                }}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
              >
                View My Enquiries
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-lg text-xs text-amber-800 leading-relaxed">
              <strong>Transparency Note:</strong> Submitting an enquiry expresses your interest. The tutor will confirm their schedule before any tuition commitment is finalized.
            </div>

            {/* Student & Class Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Grade / Class <span className="text-rose-500">*</span>
                </label>
                <select
                  value={studentGrade}
                  onChange={(e) => setStudentGrade(e.target.value as GradeLevel)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {GRADES_LIST.map((g) => (
                    <option key={g} value={g}>
                      {g} {tutor.grades.includes(g) ? '✓ (Tutor Teaches)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Board & Subject Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Education Board <span className="text-rose-500">*</span>
                </label>
                <select
                  value={board}
                  onChange={(e) => setBoard(e.target.value as BoardType)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {BOARDS_LIST.map((b) => (
                    <option key={b} value={b}>
                      {b} {tutor.boards.includes(b) ? '✓ (Tutor Board)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Subject <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectName)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                >
                  {SUBJECTS_LIST.map((s) => (
                    <option key={s} value={s}>
                      {s} {tutor.subjects.includes(s) ? '✓ (Specialty)' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Locality & PIN Code */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Parent's Locality in Mumbai <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <select
                    value={locality}
                    onChange={(e) => {
                      setLocality(e.target.value);
                      const locMatch = MUMBAI_LOCALITIES.find((l) => l.name === e.target.value);
                      if (locMatch) setPinCode(locMatch.pinCode);
                    }}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {MUMBAI_LOCALITIES.map((loc) => (
                      <option key={loc.name} value={loc.name}>
                        {loc.name} {loc.isPilotHub ? '(Pilot Hub)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value)}
                  placeholder="e.g. 400053"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Budget & Teaching Mode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Budget (in ₹ INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-sm text-slate-500">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    value={budgetMonthly}
                    onChange={(e) => setBudgetMonthly(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-0.5 block">
                  Tutor's expected monthly package: ₹{tutor.monthlyFee.toLocaleString('en-IN')}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Teaching Mode
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTeachingMode('home_tuition')}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      teachingMode === 'home_tuition'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    At Home (Offline)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTeachingMode('online')}
                    className={`flex-1 py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                      teachingMode === 'online'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    Online Tuition
                  </button>
                </div>
              </div>
            </div>

            {/* Preferred Schedule */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Schedule / Days & Timing
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="e.g. Mon, Wed & Fri between 5:00 PM and 7:00 PM"
                  value={preferredSchedule}
                  onChange={(e) => setPreferredSchedule(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Specific learning goals */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Specific Learning Goals & Notes for Tutor
              </label>
              <textarea
                rows={3}
                placeholder="Describe weak chapters, upcoming exams, or specific areas where the student needs focused help..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <div className="text-xs text-slate-500">
                Contact: <strong className="text-slate-800">{currentUser.fullName}</strong> ({currentUser.phone})
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? 'Submitting...' : 'Send Enquiry'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { TutorProfile, User } from '../types';
import {
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Award,
  ChevronLeft,
  Mail,
  AlertTriangle,
  GraduationCap,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';

interface TutorProfilePageProps {
  tutor: TutorProfile;
  currentUser: User;
  onBack: () => void;
  onRequestEnquiry: (tutor: TutorProfile) => void;
  onReportProfile: (tutor: TutorProfile) => void;
}

export const TutorProfilePage: React.FC<TutorProfilePageProps> = ({
  tutor,
  currentUser,
  onBack,
  onRequestEnquiry,
  onReportProfile,
}) => {
  const [showVerificationExplainer, setShowVerificationExplainer] = useState(false);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Search Results</span>
      </button>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-2xl shrink-0 shadow-sm">
              {tutor.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{tutor.fullName}</h1>

                {/* Verification Badge with Clickable Explainer */}
                {tutor.verificationStatus === 'fully_verified' && (
                  <button
                    onClick={() => setShowVerificationExplainer(!showVerificationExplainer)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200/80 transition-colors"
                    title="Click to view verification audit breakdown"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ID & Qualifications Verified</span>
                    <HelpCircle className="w-3 h-3 text-emerald-600 opacity-60" />
                  </button>
                )}

                {tutor.verificationStatus === 'partially_verified' && (
                  <button
                    onClick={() => setShowVerificationExplainer(!showVerificationExplainer)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-200/80 transition-colors"
                  >
                    <span>ID Verified · Degree in Review</span>
                    <HelpCircle className="w-3 h-3 text-amber-600 opacity-60" />
                  </button>
                )}
              </div>

              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {tutor.qualification}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                <span className="font-semibold text-slate-800">
                  {tutor.experienceYears} Years Teaching Experience
                </span>
                <span>·</span>
                <span>Alma Mater: {tutor.almaMater}</span>
                {tutor.reviewCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-amber-700 font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{tutor.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">
                        ({tutor.reviewCount} parent reviews)
                      </span>
                    </span>
                  </>
                )}
              </div>

              <div className="text-xs text-slate-500 pt-1">
                Languages spoken: <strong>{tutor.languages.join(', ')}</strong>
              </div>
            </div>
          </div>

          {/* Fee & Action Card */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl w-full sm:w-64 text-center sm:text-right space-y-3 shrink-0">
            <div>
              <div className="text-xl font-bold text-slate-900 tabular-nums">
                ₹{tutor.hourlyFee.toLocaleString('en-IN')}{' '}
                <span className="text-xs font-normal text-slate-500">/ hour</span>
              </div>
              <div className="text-xs text-slate-600 font-medium tabular-nums mt-0.5">
                Package: ₹{tutor.monthlyFee.toLocaleString('en-IN')} / month
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                (Standard: ~3 sessions per week)
              </span>
            </div>

            <button
              onClick={() => onRequestEnquiry(tutor)}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
            >
              Send Tuition Enquiry
            </button>

            <button
              onClick={() => onReportProfile(tutor)}
              className="w-full text-center text-[11px] text-slate-400 hover:text-rose-600 flex items-center justify-center gap-1 transition-colors pt-1"
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Report profile or fee concern</span>
            </button>
          </div>
        </div>

        {/* Verification Explainer Dropdown */}
        {showVerificationExplainer && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-2 animate-in fade-in">
            <div className="font-bold text-sm flex items-center gap-1.5 text-emerald-900">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Verification Audit Breakdown for {tutor.fullName}</span>
            </div>
            <p className="leading-relaxed">
              HomeTutor requires verified documentation before awarding trust checkmarks:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    tutor.identityChecked ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <span>
                  Government Identity (Aadhaar/Passport):{' '}
                  {tutor.identityChecked ? 'Audited & Verified' : 'Pending verification'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2
                  className={`w-4 h-4 ${
                    tutor.qualificationChecked ? 'text-emerald-700' : 'text-slate-400'
                  }`}
                />
                <span>
                  University Convocation Degree:{' '}
                  {tutor.qualificationChecked ? 'Audited & Verified' : 'Pending transcript audit'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Details, Pedagogy, Schedule, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          {/* About & Teaching Approach */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900">About the Educator</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{tutor.biography}</p>

            <div className="pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Teaching Approach & Methodology
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                "{tutor.teachingApproach}"
              </p>
            </div>
          </section>

          {/* Boards, Grades & Subjects Matrix */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <h2 className="text-base font-bold text-slate-900">Curriculum & Subjects Taught</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-700 block">Education Boards</span>
                <div className="flex flex-wrap gap-1">
                  {tutor.boards.map((b) => (
                    <span
                      key={b}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-medium text-slate-800"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-700 block">Grades & Classes</span>
                <div className="flex flex-wrap gap-1">
                  {tutor.grades.map((g) => (
                    <span
                      key={g}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-800"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5">
                <span className="font-bold text-slate-700 block">Subjects</span>
                <div className="flex flex-wrap gap-1">
                  {tutor.subjects.map((s) => (
                    <span
                      key={s}
                      className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-800"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Weekly Availability Schedule */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Weekly Tuition Availability</h2>
              <span className="text-xs text-slate-400">Subject to confirmation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {tutor.availability.length > 0 ? (
                tutor.availability.map((slot, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50"
                  >
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{slot.dayOfWeek}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600 tabular-nums">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {slot.startTime} – {slot.endTime}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Availability provided directly upon enquiry.
                </div>
              )}
            </div>
          </section>

          {/* Genuine Parent Reviews */}
          <section className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">
                Parent Feedback & Reviews ({tutor.reviews.length})
              </h2>
              {tutor.rating > 0 && (
                <div className="flex items-center gap-1 text-sm font-bold text-amber-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{tutor.rating.toFixed(1)} / 5.0</span>
                </div>
              )}
            </div>

            {tutor.reviews.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-xl text-center text-xs text-slate-500">
                No public reviews yet for this tutor. Only parents who have engaged this tutor
                through completed enquiries may post verified reviews.
              </div>
            ) : (
              <div className="space-y-4">
                {tutor.reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-slate-200 space-y-2 bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-xs text-slate-900">{rev.parentName}</div>
                      <div className="flex items-center gap-1 text-amber-600">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 italic">"{rev.comment}"</p>
                    <div className="text-[11px] text-slate-400">
                      Subject: {rev.subject} · Grade: {rev.grade}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right 1 Col: Service Localities & Safety Rules */}
        <div className="space-y-6">
          {/* Service Localities */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Service Areas in Mumbai</span>
            </h3>
            <p className="text-xs text-slate-500">
              This educator travels to student homes within these localities:
            </p>
            <ul className="space-y-2 text-xs">
              {tutor.serviceAreas.map((area, idx) => (
                <li
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                >
                  <span className="font-medium text-slate-800">{area.locality}</span>
                  <span className="text-slate-400 tabular-nums">PIN {area.pinCode}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Home Safety Guidelines */}
          <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Home Tuition Safety Tips</span>
            </h3>
            <ul className="text-xs text-slate-300 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Arrange the first diagnostic session in an open family area.</li>
              <li>Verify that the tutor matches their HomeTutor profile.</li>
              <li>Review homework notes and syllabus progress weekly.</li>
              <li>Report any safety or attendance concerns immediately to our admin team.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

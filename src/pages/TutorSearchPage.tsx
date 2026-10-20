import React, { useState, useEffect } from 'react';
import { TutorProfile, SearchFilterState, BoardType, GradeLevel, SubjectName } from '../types';
import { BOARDS_LIST, GRADES_LIST, SUBJECTS_LIST, MUMBAI_LOCALITIES } from '../data/seedData';
import { api } from '../services/api';
import {
  Search,
  Filter,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface TutorSearchPageProps {
  initialFilters?: Partial<SearchFilterState>;
  onSelectTutor: (tutorId: string) => void;
  onRequestEnquiry: (tutor: TutorProfile) => void;
}

export const TutorSearchPage: React.FC<TutorSearchPageProps> = ({
  initialFilters = {},
  onSelectTutor,
  onRequestEnquiry,
}) => {
  const [board, setBoard] = useState<BoardType | ''>(initialFilters.board || '');
  const [grade, setGrade] = useState<GradeLevel | ''>(initialFilters.grade || '');
  const [subject, setSubject] = useState<SubjectName | ''>(initialFilters.subject || '');
  const [locality, setLocality] = useState<string>(initialFilters.locality || '');
  const [maxBudget, setMaxBudget] = useState<number>(initialFilters.maxBudget || 15000);
  const [minExperience, setMinExperience] = useState<number>(initialFilters.minExperience || 0);
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(initialFilters.verifiedOnly || false);
  const [mode, setMode] = useState<SearchFilterState['mode']>(initialFilters.mode || '');
  const [sortBy, setSortBy] = useState<SearchFilterState['sortBy']>(
    initialFilters.sortBy || 'relevance'
  );

  const [tutors, setTutors] = useState<TutorProfile[]>([]);
  const [matchNotes, setMatchNotes] = useState<Record<string, string[]>>({});
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [visibleLimit, setVisibleLimit] = useState<number>(6);

  useEffect(() => {
    executeSearch();
  }, [board, grade, subject, locality, maxBudget, minExperience, verifiedOnly, mode, sortBy]);

  const executeSearch = async () => {
    setLoading(true);
    try {
      const response = await api.getTutors({
        board,
        grade,
        subject,
        locality,
        maxBudget,
        minExperience,
        verifiedOnly,
        mode,
        sortBy,
      });
      setTutors(response.tutors);
      setTotalCount(response.totalCount);
      setMatchNotes(response.matchExplanations);
    } catch (err) {
      console.error('Failed to search tutors', err);
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setBoard('');
    setGrade('');
    setSubject('');
    setLocality('');
    setMaxBudget(15000);
    setMinExperience(0);
    setVerifiedOnly(false);
    setMode('');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    Boolean(board) ||
    Boolean(grade) ||
    Boolean(subject) ||
    Boolean(locality) ||
    maxBudget < 15000 ||
    minExperience > 0 ||
    verifiedOnly ||
    Boolean(mode);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Find Home Tutors in Mumbai
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Browse verified educators across CBSE, ICSE, Maharashtra SSC, and NIOS boards.
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters ? '●' : ''}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 text-xs font-medium border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="relevance">Relevance & Verification</option>
              <option value="fee_asc">Fee: Low to High</option>
              <option value="fee_desc">Fee: High to Low</option>
              <option value="experience_desc">Teaching Experience</option>
              <option value="rating_desc">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column: Filter Sidebar */}
        <aside
          className={`lg:block ${
            showMobileFilters ? 'block' : 'hidden'
          } bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-6 h-fit sticky top-20`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Filter className="w-4 h-4 text-emerald-600" />
              <span>Search Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Board */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Education Board
            </label>
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Boards</option>
              {BOARDS_LIST.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Grade / Class */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Grade / Class
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Grades (1–12)</option>
              {GRADES_LIST.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Subjects</option>
              {SUBJECTS_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Locality */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Locality in Mumbai
            </label>
            <select
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">All Mumbai Localities</option>
              {MUMBAI_LOCALITIES.map((l) => (
                <option key={l.name} value={l.name}>
                  {l.name} ({l.pinCode})
                </option>
              ))}
            </select>
          </div>

          {/* Max Monthly Budget Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Max Monthly Fee</span>
              <span className="text-emerald-700 font-bold tabular-nums">
                ₹{maxBudget.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="4000"
              max="20000"
              step="500"
              value={maxBudget}
              onChange={(e) => setMaxBudget(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>₹4,000</span>
              <span>₹20,000</span>
            </div>
          </div>

          {/* Minimum Experience */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Minimum Experience
            </label>
            <select
              value={minExperience}
              onChange={(e) => setMinExperience(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value={0}>Any Experience Level</option>
              <option value={3}>3+ Years Experience</option>
              <option value={5}>5+ Years Experience</option>
              <option value={10}>10+ Years Senior Educator</option>
            </select>
          </div>

          {/* Teaching Mode */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tuition Mode
            </label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white text-slate-800"
            >
              <option value="">Any Mode (Home or Online)</option>
              <option value="home_tuition">Home Tuition Only (In-person)</option>
              <option value="online">Online Tuition</option>
            </select>
          </div>

          {/* Verified Only Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-800">
                Verified Tutors Only
              </span>
            </label>
            <span className="text-[11px] text-slate-400 block mt-0.5 ml-6">
              Shows only educators with audited ID & degree transcripts.
            </span>
          </div>
        </aside>

        {/* Right Column: Search Results */}
        <main className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing <strong className="text-slate-900">{tutors.length}</strong> approved home
              tutors in Mumbai
            </span>
            {hasActiveFilters && (
              <span className="text-emerald-700 font-medium">Filters Applied</span>
            )}
          </div>

          {/* Skeletons while loading */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-slate-200 animate-pulse space-y-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="w-1/3 h-4 bg-slate-200 rounded" />
                      <div className="w-1/2 h-3 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-12 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          ) : tutors.length === 0 ? (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No matching home tutors found
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                Try widening your budget, removing the verified-only filter, or switching to another
                Mumbai locality (e.g. Andheri West or Bandra West).
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            /* Results List */
            <div className="space-y-4">
              {tutors.slice(0, visibleLimit).map((tutor) => {
                const reasons = matchNotes[tutor.id] || [];

                return (
                  <div
                    key={tutor.id}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all p-5 sm:p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Top Header: Avatar, Name, Verified, Pricing */}
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                          {/* Initials / Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-base shrink-0">
                            {tutor.fullName
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>

                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <h3
                                onClick={() => onSelectTutor(tutor.id)}
                                className="text-base font-bold text-slate-900 hover:text-emerald-700 cursor-pointer transition-colors"
                              >
                                {tutor.fullName}
                              </h3>

                              {tutor.verificationStatus === 'fully_verified' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                  <span>Verified Educator</span>
                                </span>
                              )}

                              {tutor.verificationStatus === 'partially_verified' && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/80">
                                  <span>ID Verified · Degree in review</span>
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-600">{tutor.qualification}</p>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                              <span className="font-medium text-slate-700">
                                {tutor.experienceYears} yrs teaching
                              </span>
                              <span>·</span>
                              <span>{tutor.almaMater}</span>
                              {tutor.reviewCount > 0 && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-1 text-amber-700 font-semibold">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span>{tutor.rating.toFixed(1)}</span>
                                    <span className="text-slate-400 font-normal">
                                      ({tutor.reviewCount} reviews)
                                    </span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Fee box */}
                        <div className="text-left sm:text-right shrink-0">
                          <div className="text-base sm:text-lg font-bold text-slate-900 tabular-nums">
                            ₹{tutor.hourlyFee.toLocaleString('en-IN')}{' '}
                            <span className="text-xs font-normal text-slate-500">/ hr</span>
                          </div>
                          <div className="text-xs text-slate-500 tabular-nums">
                            ₹{tutor.monthlyFee.toLocaleString('en-IN')} / month
                          </div>
                        </div>
                      </div>

                      {/* Biography */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2">
                        {tutor.biography}
                      </p>

                      {/* Matching Explanation Bar */}
                      {reasons.length > 0 && (
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                          <span className="font-medium text-slate-700 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-600" />
                            Match Insights:
                          </span>
                          {reasons.map((r, idx) => (
                            <span
                              key={idx}
                              className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] text-slate-700"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Service Localities & Boards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-500 pt-1">
                        <div className="flex items-start gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-700">Boards:</strong>{' '}
                            {tutor.boards.join(', ')} ({tutor.grades.slice(0, 3).join(', ')}
                            {tutor.grades.length > 3 ? '...' : ''})
                          </span>
                        </div>

                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-slate-700">Areas:</strong>{' '}
                            {tutor.serviceAreas.map((a) => a.locality).join(', ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 mt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400">
                        Mode:{' '}
                        <strong className="text-slate-600">
                          {tutor.teachingMode === 'both'
                            ? 'Home & Online'
                            : tutor.teachingMode === 'home_tuition'
                            ? 'Home Visits Only'
                            : 'Online Only'}
                        </strong>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => onSelectTutor(tutor.id)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          View Full Profile
                        </button>
                        <button
                          onClick={() => onRequestEnquiry(tutor)}
                          className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-2xs transition-colors"
                        >
                          Send Enquiry
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Load More Button */}
              {visibleLimit < tutors.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => setVisibleLimit((prev) => prev + 6)}
                    className="px-5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-colors"
                  >
                    Load More Tutors ({tutors.length - visibleLimit} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

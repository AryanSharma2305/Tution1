import React, { useState } from 'react';
import { TutorProfile } from '../types';
import { BOARDS_LIST, GRADES_LIST, SUBJECTS_LIST, MUMBAI_LOCALITIES } from '../data/seedData';
import {
  Search,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  ArrowRight,
  BookOpen,
  Calendar,
  Award,
  ChevronDown,
  Sparkles,
  FileCheck2,
  Star,
  Users,
  Compass,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomePageProps {
  onSearch: (params: { board?: string; grade?: string; subject?: string; locality?: string }) => void;
  onSelectTutor: (tutorId: string) => void;
  featuredTutors: TutorProfile[];
  activePilotLocality: string;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSearch,
  onSelectTutor,
  featuredTutors,
  activePilotLocality,
}) => {
  const [board, setBoard] = useState<string>('');
  const [grade, setGrade] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [locality, setLocality] = useState<string>(activePilotLocality);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      board: board || undefined,
      grade: grade || undefined,
      subject: subject || undefined,
      locality: locality || undefined,
    });
  };

  const faqs = [
    {
      q: 'How does HomeTutor verify teachers before assigning them to homes?',
      a: 'We operate a multi-stage verification pipeline. Each tutor must upload government identity records (Aadhaar/Passport) which are cross-verified, followed by university degree certificates and marksheets. Only profiles whose credentials are administrator-reviewed and approved appear in public searches. Look for the "Verified" badge on tutor profiles.',
    },
    {
      q: 'Does submitting an enquiry cost anything for parents or students?',
      a: 'No. Submitting an enquiry on HomeTutor is 100% free for parents and students. You can review profiles, send your syllabus requirements, and communicate directly with tutors without platform commissions.',
    },
    {
      q: 'What education boards are supported in Mumbai?',
      a: 'We support all four major schooling curriculums active in Mumbai: CBSE, Maharashtra SSC (State Board), ICSE / ISC, and NIOS (National Institute of Open Schooling) from Class 1 through Class 12.',
    },
    {
      q: 'Are tutors available for home visits or online sessions?',
      a: 'Both! Most of our educators provide in-person home tuition across Mumbai localities (such as Andheri West, Bandra, Powai, Borivali, Dadar), and also offer interactive online sessions via video call if preferred.',
    },
    {
      q: 'How do monthly fees and payments work?',
      a: 'Each tutor clearly displays both their hourly rate and monthly tuition package (e.g. 3 sessions/week). You arrange scheduling and tuition fees transparently with the tutor after an initial diagnostic session.',
    },
  ];

  return (
    <div className="space-y-20 pb-20 overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-white via-slate-50/80 to-white pt-10 sm:pt-16 pb-16 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Animated Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6 shadow-2xs"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Mumbai Pilot Hub: <strong>{activePilotLocality}</strong> & Western Suburbs</span>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & Search Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
                Find the Right Home Tutor for Your Child in Mumbai.
              </h1>
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                Connect with qualified, background-audited educators specialized in CBSE, ICSE,
                Maharashtra SSC, and NIOS. Transparent pricing, proven credentials, and direct communication.
              </p>

              {/* Live Search Form Card */}
              <motion.form
                whileHover={{ y: -2 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleHeroSearch}
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-xl border border-slate-200/90 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Board */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Education Board
                    </label>
                    <select
                      value={board}
                      onChange={(e) => setBoard(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-800 font-medium transition-all"
                    >
                      <option value="">Any Board</option>
                      {BOARDS_LIST.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Class / Grade */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Class / Grade
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-800 font-medium transition-all"
                    >
                      <option value="">All Classes (1 to 12)</option>
                      {GRADES_LIST.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Subject
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-800 font-medium transition-all"
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Mumbai Locality / PIN
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <select
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-800 font-medium transition-all"
                      >
                        <option value="">Across Mumbai</option>
                        {MUMBAI_LOCALITIES.map((l) => (
                          <option key={l.name} value={l.name}>
                            {l.name} ({l.pinCode}) {l.isPilotHub ? '⭐ Pilot Hub' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Every tutor profile is vetted by admin before listing</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full sm:w-auto px-7 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-2 transition-all text-xs sm:text-sm"
                  >
                    <Search className="w-4 h-4 text-emerald-400" />
                    <span>Find My Tutor</span>
                  </motion.button>
                </div>
              </motion.form>
            </motion.div>

            {/* Right Column: High Fidelity Educational Visual with Layered Floating Badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-100 group">
                <img
                  src="/src/assets/images/hero_home_tutoring_1792493782202.jpg"
                  alt="Indian student studying with an encouraging home tutor in a bright Mumbai apartment study room"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover aspect-[4/3] group-hover:scale-102 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Personalized 1-on-1 Guidance</span>
                    </div>
                    <div className="text-sm font-medium text-slate-200">
                      Targeted board syllabus preparation right at your dining table or study desk.
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Verified Trust Pill */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="hidden sm:flex absolute -bottom-5 -left-5 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-slate-200 items-center gap-3 z-10"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Audited Credentials</div>
                  <div className="text-[11px] text-slate-500">Degrees & Government IDs Checked</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 1.5 ANIMATED KPI PROOF STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              98.4%
            </div>
            <div className="text-xs font-medium text-slate-500">Parent & Student Satisfaction</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 tabular-nums">
              450+
            </div>
            <div className="text-xs font-medium text-slate-500">Verified Sessions in Mumbai</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600 tabular-nums">
              4 Boards
            </div>
            <div className="text-xs font-medium text-slate-500">CBSE, SSC, ICSE & NIOS</div>
          </div>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tabular-nums">
              12+
            </div>
            <div className="text-xs font-medium text-slate-500">Localities across Mumbai</div>
          </div>
        </div>
      </section>

      {/* 2. TRUST & VERIFICATION PROCESS SECTION */}
      <section id="trust" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Honest Trust & Safety</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Transparent Verification. No False Promises.
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We believe parents deserve complete clarity. We do <strong>not</strong> make blanket claims
            that every educator in Mumbai is background-checked. Each tutor profile transparently
            displays their exact verification audit records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">1. Government ID Verification</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tutors submit official government identity proofs (Aadhaar or Passport). Our operations
              team audits the record to ensure the tutor’s legal identity is authenticated.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">2. Academic Degrees & Transcripts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Original university convocation certificates, M.Sc / B.Tech diplomas, and B.Ed credentials
              are cross-checked before the qualification checkmark is granted.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">3. Admin Approval & Conduct</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unapproved profiles are strictly excluded from public search. Parents can report complaints
              or scheduling breaches, which are audited by our administrator panel.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How HomeTutor Works
            </h2>
            <p className="text-sm text-slate-600">
              Four simple, transparent steps to organize dedicated home tuition for your child.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div whileHover={{ y: -3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-bold text-emerald-600/30 mb-2 font-mono">01</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Tell Us Requirements</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Select your student's board (CBSE, ICSE, SSC, NIOS), grade, subject, and locality in Mumbai.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-bold text-emerald-600/30 mb-2 font-mono">02</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Explore Matched Tutors</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review verified qualifications, teaching experience, hourly fees, and service areas.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-bold text-emerald-600/30 mb-2 font-mono">03</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Send Tuition Enquiry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Submit your child's syllabus focus and preferred days. Tutors review and respond directly.
              </p>
            </motion.div>

            <motion.div whileHover={{ y: -3 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs relative">
              <div className="text-3xl font-bold text-emerald-600/30 mb-2 font-mono">04</div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Connect & Begin Lessons</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinate your schedule, conduct an initial diagnostic lesson, and finalize ongoing tuition.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. POPULAR BOARDS & SUBJECTS */}
      <section id="boards" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Education Boards */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Education Boards in Mumbai
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Tutors customized to each board's examination blueprints and marking schemes.
              </p>
            </div>
            <button
              onClick={() => onSearch({})}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BOARDS_LIST.map((b) => (
              <motion.button
                key={b}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onSearch({ board: b })}
                className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-emerald-600 hover:shadow-md transition-all text-left group"
              >
                <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {b}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {b === 'CBSE' && 'National NCERT curriculum, Class 1 to 12'}
                  {b === 'Maharashtra SSC' && 'State Board syllabus, Class 8, 9 & 10 Boards'}
                  {b === 'ICSE' && 'CISCE Board, comprehensive English & Science'}
                  {b === 'NIOS' && 'Flexible Open Schooling syllabus'}
                </div>
                <div className="mt-3 text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <span>Browse Tutors</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Popular Subjects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Popular Tuition Subjects
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                From foundational mental math to Class 12 Calculus and Chemistry.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              'Mathematics',
              'Physics',
              'Chemistry',
              'Biology',
              'Science',
              'English',
              'Computer Science',
              'Marathi',
              'Hindi',
              'Economics',
              'Accountancy & Commerce',
              'Social Studies',
            ].map((sub) => (
              <motion.button
                key={sub}
                whileHover={{ y: -2 }}
                onClick={() => onSearch({ subject: sub })}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-600 hover:bg-emerald-50/20 transition-all text-left"
              >
                <BookOpen className="w-4 h-4 text-emerald-600 mb-1.5" />
                <div className="text-xs font-semibold text-slate-900 truncate">{sub}</div>
                <div className="text-[11px] text-slate-400">View tutors</div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FEATURED APPROVED TUTORS */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approved & Active Listings</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
                Featured Home Tutors in Mumbai
              </h2>
            </div>
            <button
              onClick={() => onSearch({})}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Explore All Approved Tutors
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTutors.slice(0, 3).map((tutor) => (
              <motion.div
                key={tutor.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg">
                        {tutor.fullName
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{tutor.fullName}</h3>
                        <p className="text-xs text-slate-500 line-clamp-1">{tutor.qualification}</p>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  {tutor.verificationStatus === 'fully_verified' && (
                    <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/80">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>ID & Degree Verified</span>
                    </div>
                  )}

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {tutor.biography}
                  </p>

                  <div className="space-y-1.5 pt-1 text-xs">
                    <div className="text-slate-500">
                      <strong>Subjects:</strong> {tutor.subjects.slice(0, 3).join(', ')}
                    </div>
                    <div className="text-slate-500">
                      <strong>Boards:</strong> {tutor.boards.join(', ')}
                    </div>
                    <div className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{tutor.serviceAreas.map((a) => a.locality).join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="text-base font-bold text-slate-900 tabular-nums">
                      ₹{tutor.hourlyFee.toLocaleString('en-IN')}{' '}
                      <span className="text-xs font-normal text-slate-500">/ hour</span>
                    </div>
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      or ₹{tutor.monthlyFee.toLocaleString('en-IN')}/mo
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTutor(tutor.id)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQS */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">
            Everything you need to know about HomeTutor's Mumbai operations.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left px-5 py-4 text-sm font-semibold text-slate-900 flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-500 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-emerald-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

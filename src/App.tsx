import React, { useState, useEffect } from 'react';
import { User, TutorProfile, SearchFilterState } from './types';
import { api } from './services/api';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TutorSearchPage } from './pages/TutorSearchPage';
import { TutorProfilePage } from './pages/TutorProfilePage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { ParentDashboardPage } from './pages/ParentDashboardPage';
import { TutorDashboardPage } from './pages/TutorDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PrivacyTermsPage } from './pages/PrivacyTermsPage';
import { EnquiryModal } from './components/EnquiryModal';
import { ComplaintModal } from './components/ComplaintModal';
import { AuthModal } from './components/AuthModal';
import { TechArchitectureModal } from './components/TechArchitectureModal';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedTutorId, setSelectedTutorId] = useState<string | null>(null);
  const [selectedTutorObj, setSelectedTutorObj] = useState<TutorProfile | null>(null);
  const [searchFilters, setSearchFilters] = useState<Partial<SearchFilterState>>({});
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [activePilotLocality, setActivePilotLocality] = useState<string>('Andheri West');

  // Modals
  const [enquiryTutor, setEnquiryTutor] = useState<TutorProfile | null>(null);
  const [complaintTutor, setComplaintTutor] = useState<TutorProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [architectureModalOpen, setArchitectureModalOpen] = useState(false);

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'info' | 'error'; message: string } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Restore session from token on mount
  useEffect(() => {
    async function initSession() {
      try {
        const user = await api.getMe();
        if (user) {
          setCurrentUser(user);
        }
      } catch (err) {
        console.warn('No active session found', err);
      }
      loadFeatured();
    }
    initSession();
  }, []);

  const loadFeatured = async () => {
    try {
      const res = await api.getTutors({ verifiedOnly: false, sortBy: 'relevance' });
      setFeaturedTutors(res.tutors);
      const loc = await api.getActivePilotLocality();
      setActivePilotLocality(loc);
    } catch (err) {
      console.error('Failed to load featured tutors', err);
    }
  };

  const handleNavigate = (view: string, params?: any) => {
    setCurrentView(view);
    if (params?.tutorId) {
      setSelectedTutorId(params.tutorId);
      api.getTutorById(params.tutorId).then((t) => setSelectedTutorObj(t)).catch(() => {});
    }
    if (params?.scrollTo) {
      setTimeout(() => {
        const el = document.getElementById(params.scrollTo);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchFromHome = (params: {
    board?: string;
    grade?: string;
    subject?: string;
    locality?: string;
  }) => {
    setSearchFilters({
      board: params.board as any,
      grade: params.grade as any,
      subject: params.subject as any,
      locality: params.locality,
    });
    setCurrentView('search');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTutor = async (tutorId: string) => {
    setSelectedTutorId(tutorId);
    try {
      const tutor = await api.getTutorById(tutorId);
      setSelectedTutorObj(tutor);
    } catch {
      // fallback
    }
    setCurrentView('tutor_profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRequestEnquiry = (tutor: TutorProfile) => {
    if (!currentUser) {
      showToast('Please sign in or register to send a tuition enquiry', 'info');
      setAuthModalOpen(true);
      return;
    }
    setEnquiryTutor(tutor);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('home');
    showToast('Signed out successfully', 'info');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white shadow-2xl border border-slate-700 text-xs font-semibold"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar (Strictly no pre-user switcher, conditional Admin Console) */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Page View Routing with Motion Fade */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentView === 'home' && (
              <HomePage
                onSearch={handleSearchFromHome}
                onSelectTutor={handleSelectTutor}
                featuredTutors={featuredTutors}
                activePilotLocality={activePilotLocality}
              />
            )}

            {currentView === 'search' && (
              <TutorSearchPage
                initialFilters={searchFilters}
                onSelectTutor={handleSelectTutor}
                onRequestEnquiry={handleRequestEnquiry}
              />
            )}

            {currentView === 'tutor_profile' && selectedTutorObj && (
              <TutorProfilePage
                tutor={selectedTutorObj}
                currentUser={currentUser || {
                  id: 'guest',
                  fullName: 'Guest Visitor',
                  email: '',
                  phone: '',
                  role: 'parent',
                  createdAt: '',
                }}
                onBack={() => setCurrentView('search')}
                onRequestEnquiry={handleRequestEnquiry}
                onReportProfile={(tutor) => setComplaintTutor(tutor)}
              />
            )}

            {currentView === 'student_dashboard' && currentUser && (
              <StudentDashboardPage
                currentUser={currentUser}
                onNavigateToSearch={() => setCurrentView('search')}
                onSelectTutor={handleSelectTutor}
              />
            )}

            {currentView === 'parent_dashboard' && currentUser && (
              <ParentDashboardPage
                currentUser={currentUser}
                onNavigateToSearch={() => setCurrentView('search')}
                onSelectTutor={handleSelectTutor}
              />
            )}

            {currentView === 'tutor_dashboard' && currentUser && (
              <TutorDashboardPage currentUser={currentUser} />
            )}

            {currentView === 'admin_dashboard' && currentUser && (
              <AdminDashboardPage currentUser={currentUser} />
            )}

            {currentView === 'privacy' && (
              <PrivacyTermsPage type="privacy" onBack={() => setCurrentView('home')} />
            )}

            {currentView === 'terms' && (
              <PrivacyTermsPage type="terms" onBack={() => setCurrentView('home')} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenArchitecture={() => setArchitectureModalOpen(true)}
      />

      {/* Interactive Modals */}
      {enquiryTutor && currentUser && (
        <EnquiryModal
          tutor={enquiryTutor}
          currentUser={currentUser}
          onClose={() => setEnquiryTutor(null)}
          onSuccess={() => {
            setEnquiryTutor(null);
            showToast('Tuition enquiry delivered to tutor!', 'success');
            if (currentUser.role === 'student') {
              setCurrentView('student_dashboard');
            } else {
              setCurrentView('parent_dashboard');
            }
          }}
        />
      )}

      {complaintTutor && (
        <ComplaintModal
          tutorId={complaintTutor.id}
          tutorName={complaintTutor.fullName}
          onClose={() => {
            setComplaintTutor(null);
            showToast('Ticket submitted to Trust & Safety team', 'info');
          }}
        />
      )}

      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Signed in as ${user.fullName} (${user.role === 'tutor' ? 'Teacher' : user.role})`, 'success');
            if (user.role === 'admin') {
              setCurrentView('admin_dashboard');
            } else if (user.role === 'tutor') {
              setCurrentView('tutor_dashboard');
            } else if (user.role === 'student') {
              setCurrentView('student_dashboard');
            } else {
              setCurrentView('parent_dashboard');
            }
          }}
        />
      )}

      {architectureModalOpen && (
        <TechArchitectureModal onClose={() => setArchitectureModalOpen(false)} />
      )}
    </div>
  );
}

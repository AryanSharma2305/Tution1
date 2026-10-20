import React, { useState } from 'react';
import { User } from '../types';
import {
  Menu,
  X,
  GraduationCap,
  LayoutDashboard,
  Search,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardView = () => {
    if (!currentUser) return 'home';
    if (currentUser.role === 'admin') return 'admin_dashboard';
    if (currentUser.role === 'tutor') return 'tutor_dashboard';
    if (currentUser.role === 'student') return 'student_dashboard';
    return 'parent_dashboard';
  };

  const getDashboardLabel = () => {
    if (!currentUser) return 'Dashboard';
    if (currentUser.role === 'admin') return 'Admin Console';
    if (currentUser.role === 'tutor') return 'Teacher Portal';
    if (currentUser.role === 'student') return 'My Learning';
    return 'Parent Enquiries';
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'tutor':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'student':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-lg group"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                HomeTutor
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-emerald-700 uppercase mt-0.5">
                Mumbai Pilot
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('search')}
              className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentView === 'search' ? 'text-emerald-700 font-semibold' : ''
              }`}
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Find Tutors</span>
            </button>

            <button
              onClick={() => onNavigate('home', { scrollTo: 'how-it-works' })}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0"
            >
              How It Works
            </button>

            <button
              onClick={() => onNavigate('home', { scrollTo: 'boards' })}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0"
            >
              Boards & Subjects
            </button>

            <button
              onClick={() => onNavigate('home', { scrollTo: 'trust' })}
              className="hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Verification</span>
            </button>

            {/* Role-Specific Portal Button (ONLY shows when authenticated!) */}
            {currentUser && (
              <button
                onClick={() => onNavigate(getDashboardView())}
                className={`hover:text-slate-950 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  currentView.includes('dashboard') ? 'text-emerald-700 font-semibold' : ''
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                <span>{getDashboardLabel()}</span>
              </button>
            )}
          </nav>

          {/* Zone 3: Authentication / User Pill */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {currentUser ? (
              <div className="flex items-center gap-3">
                {/* User Identity Pill */}
                <div className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-slate-50 border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    {currentUser.fullName[0]}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[130px] truncate">
                    {currentUser.fullName}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role === 'tutor' ? 'Teacher' : currentUser.role}
                  </span>
                </div>

                {/* Primary Action Button */}
                {currentUser.role === 'admin' ? (
                  <button
                    onClick={() => onNavigate('admin_dashboard')}
                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-sm transition-colors"
                  >
                    Admin Console
                  </button>
                ) : (
                  <button
                    onClick={() => onNavigate('search')}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors"
                  >
                    Find Tutors
                  </button>
                )}

                {/* Sign Out Button */}
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={onOpenAuthModal}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={onOpenAuthModal}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all hover:shadow"
                >
                  Get Started
                </button>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-2"
          >
            {currentUser && (
              <div className="p-3 bg-slate-50 rounded-xl mb-2 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{currentUser.fullName}</div>
                  <div className="text-[11px] text-slate-500 capitalize">{currentUser.role}</div>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-rose-600 font-semibold flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            )}

            <button
              onClick={() => {
                onNavigate('search');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <Search className="w-4 h-4 text-slate-400" />
              Find Tutors
            </button>

            <button
              onClick={() => {
                onNavigate('home', { scrollTo: 'how-it-works' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              How It Works
            </button>

            <button
              onClick={() => {
                onNavigate('home', { scrollTo: 'boards' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Boards & Subjects
            </button>

            <button
              onClick={() => {
                onNavigate('home', { scrollTo: 'trust' });
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verification
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  onNavigate(getDashboardView());
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2.5 px-3 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-400" />
                {getDashboardLabel()}
              </button>
            )}

            {!currentUser && (
              <div className="pt-2 border-t border-slate-100 flex gap-2">
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold text-center text-slate-800 bg-slate-100 rounded-xl"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-2.5 px-4 text-xs font-bold text-center text-white bg-slate-900 rounded-xl"
                >
                  Register
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

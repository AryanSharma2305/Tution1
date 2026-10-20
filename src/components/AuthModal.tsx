import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';
import {
  X,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  AlertCircle,
  GraduationCap,
  Users,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MUMBAI_LOCALITIES } from '../data/seedData';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'student' | 'parent' | 'tutor'>('student');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [locality, setLocality] = useState('Andheri West');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both email address and password.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'register') {
        if (!fullName.trim() || !phone.trim()) {
          setError('Please provide your full name and contact phone number.');
          setLoading(false);
          return;
        }

        const registeredUser = await api.register({
          fullName: fullName.trim(),
          email: cleanEmail,
          phone: phone.trim(),
          password: cleanPassword,
          role,
          locality,
          pinCode: MUMBAI_LOCALITIES.find((l) => l.name === locality)?.pinCode || '400053',
        });

        onSuccess(registeredUser);
        onClose();
      } else {
        // Sign in via API
        const authenticatedUser = await api.login(cleanEmail, cleanPassword);
        onSuccess(authenticatedUser);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickCredential = (quickEmail: string, quickPass: string) => {
    setEmail(quickEmail);
    setPassword(quickPass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-200/80 overflow-hidden relative"
      >
        {/* Top Decorative Header */}
        <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 pt-6 pb-5 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
              <GraduationCap className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold tracking-wider text-emerald-400 uppercase">
              HomeTutor Mumbai
            </span>
          </div>

          <h2 className="text-xl font-bold text-white tracking-tight">
            {mode === 'login' ? 'Sign In to Your Account' : 'Join HomeTutor Mumbai'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            {mode === 'login'
              ? 'Access your lessons, tuition enquiries, and teacher scheduling.'
              : 'Connect directly with verified educators or offer home tuition.'}
          </p>

          {/* Segmented Mode Selector */}
          <div className="flex mt-4 p-1 bg-slate-950/60 rounded-xl border border-slate-700/50">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Registration Role Selection: ONLY Student, Parent, Teacher (NO ADMIN!) */}
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                I am registering as:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'student'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Student</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'parent'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Parent</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    role === 'tutor'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs">Teacher</span>
                </button>
              </div>
            </div>
          )}

          {/* Full Name (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder={
                    role === 'tutor'
                      ? 'e.g. Prof. Arvind Kadam'
                      : role === 'student'
                      ? 'e.g. Aarav Sharma'
                      : 'e.g. Priya Sharma'
                  }
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
              />
            </div>
          </div>

          {/* Phone Number (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number (WhatsApp reachable)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Locality (Registration only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Locality in Mumbai
              </label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-emerald-500"
              >
                {MUMBAI_LOCALITIES.map((loc) => (
                  <option key={loc.name} value={loc.name}>
                    {loc.name} ({loc.pinCode})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Credential Test Helper Chips */}
          {mode === 'login' && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Quick Sign-In (Click to populate):
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickCredential('student@gmail.com', 'student@123')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <div className="font-bold text-[11px] text-slate-900">Student</div>
                  <div className="text-[10px] text-slate-500 truncate">student@gmail.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickCredential('parent@gmail.com', 'parent@123')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <div className="font-bold text-[11px] text-slate-900">Parent</div>
                  <div className="text-[10px] text-slate-500 truncate">parent@gmail.com</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickCredential('teacher@gmail.com', 'teacher@123')}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition-colors"
                >
                  <div className="font-bold text-[11px] text-slate-900">Teacher</div>
                  <div className="text-[10px] text-slate-500 truncate">teacher@gmail.com</div>
                </button>
              </div>

              {/* Discreet note for admin without public button */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
                <span>Authorized administrators sign in using registered admin email credentials.</span>
              </div>
            </div>
          )}

          {/* Submit Button with Hover / Tap Motion */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>
              {loading
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In to HomeTutor'
                : `Create ${role === 'tutor' ? 'Teacher' : role === 'student' ? 'Student' : 'Parent'} Account`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

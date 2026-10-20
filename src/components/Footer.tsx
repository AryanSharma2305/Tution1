import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  onOpenArchitecture: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenArchitecture }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Col 1: Brand & Pilot Hub */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-base">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">HomeTutor</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Mumbai's transparent home-tutoring marketplace connecting verified educators with
              families across CBSE, ICSE, SSC, and NIOS curricula.
            </p>
            <div className="flex items-start gap-2 text-xs text-slate-400 pt-1">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Pilot Launch: Andheri West (400053) & Western Suburbs, Mumbai</span>
            </div>
          </div>

          {/* Col 2: Boards & Grades */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Education Boards
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('search', { board: 'CBSE' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  CBSE (Class 1–12)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { board: 'Maharashtra SSC' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Maharashtra SSC (Class 8–10)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { board: 'ICSE' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ICSE / ISC Board
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { board: 'NIOS' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  NIOS Open Schooling
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Localities */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Mumbai Service Areas
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('search', { locality: 'Andheri West' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Andheri West & Lokhandwala
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { locality: 'Bandra West' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Bandra West & Khar
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { locality: 'Powai' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Powai & Hiranandani
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { locality: 'Borivali West' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Borivali & Kandivali West
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('search', { locality: 'Dadar' })}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Dadar, Matunga & Prabhadevi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Operations */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Trust & Platform
            </h4>
            <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-medium text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Verification Policy</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                We verify government identity documents and college degree transcripts before granting
                the verified badge. Only approved tutors appear in public search.
              </p>
            </div>
            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@hometutor.mumbai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>+91 22 4910 8800 (Mon–Sat 9AM–7PM IST)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} HomeTutor Technologies Pvt. Ltd. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('privacy')}
              className="hover:text-slate-200 transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onNavigate('terms')}
              className="hover:text-slate-200 transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={onOpenArchitecture}
              className="text-teal-400 hover:text-teal-300 font-medium transition-colors"
            >
              FastAPI & Schema Docs
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

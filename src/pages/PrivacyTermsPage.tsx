import React from 'react';
import { ShieldCheck, Lock, FileText, ChevronLeft } from 'lucide-react';

interface PrivacyTermsPageProps {
  type: 'privacy' | 'terms';
  onBack: () => void;
}

export const PrivacyTermsPage: React.FC<PrivacyTermsPageProps> = ({ type, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </button>

      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
        {type === 'privacy' ? (
          <>
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                HomeTutor Privacy Policy
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Data Privacy & Family Safety Standards
              </h1>
              <p className="text-xs text-slate-500">
                Effective: October 2026 · Mumbai Operations
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">1. Verification Document Protection</h2>
              <p className="text-xs text-slate-600">
                Government identification cards (Aadhaar, Passport) and academic degree certificates submitted by educators are stored in private, access-controlled vaults. Under no circumstances are identity documents made publicly accessible or visible to students, parents, or outside parties.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Parent & Student Contact Privacy</h2>
              <p className="text-xs text-slate-600">
                When a parent submits an enquiry, their phone number and specific Mumbai address are revealed exclusively to the selected tutor. We do not sell or broadcast parental contact details to marketing agencies or unauthorized tutors.
              </p>

              <h2 className="text-base font-bold text-slate-900">3. Verification Labeling Honesty</h2>
              <p className="text-xs text-slate-600">
                In strict compliance with our trust charter, we distinguish between <em>Identity checked</em>, <em>Qualification documents checked</em>, and <em>Profile approved</em>. We do not claim tutors are criminal-background-cleared unless a formal police clearance certificate has been validated.
              </p>

              <h2 className="text-base font-bold text-slate-900">4. Data Deletion Requests</h2>
              <p className="text-xs text-slate-600">
                Any registered parent or educator may request account deactivation and removal of uploaded records at any time by contacting support@hometutor.mumbai.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-1 border-b border-slate-100 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                HomeTutor Terms of Service
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                Marketplace Platform Terms
              </h1>
              <p className="text-xs text-slate-500">
                Effective: October 2026 · Mumbai Operations
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">1. Marketplace Scope</h2>
              <p className="text-xs text-slate-600">
                HomeTutor operates as a discovery and connection platform for independent educators and families in Mumbai. Tutors provide tuition as independent contractors and are not direct employees of HomeTutor.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Transparent Pricing</h2>
              <p className="text-xs text-slate-600">
                All pricing is displayed in Indian Rupees (₹ INR). Educators state both hourly rates and monthly commitments clearly to avoid unexpected price escalations.
              </p>

              <h2 className="text-base font-bold text-slate-900">3. In-Home Safety Protocols</h2>
              <p className="text-xs text-slate-600">
                Families are advised to conduct initial tutoring sessions in open common rooms and verify tutor identity. Any concerns regarding misconduct, attendance defaults, or syllabus falsification can be reported directly via our Dispute & Complaint system.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

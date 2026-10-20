import React, { useState } from 'react';
import { api } from '../services/api';
import { X, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ComplaintModalProps {
  tutorId?: string;
  tutorName?: string;
  enquiryId?: string;
  onClose: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({
  tutorId,
  tutorName,
  enquiryId,
  onClose,
}) => {
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('reschedule_issue');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide details regarding the complaint or concern.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await api.submitComplaint({
        tutorId,
        enquiryId,
        description: `[Category: ${category}] ${description.trim()}`,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2 text-rose-600 font-semibold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Report Profile or Submit Complaint</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Complaint Submitted to Admin</h4>
            <p className="text-xs text-slate-600">
              Our Mumbai trust & safety operations team has received your ticket and will audit
              the tutor’s record within 24 business hours.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">{error}</div>
            )}

            {tutorName && (
              <div className="text-xs text-slate-600">
                Reporting on tutor: <strong className="text-slate-900">{tutorName}</strong>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
              >
                <option value="reschedule_issue">Repeated Unscheduled Cancellations</option>
                <option value="syllabus_mismatch">Syllabus / Board Incompatibility</option>
                <option value="fee_dispute">Fee Dispute or Offline Cash Escalation</option>
                <option value="unprofessional_conduct">Unprofessional Conduct</option>
                <option value="inaccurate_profile">Inaccurate Profile or Qualifications</option>
                <option value="other">Other Concern</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description of the Incident <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Please describe what happened, dates, and any relevant communication..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-2 text-xs text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit to Admin Team'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Send, Link, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function SubmitAssignmentModal({ isOpen, onClose, assignment, student, onSubmit }) {
  const [submissionText, setSubmissionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      toast.error('Please enter your submission link or solution notes.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(
        assignment.id,
        student?.id || 'std-api-1',
        student?.name || student?.fullName || 'Terry Medhurst',
        submissionText
      );
      toast.success(`Successfully submitted task for "${assignment.title}"! 🎉`);
      setSubmissionText('');
      onClose();
    } catch (err) {
      toast.error('Failed to submit assignment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="teal-glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Send className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Submit Work</h3>
              <p className="text-xs text-emerald-200/70">
                Course: <span className="font-bold text-white">{assignment.courseTitle}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Task Details Banner */}
        <div className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/25 space-y-2">
          <h4 className="text-sm font-bold text-white">{assignment.title}</h4>
          <p className="text-xs text-emerald-200/70 leading-relaxed bg-[#061923] p-3 rounded-xl border border-emerald-500/20">
            {assignment.instructions || 'Follow assignment guidelines and submit your repository link or solution below.'}
          </p>
          <div className="flex justify-between items-center text-xs pt-1">
            <span className="text-emerald-400 font-bold">Due Date: {assignment.dueDate}</span>
            <span className="text-amber-400 font-black">{assignment.totalPoints} Points</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Submission Link / Solution Code / Notes *
            </label>
            <textarea
              rows="4"
              required
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm resize-none"
              placeholder="Paste your GitHub repository link, Live CodePen URL, or solution notes here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-emerald-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-200 hover:text-white hover:bg-emerald-500/10 text-xs font-bold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 emerald-btn rounded-xl text-xs font-black shadow-lg flex items-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>Submit Work</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle, MessageSquare, ExternalLink } from 'lucide-react';
import { toast } from 'react-toastify';

export default function GradeSubmissionModal({ isOpen, onClose, submission, assignment, onGrade }) {
  const [grade, setGrade] = useState(90);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submission) {
      setGrade(submission.grade !== null && submission.grade !== undefined ? submission.grade : 90);
      setFeedback(submission.feedback || 'Great work on completing this task!');
    }
  }, [submission, isOpen]);

  if (!isOpen || !submission) return null;

  const maxPoints = assignment ? assignment.totalPoints : 100;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onGrade(submission.id, grade, feedback);
      toast.success(`Graded submission for ${submission.studentName}! (${grade}/${maxPoints}) 🎉`);
      onClose();
    } catch (err) {
      toast.error('Failed to save grade');
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
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Grade Student Submission</h3>
              <p className="text-xs text-emerald-200/70">
                Student: <span className="font-bold text-white">{submission.studentName}</span>
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

        {/* Student Submission Banner */}
        <div className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/25 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-emerald-400 font-bold">Submission Details</span>
            <span className="text-emerald-200/60">{new Date(submission.submittedAt).toLocaleDateString()}</span>
          </div>
          <div className="bg-[#061923] p-3 rounded-xl border border-emerald-500/20 text-xs text-emerald-100 font-mono break-all">
            {submission.submissionText}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Awarded Grade / Score (Max {maxPoints}) *
            </label>
            <input
              type="number"
              min="0"
              max={maxPoints}
              required
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm font-bold text-emerald-300"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Instructor Feedback & Comments
            </label>
            <textarea
              rows="3"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm resize-none"
              placeholder="Provide constructive feedback for the student..."
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
              <CheckCircle className="w-4 h-4" />
              <span>Save Grade</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

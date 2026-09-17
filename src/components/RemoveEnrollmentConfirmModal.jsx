import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

export default function RemoveEnrollmentConfirmModal({ isOpen, enrollment, onClose, onConfirmRemove }) {
  if (!isOpen || !enrollment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative border border-rose-500/30 text-center">
        
        <div className="w-14 h-14 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-2xl mx-auto flex items-center justify-center">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-white">Cancel Enrollment?</h3>
          <p className="text-xs text-emerald-200/70 font-semibold">
            Are you sure you want to remove <strong className="text-amber-300">"{enrollment.studentName}"</strong> from <strong className="text-emerald-300">"{enrollment.courseTitle}"</strong>?
          </p>
        </div>

        <div className="flex justify-center space-x-3 pt-2 border-t border-emerald-500/15">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition cursor-pointer"
          >
            Keep Enrollment
          </button>
          <button
            onClick={() => {
              onConfirmRemove(enrollment.id);
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-black bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Remove Enrollment</span>
          </button>
        </div>

      </div>
    </div>
  );
}

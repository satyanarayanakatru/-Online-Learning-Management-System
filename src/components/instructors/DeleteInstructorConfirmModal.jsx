import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteInstructorConfirmModal({ isOpen, onClose, onConfirm, instructor }) {
  if (!isOpen || !instructor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="teal-glass-card w-full max-w-md p-6 sm:p-8 rounded-3xl border border-rose-500/30 shadow-2xl relative space-y-6">
        
        <div className="w-14 h-14 bg-rose-500/15 border border-rose-500/30 rounded-2xl flex items-center justify-center text-rose-400 mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="text-center space-y-2">
          <h3 className="text-xl font-black text-white">Delete Faculty Instructor?</h3>
          <p className="text-xs text-emerald-200/70 leading-relaxed">
            Are you sure you want to remove <span className="font-bold text-white">{instructor.name}</span>? This action cannot be undone and will unassign them from their active courses.
          </p>
        </div>

        <div className="flex items-center justify-center space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-200 hover:text-white hover:bg-emerald-500/10 text-xs font-bold transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(instructor.id);
              onClose();
            }}
            className="px-5 py-2.5 bg-rose-500/80 hover:bg-rose-500 text-white rounded-xl text-xs font-extrabold shadow-lg flex items-center gap-1.5 cursor-pointer transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>Confirm Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
}

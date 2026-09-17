import React from 'react';
import { X, User, Mail, Phone, MapPin, GraduationCap, Calendar, ShieldCheck } from 'lucide-react';

export default function StudentDetailsModal({ student, onClose }) {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-emerald-500/30">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg">
              {student.fullName?.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">{student.fullName}</h3>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                Student ID: {student.id}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Specs Grid */}
        <div className="space-y-3.5 text-xs sm:text-sm">
          
          <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-emerald-200/70">
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email Address</span>
            </div>
            <span className="font-bold text-white">{student.email}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-emerald-200/70">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>Mobile Phone</span>
            </div>
            <span className="font-bold text-white">{student.mobile}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-emerald-200/70">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Qualification</span>
            </div>
            <span className="font-extrabold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-500/40 text-xs">
              {student.qualification}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-emerald-200/70">
              <Calendar className="w-4 h-4 text-teal-400" />
              <span>Enrollment Date</span>
            </div>
            <span className="font-mono text-emerald-300 font-bold">{student.enrollmentDate}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/20 space-y-1">
            <div className="flex items-center space-x-3 text-emerald-200/70">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Address</span>
            </div>
            <p className="font-semibold text-white pl-7 text-xs">{student.address}</p>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-emerald-500/20">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}

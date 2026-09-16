import React from 'react';
import { X, Star, Clock, UserCheck, Tag, Layers, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function CourseDetailsModal({ course, onClose, onEnrollQuick }) {
  if (!course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative border border-emerald-500/30 flex flex-col max-h-[90vh]">
        
        {/* Thumbnail Banner Header */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061923] via-[#061923]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white bg-slate-950/60 hover:bg-slate-950 rounded-full border border-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 shadow-md inline-block">
              {course.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {course.title}
            </h2>
          </div>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-2xl bg-[#04121b] border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-200/60 font-bold uppercase block">Rating</span>
              <span className="text-sm font-black text-amber-400 flex items-center justify-center gap-1 mt-0.5">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating} / 5.0
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#04121b] border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-200/60 font-bold uppercase block">Level</span>
              <span className="text-sm font-black text-emerald-300 mt-0.5 block">
                {course.level}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#04121b] border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-200/60 font-bold uppercase block">Duration</span>
              <span className="text-xs font-black text-teal-300 mt-1 block">
                {course.duration}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#04121b] border border-emerald-500/20 text-center">
              <span className="text-[10px] text-emerald-200/60 font-bold uppercase block">Price</span>
              <span className="text-sm font-black text-emerald-400 mt-0.5 block">
                ${course.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Instructor & Verification */}
          <div className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-base">
                {course.instructor.charAt(0)}
              </div>
              <div>
                <p className="text-xs text-emerald-200/60 font-semibold">Course Instructor</p>
                <h4 className="text-sm font-black text-white">{course.instructor}</h4>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-500/30">
              <ShieldCheck className="w-3.5 h-3.5" /> Certified Faculty
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-black text-emerald-200 uppercase tracking-wider">Course Overview & Syllabus</h4>
            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed bg-[#04121b]/60 p-4 rounded-2xl border border-emerald-500/10">
              {course.description}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 px-6 border-t border-emerald-500/20 flex items-center justify-between bg-[#04121b] shrink-0">
          <div>
            <span className="text-[10px] text-emerald-200/60 font-bold uppercase block">Course Fee</span>
            <span className="text-xl font-black text-emerald-400">${course.price.toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition"
            >
              Close
            </button>
            {onEnrollQuick && (
              <button
                onClick={() => {
                  onEnrollQuick(course);
                  onClose();
                }}
                className="px-5 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition"
              >
                Enroll Student
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

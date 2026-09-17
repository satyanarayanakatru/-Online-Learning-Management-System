import React from 'react';
import { X, Award, CheckCircle, Clock, BookOpen, User, Calendar, ShieldCheck, FileCheck } from 'lucide-react';
import { toast } from 'react-toastify';

export default function ProgressDetailsModal({ isOpen, onClose, record }) {
  if (!isOpen || !record) return null;

  const isCompleted = record.progressPercentage === 100;

  const handleDownloadCertificate = () => {
    toast.success(`Downloading Official Certificate: ${record.certificateCode || 'CERT-LMS-2026'}`, {
      autoClose: 2500
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="teal-glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Detailed Learning Analytics</h3>
              <p className="text-xs text-emerald-200/70">Individual course completion & milestone breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Student & Course Header */}
        <div className="p-5 rounded-2xl bg-[#04121b] border border-emerald-500/25 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Learner Name</span>
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                {record.studentName}
              </h3>
            </div>
            <span className={`text-xs font-black uppercase px-3 py-1 rounded-full border ${
              isCompleted 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                : record.progressPercentage > 0 
                ? 'bg-teal-500/20 text-teal-300 border-teal-400/40' 
                : 'bg-slate-700/50 text-slate-300 border-slate-600'
            }`}>
              {record.status}
            </span>
          </div>

          <div className="border-t border-emerald-500/15 pt-3">
            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Course Enrolled</span>
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mt-0.5">
              <BookOpen className="w-4 h-4 text-teal-400" />
              {record.courseTitle}
            </h4>
          </div>
        </div>

        {/* Quick Progress KPI bar */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center">
            <div className="text-xl font-black text-emerald-300 mb-0.5">{record.progressPercentage}%</div>
            <p className="text-[10px] font-extrabold text-emerald-200/60 uppercase">Completed</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center">
            <div className="text-xl font-black text-white mb-0.5">{record.completedLessons} / {record.totalLessons}</div>
            <p className="text-[10px] font-extrabold text-emerald-200/60 uppercase">Lessons Finished</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center">
            <div className="text-xl font-black text-teal-300 mb-0.5">{record.studyHours || 0} Hours</div>
            <p className="text-[10px] font-extrabold text-emerald-200/60 uppercase">Time Dedicated</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="space-y-2 p-4 rounded-2xl bg-[#061923] border border-emerald-500/20">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-emerald-300">Course Completion Journey</span>
            <span className="text-white font-black">{record.progressPercentage}%</span>
          </div>
          <div className="w-full bg-[#04121b] h-3.5 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${
                isCompleted 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${record.progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Lessons Checklist */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">
            Lesson Checklist ({record.lessonsList ? record.lessonsList.length : 0})
          </h4>

          {!record.lessonsList || record.lessonsList.length === 0 ? (
            <div className="p-4 text-center text-xs text-emerald-200/50 bg-[#061923] rounded-2xl border border-emerald-500/20">
              Detailed lesson modules available upon progress update.
            </div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {record.lessonsList.map(lesson => (
                <div key={lesson.id} className="p-3 rounded-xl bg-[#061923] border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle className={`w-4 h-4 ${lesson.completed ? 'text-emerald-400' : 'text-slate-600'}`} />
                    <span className={`text-xs font-bold ${lesson.completed ? 'text-white' : 'text-emerald-200/50'}`}>
                      {lesson.title}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                    lesson.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {lesson.completed ? 'Passed' : 'Pending'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certificate Card */}
        {isCompleted && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-400/40 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Course Certificate Issued</h4>
                <p className="text-xs text-emerald-200/80 font-mono">{record.certificateCode || 'CERT-LMS-2026-001'}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadCertificate}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black shadow-lg transition flex items-center gap-1.5 cursor-pointer"
            >
              <FileCheck className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-emerald-500/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 emerald-btn rounded-xl text-xs font-black shadow-lg cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { X, Star, Mail, Phone, Briefcase, BookOpen, Award, CheckCircle, Calendar, UserCheck } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';

export default function InstructorDetailsModal({ isOpen, onClose, instructor }) {
  const { courses } = useCourses();

  if (!isOpen || !instructor) return null;

  // Find assigned courses
  const assignedCoursesList = courses.filter(c => instructor.assignedCourses?.includes(c.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="teal-glass-card w-full max-w-2xl p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-6 my-8">
        
        {/* Header Close */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Faculty Profile</h3>
              <p className="text-xs text-emerald-200/70">Instructor details, qualifications, and course assignments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-5 rounded-2xl bg-[#04121b] border border-emerald-500/25">
          <img
            src={instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructor.name)}`}
            alt={instructor.name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-emerald-400 shadow-xl shrink-0"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-black text-white">{instructor.name}</h2>
              <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                instructor.status === 'Active'
                  ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
              }`}>
                {instructor.status || 'Active'}
              </span>
            </div>

            <p className="text-xs font-bold text-emerald-400">{instructor.specialization}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-200/70 pt-1">
              <span className="flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-400" />
                {instructor.email}
              </span>
              {instructor.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  {instructor.phone}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-sm font-black mb-0.5">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{instructor.rating || '5.0'}</span>
            </div>
            <p className="text-[10px] font-bold text-emerald-200/60 uppercase">Faculty Rating</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center">
            <div className="text-sm font-black text-emerald-300 mb-0.5">
              {instructor.experience || 0} Yrs
            </div>
            <p className="text-[10px] font-bold text-emerald-200/60 uppercase">Experience</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center">
            <div className="text-sm font-black text-teal-300 mb-0.5">
              {assignedCoursesList.length}
            </div>
            <p className="text-[10px] font-bold text-emerald-200/60 uppercase">Courses Assigned</p>
          </div>
        </div>

        {/* Biography */}
        <div className="space-y-2">
          <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider">Biography & Overview</h4>
          <p className="text-xs text-emerald-100/80 leading-relaxed bg-[#061923] p-4 rounded-2xl border border-emerald-500/20">
            {instructor.bio || 'No biography details specified for this instructor.'}
          </p>
        </div>

        {/* Assigned Courses List */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center justify-between">
            <span>Assigned Courses ({assignedCoursesList.length})</span>
          </h4>

          {assignedCoursesList.length === 0 ? (
            <div className="p-4 rounded-2xl bg-[#061923] border border-emerald-500/20 text-center text-xs text-emerald-200/50">
              No courses assigned to this instructor yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {assignedCoursesList.map(course => (
                <div key={course.id} className="p-3 rounded-2xl bg-[#061923] border border-emerald-500/30 flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold text-white truncate">{course.title}</h5>
                    <p className="text-[10px] text-emerald-200/60">{course.category} • {course.level}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-emerald-500/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 emerald-btn rounded-xl text-xs font-black shadow-lg cursor-pointer"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
}

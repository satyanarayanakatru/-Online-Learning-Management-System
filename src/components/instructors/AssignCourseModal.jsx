import React from 'react';
import { X, BookOpen, Check, Plus, UserCheck } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';
import { toast } from 'react-toastify';

export default function AssignCourseModal({ isOpen, onClose, instructor, onAssignCourse }) {
  const { courses } = useCourses();

  if (!isOpen || !instructor) return null;

  const handleToggleCourse = async (courseId) => {
    try {
      await onAssignCourse(instructor.id, courseId);
      const isAssigned = instructor.assignedCourses?.includes(courseId);
      if (isAssigned) {
        toast.info(`Unassigned course from ${instructor.name}`, { autoClose: 1500 });
      } else {
        toast.success(`Assigned course to ${instructor.name}`, { autoClose: 1500 });
      }
    } catch (err) {
      toast.error('Failed to update course assignment');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="teal-glass-card w-full max-w-xl p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Assign Courses</h3>
              <p className="text-xs text-emerald-200/70">
                Manage assigned teaching courses for <span className="font-bold text-white">{instructor.name}</span>
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

        {/* Courses List */}
        <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
          {courses.length === 0 ? (
            <div className="p-6 text-center text-xs text-emerald-200/50 bg-[#061923] rounded-2xl border border-emerald-500/20">
              No active courses found in LMS catalog.
            </div>
          ) : (
            courses.map(course => {
              const isAssigned = instructor.assignedCourses?.includes(course.id);
              return (
                <div
                  key={course.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between space-x-4 ${
                    isAssigned
                      ? 'bg-emerald-500/15 border-emerald-400/50 text-white'
                      : 'bg-[#04121b] border-emerald-500/20 text-emerald-200/80 hover:border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className={`p-2.5 rounded-xl ${isAssigned ? 'bg-emerald-400 text-slate-950 font-black' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold truncate text-white">{course.title}</h4>
                      <p className="text-xs text-emerald-200/60 truncate">
                        {course.category} • {course.level} • {course.duration || '8 Weeks'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCourse(course.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shrink-0 ${
                      isAssigned
                        ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30'
                        : 'emerald-btn'
                    }`}
                  >
                    {isAssigned ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Assigned</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Assign</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-4 border-t border-emerald-500/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 emerald-btn rounded-xl text-xs font-black shadow-lg cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

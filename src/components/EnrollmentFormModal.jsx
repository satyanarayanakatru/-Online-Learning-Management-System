import React, { useState, useEffect } from 'react';
import { useStudents } from '../context/StudentContext';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { X, GraduationCap, BookOpen, User, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

export default function EnrollmentFormModal({ isOpen, onClose, onEnrollSuccess }) {
  const { students } = useStudents();
  const { courses } = useCourses();
  const { enrollStudent, isStudentEnrolled } = useEnrollments();

  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [enrollmentDate, setEnrollmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [duplicateWarning, setDuplicateWarning] = useState(false);

  useEffect(() => {
    if (students.length > 0 && !selectedStudentId) {
      setSelectedStudentId(students[0].id);
    }
    if (courses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(courses[0].id);
    }
  }, [students, courses, isOpen]);

  // Check duplicate whenever student or course changes
  useEffect(() => {
    if (selectedStudentId && selectedCourseId) {
      const isDup = isStudentEnrolled(selectedStudentId, selectedCourseId);
      setDuplicateWarning(isDup);
    } else {
      setDuplicateWarning(false);
    }
  }, [selectedStudentId, selectedCourseId, isStudentEnrolled]);

  if (!isOpen) return null;

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const selectedCourse = courses.find((c) => c.id === selectedCourseId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select both a student and a course.');
      return;
    }

    if (duplicateWarning) {
      toast.warn('This student is already enrolled in this course!');
      return;
    }

    try {
      enrollStudent({
        studentId: selectedStudent.id,
        studentName: selectedStudent.fullName,
        studentEmail: selectedStudent.email,
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        category: selectedCourse.category,
        instructor: selectedCourse.instructor,
        price: selectedCourse.price,
        enrollmentDate: enrollmentDate
      });
      if (onEnrollSuccess) onEnrollSuccess();
      onClose();
    } catch (err) {
      // Error handled in context toast
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-emerald-500/30 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Enroll Student into Course</h3>
              <p className="text-xs text-emerald-200/60 font-semibold">Select student & course to process registration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          
          {/* Duplicate Warning Alert */}
          {duplicateWarning && (
            <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Warning: Student is already enrolled in this course! Duplicate enrollments are prevented.</span>
            </div>
          )}

          {/* Student Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Select Student</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                {students.map((std) => (
                  <option key={std.id} value={std.id}>
                    {std.fullName} ({std.email})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course Selector */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Select Course</label>
            <div className="relative">
              <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                {courses.map((crs) => (
                  <option key={crs.id} value={crs.id}>
                    {crs.title} - ${crs.price} ({crs.category})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Selected Summary Card */}
          {selectedCourse && (
            <div className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/20 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-emerald-200/60">Course Category:</span>
                <span className="font-extrabold text-amber-300">{selectedCourse.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200/60">Instructor:</span>
                <span className="font-bold text-white">{selectedCourse.instructor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-200/60">Course Fee:</span>
                <span className="font-black text-emerald-400">${selectedCourse.price}</span>
              </div>
            </div>
          )}

          {/* Enrollment Date */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Enrollment Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
              <input
                type="date"
                required
                value={enrollmentDate}
                onChange={(e) => setEnrollmentDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Modal Footer Controls */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-emerald-500/20 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={duplicateWarning}
              className="px-5 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg disabled:opacity-40 transition cursor-pointer"
            >
              Process Enrollment
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, FileText, BookOpen, Calendar, Award, CheckCircle } from 'lucide-react';
import { useCourses } from '../../context/CourseContext';

export default function AssignmentFormModal({ isOpen, onClose, onSubmit }) {
  const { courses } = useCourses();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      courseId: courses[0]?.id || '',
      type: 'Assignment',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalPoints: 100,
      instructions: ''
    }
  });

  useEffect(() => {
    if (courses.length > 0) {
      reset({
        title: '',
        courseId: courses[0].id,
        type: 'Assignment',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalPoints: 100,
        instructions: ''
      });
    }
  }, [courses, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    const selectedCourse = courses.find(c => c.id === data.courseId);
    await onSubmit({
      ...data,
      courseTitle: selectedCourse ? selectedCourse.title : 'General Course'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="teal-glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Create Assignment / Quiz</h3>
              <p className="text-xs text-emerald-200/70">Set task details, points, and submission deadline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {/* Assignment Title */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Title / Task Name *
            </label>
            <input
              type="text"
              {...register('title', {
                required: 'Assignment title is required',
                minLength: { value: 3, message: 'Title must be at least 3 characters' }
              })}
              className={`w-full py-2.5 px-3.5 teal-input rounded-xl text-sm ${
                errors.title ? 'border-rose-500' : ''
              }`}
              placeholder="e.g. React 19 State Architecture Challenge"
            />
            {errors.title && (
              <p className="text-xs text-rose-400 font-semibold">{errors.title.message}</p>
            )}
          </div>

          {/* Course Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Associated Course *
            </label>
            <select
              {...register('courseId', { required: true })}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm bg-[#061923]"
            >
              {courses.map(course => (
                <option key={course.id} value={course.id} className="bg-[#061923] text-white">
                  {course.title} ({course.category})
                </option>
              ))}
            </select>
          </div>

          {/* Type & Points Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Assessment Type
              </label>
              <select
                {...register('type')}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                <option value="Assignment" className="bg-[#061923] text-white">Assignment Task</option>
                <option value="Quiz" className="bg-[#061923] text-white">Online Quiz</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Total Points *
              </label>
              <input
                type="number"
                min="10"
                max="500"
                {...register('totalPoints', { required: true })}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Submission Due Date *
            </label>
            <input
              type="date"
              {...register('dueDate', { required: true })}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
            />
          </div>

          {/* Instructions */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Task Instructions & Requirements
            </label>
            <textarea
              rows="3"
              {...register('instructions')}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm resize-none"
              placeholder="Provide clear instructions, reference URLs, guidelines..."
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
              <span>Create Task</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

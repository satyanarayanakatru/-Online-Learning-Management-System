import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, PlusCircle, Edit3, Image, BookOpen, User, DollarSign, Clock, Layers } from 'lucide-react';

export default function CourseFormModal({ isOpen, courseToEdit, onClose, onSubmitCourse }) {
  const isEditMode = !!courseToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      title: '',
      instructor: '',
      category: 'Web Development',
      level: 'Beginner',
      price: '',
      duration: '',
      description: '',
      thumbnail: '',
      rating: 4.8
    }
  });

  useEffect(() => {
    if (courseToEdit) {
      reset({
        title: courseToEdit.title || '',
        instructor: courseToEdit.instructor || '',
        category: courseToEdit.category || 'Web Development',
        level: courseToEdit.level || 'Beginner',
        price: courseToEdit.price || '',
        duration: courseToEdit.duration || '',
        description: courseToEdit.description || '',
        thumbnail: courseToEdit.thumbnail || '',
        rating: courseToEdit.rating || 4.8
      });
    } else {
      reset({
        title: '',
        instructor: '',
        category: 'Web Development',
        level: 'Beginner',
        price: '',
        duration: '',
        description: '',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
        rating: 4.8
      });
    }
  }, [courseToEdit, reset]);

  if (!isOpen) return null;

  const onSubmitForm = async (data) => {
    onSubmitCourse(data, courseToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-emerald-500/30 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isEditMode ? 'Edit Course Curriculum' : 'Add New Course'}
              </h3>
              <p className="text-xs text-emerald-200/60 font-semibold">
                {isEditMode ? 'Update existing course details' : 'Fill in the course details to publish'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-emerald-300 hover:text-white rounded-xl hover:bg-emerald-500/20 transition cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-1">
          
          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Course Name</label>
            <input
              type="text"
              {...register('title', { required: 'Course name is required' })}
              className={`w-full px-4 py-2.5 teal-input rounded-xl text-sm ${errors.title ? 'border-rose-500' : ''}`}
              placeholder="e.g. Full-Stack React & Node.js Masterclass"
            />
            {errors.title && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.title.message}</p>}
          </div>

          {/* Instructor & Category Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Instructor Name</label>
              <input
                type="text"
                {...register('instructor', { required: 'Instructor name is required' })}
                className={`w-full px-4 py-2.5 teal-input rounded-xl text-sm ${errors.instructor ? 'border-rose-500' : ''}`}
                placeholder="e.g. Dr. Sarah Jenkins"
              />
              {errors.instructor && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.instructor.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Category</label>
              <select
                {...register('category')}
                className="w-full px-4 py-2.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                <option value="Web Development">Web Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Backend Architecture">Backend Architecture</option>
                <option value="Data Science">Data Science</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Mobile Apps">Mobile Apps</option>
              </select>
            </div>
          </div>

          {/* Level, Price & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Course Level</label>
              <select
                {...register('level')}
                className="w-full px-4 py-2.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Price ($ USD)</label>
              <input
                type="number"
                step="0.01"
                {...register('price', { required: 'Price is required', min: 0 })}
                className={`w-full px-4 py-2.5 teal-input rounded-xl text-sm ${errors.price ? 'border-rose-500' : ''}`}
                placeholder="49.99"
              />
              {errors.price && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.price.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Duration</label>
              <input
                type="text"
                {...register('duration', { required: 'Duration is required' })}
                className={`w-full px-4 py-2.5 teal-input rounded-xl text-sm ${errors.duration ? 'border-rose-500' : ''}`}
                placeholder="8 Weeks (32 Hours)"
              />
              {errors.duration && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.duration.message}</p>}
            </div>
          </div>

          {/* Thumbnail URL */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Thumbnail Image URL</label>
            <input
              type="url"
              {...register('thumbnail', { required: 'Thumbnail URL is required' })}
              className={`w-full px-4 py-2.5 teal-input rounded-xl text-sm ${errors.thumbnail ? 'border-rose-500' : ''}`}
              placeholder="https://images.unsplash.com/..."
            />
            {errors.thumbnail && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.thumbnail.message}</p>}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Course Description</label>
            <textarea
              rows={3}
              {...register('description', { required: 'Description is required' })}
              className={`w-full px-4 py-2.5 teal-input rounded-xl text-sm ${errors.description ? 'border-rose-500' : ''}`}
              placeholder="Enter comprehensive course overview..."
            />
            {errors.description && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.description.message}</p>}
          </div>

          {/* Submit Footer */}
          <div className="flex justify-end space-x-3 pt-3 border-t border-emerald-500/20 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition"
            >
              {isEditMode ? 'Save Changes' : 'Create Course'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserCheck, Mail, Phone, Briefcase, Award, FileText, CheckCircle } from 'lucide-react';

const SPECIALIZATIONS = [
  'Computer Science',
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Mobile Development',
  'Cybersecurity',
  'Cloud Computing',
  'DevOps'
];

export default function InstructorFormModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const isEdit = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specialization: 'Computer Science',
      experience: 5,
      status: 'Active',
      bio: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        specialization: initialData.specialization || 'Computer Science',
        experience: initialData.experience || 5,
        status: initialData.status || 'Active',
        bio: initialData.bio || ''
      });
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        specialization: 'Computer Science',
        experience: 5,
        status: 'Active',
        bio: ''
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    await onSubmit({
      ...data,
      experience: Number(data.experience)
    });
    onClose();
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
              <h3 className="text-xl font-black text-white">
                {isEdit ? 'Edit Faculty Instructor' : 'Add New Faculty Instructor'}
              </h3>
              <p className="text-xs text-emerald-200/70">
                {isEdit ? 'Update instructor details and credentials' : 'Register a new instructor for LMS courses'}
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

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                {...register('name', {
                  required: 'Instructor name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' }
                })}
                className={`w-full py-2.5 px-3.5 teal-input rounded-xl text-sm ${
                  errors.name ? 'border-rose-500' : ''
                }`}
                placeholder="Dr. Robert Chen"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-rose-400 font-semibold">{errors.name.message}</p>
            )}
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`w-full py-2.5 px-3.5 teal-input rounded-xl text-sm ${
                  errors.email ? 'border-rose-500' : ''
                }`}
                placeholder="instructor@lms.edu"
              />
              {errors.email && (
                <p className="text-xs text-rose-400 font-semibold">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Phone Number
              </label>
              <input
                type="text"
                {...register('phone')}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Specialization & Experience Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Specialization *
              </label>
              <select
                {...register('specialization', { required: true })}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                {SPECIALIZATIONS.map(spec => (
                  <option key={spec} value={spec} className="bg-[#061923] text-white">
                    {spec}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Experience (Years) *
              </label>
              <input
                type="number"
                min="0"
                max="50"
                {...register('experience', { required: true, min: 0 })}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Status Select */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Faculty Status
            </label>
            <select
              {...register('status')}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm bg-[#061923]"
            >
              <option value="Active" className="bg-[#061923] text-white">Active (Teaching)</option>
              <option value="On Leave" className="bg-[#061923] text-white">On Leave</option>
              <option value="Inactive" className="bg-[#061923] text-white">Inactive</option>
            </select>
          </div>

          {/* Bio / Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Faculty Biography & Qualifications
            </label>
            <textarea
              rows="3"
              {...register('bio')}
              className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm resize-none"
              placeholder="Brief biography, research focus, degrees..."
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
              <span>{isEdit ? 'Save Changes' : 'Create Instructor'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

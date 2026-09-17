import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, UserPlus, Edit3, User, Mail, Phone, MapPin, GraduationCap, Calendar } from 'lucide-react';

export default function StudentFormModal({ isOpen, studentToEdit, onClose, onSubmitStudent }) {
  const isEditMode = !!studentToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      mobile: '',
      address: '',
      qualification: "Bachelor's Degree",
      enrollmentDate: new Date().toISOString().split('T')[0]
    }
  });

  useEffect(() => {
    if (studentToEdit) {
      reset({
        fullName: studentToEdit.fullName || '',
        email: studentToEdit.email || '',
        mobile: studentToEdit.mobile || '',
        address: studentToEdit.address || '',
        qualification: studentToEdit.qualification || "Bachelor's Degree",
        enrollmentDate: studentToEdit.enrollmentDate || new Date().toISOString().split('T')[0]
      });
    } else {
      reset({
        fullName: '',
        email: '',
        mobile: '',
        address: '',
        qualification: "Bachelor's Degree",
        enrollmentDate: new Date().toISOString().split('T')[0]
      });
    }
  }, [studentToEdit, reset]);

  if (!isOpen) return null;

  const onSubmitForm = (data) => {
    onSubmitStudent(data, studentToEdit?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="teal-glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative border border-emerald-500/30 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              {isEditMode ? <Edit3 className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-xl font-black text-white">
                {isEditMode ? 'Edit Student Profile' : 'Register New Student'}
              </h3>
              <p className="text-xs text-emerald-200/60 font-semibold">
                {isEditMode ? 'Update student contact & qualification info' : 'Enter student details for LMS enrollment'}
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
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
              <input
                type="text"
                {...register('fullName', { 
                  required: 'Full name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' } 
                })}
                className={`w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm ${errors.fullName ? 'border-rose-500' : ''}`}
                placeholder="e.g. Alex Johnson"
              />
            </div>
            {errors.fullName && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.fullName.message}</p>}
          </div>

          {/* Email & Mobile Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format'
                    }
                  })}
                  className={`w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm ${errors.email ? 'border-rose-500' : ''}`}
                  placeholder="alex@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                <input
                  type="text"
                  {...register('mobile', { required: 'Mobile number is required' })}
                  className={`w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm ${errors.mobile ? 'border-rose-500' : ''}`}
                  placeholder="+1 555-0192"
                />
              </div>
              {errors.mobile && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.mobile.message}</p>}
            </div>
          </div>

          {/* Qualification & Enrollment Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Highest Qualification</label>
              <select
                {...register('qualification')}
                className="w-full px-4 py-2.5 teal-input rounded-xl text-sm bg-[#061923]"
              >
                <option value="High School">High School</option>
                <option value="Diploma">Diploma</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Enrollment Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                <input
                  type="date"
                  {...register('enrollmentDate', { required: 'Enrollment date is required' })}
                  className={`w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm ${errors.enrollmentDate ? 'border-rose-500' : ''}`}
                />
              </div>
              {errors.enrollmentDate && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.enrollmentDate.message}</p>}
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-200 uppercase tracking-wider">Contact Address</label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-3 text-emerald-400/60" />
              <textarea
                rows={2}
                {...register('address', { required: 'Address is required' })}
                className={`w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-sm ${errors.address ? 'border-rose-500' : ''}`}
                placeholder="Full residential or mailing address..."
              />
            </div>
            {errors.address && <p className="text-xs text-rose-400 font-semibold pl-1">{errors.address.message}</p>}
          </div>

          {/* Footer Submit Controls */}
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
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition cursor-pointer"
            >
              {isEditMode ? 'Save Student Updates' : 'Register Student'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

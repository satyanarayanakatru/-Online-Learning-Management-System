import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, TrendingUp, BookOpen, Clock, CheckCircle } from 'lucide-react';

export default function UpdateProgressModal({ isOpen, onClose, record, onUpdate }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      completedLessons: 0,
      totalLessons: 10,
      studyHours: 0
    }
  });

  const completedVal = watch('completedLessons') || 0;
  const totalVal = watch('totalLessons') || 1;
  const calcPercent = Math.min(100, Math.round((Number(completedVal) / Number(totalVal || 1)) * 100));

  useEffect(() => {
    if (record) {
      reset({
        completedLessons: record.completedLessons || 0,
        totalLessons: record.totalLessons || 15,
        studyHours: record.studyHours || 0
      });
    }
  }, [record, reset, isOpen]);

  if (!isOpen || !record) return null;

  const handleFormSubmit = async (data) => {
    await onUpdate(record.id, data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="teal-glass-card w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-emerald-500/30 shadow-2xl relative space-y-6 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Update Learning Progress</h3>
              <p className="text-xs text-emerald-200/70">
                Track lesson completions for <span className="font-bold text-white">{record.studentName}</span>
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

        {/* Course Banner Info */}
        <div className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/25 flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{record.courseTitle}</h4>
            <p className="text-xs text-emerald-200/60">Current Progress: <span className="font-extrabold text-emerald-300">{calcPercent}%</span></p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          
          {/* Completed Lessons & Total Lessons Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Completed Lessons *
              </label>
              <input
                type="number"
                min="0"
                max={totalVal}
                {...register('completedLessons', { 
                  required: true,
                  min: 0
                })}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Total Course Lessons *
              </label>
              <input
                type="number"
                min="1"
                {...register('totalLessons', { required: true, min: 1 })}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Study Hours */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
              Total Study Hours Logged
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                {...register('studyHours')}
                className="w-full py-2.5 px-3.5 teal-input rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Visual Bar Preview */}
          <div className="space-y-2 p-4 rounded-2xl bg-[#061923] border border-emerald-500/20">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-emerald-300">Progress Preview</span>
              <span className="text-white font-black">{calcPercent}%</span>
            </div>
            <div className="w-full bg-[#04121b] h-3 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  calcPercent === 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : calcPercent > 0 
                    ? 'bg-emerald-500' 
                    : 'bg-slate-700'
                }`}
                style={{ width: `${calcPercent}%` }}
              />
            </div>
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
              <span>Save Progress</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

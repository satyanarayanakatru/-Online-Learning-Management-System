import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      newPassword: ''
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      resetPassword(data.email, data.newPassword);
      toast.success('Password updated successfully! You can now log in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Failed to reset password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#061923] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-2 shadow-lg shadow-emerald-500/20">
            <KeyRound className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Reset Your Password
          </h2>
          <p className="text-emerald-200/70 text-sm">
            Enter your registered email and set a new password
          </p>
        </div>

        {/* Form Card */}
        <div className="teal-glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Registered Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/60">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address format'
                    }
                  })}
                  className={`block w-full pl-11 pr-4 py-3 teal-input rounded-xl text-sm ${
                    errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 font-semibold pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/60">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full pl-11 pr-11 py-3 teal-input rounded-xl text-sm ${
                    errors.newPassword ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/60 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-rose-400 font-semibold pl-1">{errors.newPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 emerald-btn rounded-xl font-black text-sm shadow-xl disabled:opacity-50 transition cursor-pointer"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-4.5 h-4.5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </form>

          {/* Back to Sign In */}
          <div className="text-center pt-2 border-t border-emerald-500/20">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-300 hover:text-white transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sign In</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Shield, ShieldCheck } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  const passwordVal = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const newUser = registerAuth({
        name: data.name,
        email: data.email,
        password: data.password
      });
      toast.success(`Admin account created! Welcome, ${newUser.name}. 🎉`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#061923] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Ambient Glow */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-2 shadow-lg shadow-emerald-500/20">
            <Shield className="w-9 h-9 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Register Admin Account
          </h2>
          <p className="text-emerald-200/70 text-sm">
            Create an administrator account for the LMS Portal
          </p>
        </div>

        {/* Form Card */}
        <div className="teal-glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5">
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/60">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: { value: 2, message: 'Name must be at least 2 characters' }
                  })}
                  className={`block w-full pl-11 pr-4 py-3 teal-input rounded-xl text-sm ${
                    errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="Admin Name"
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 font-semibold pl-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Admin Email Address
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
                  placeholder="admin@lms.com"
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 font-semibold pl-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/60">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`block w-full pl-11 pr-11 py-3 teal-input rounded-xl text-sm ${
                    errors.password ? 'border-rose-500 focus:border-rose-500' : ''
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
              {errors.password && (
                <p className="text-xs text-rose-400 font-semibold pl-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-400/60">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (val) => val === passwordVal || 'Passwords do not match'
                  })}
                  className={`block w-full pl-11 pr-11 py-3 teal-input rounded-xl text-sm ${
                    errors.confirmPassword ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-emerald-400/60 hover:text-white transition"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-rose-400 font-semibold pl-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 emerald-btn rounded-xl font-black text-sm shadow-xl disabled:opacity-50 transition cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4.5 h-4.5" />
                  <span>Register Admin Account</span>
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-emerald-500/20">
            <p className="text-xs text-emerald-200/60">
              Already registered?{' '}
              <Link to="/login" className="font-extrabold text-emerald-400 hover:text-amber-400 transition">
                Sign in here
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

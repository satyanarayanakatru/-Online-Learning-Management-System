import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, Zap, ArrowRight, BookOpen, Users, GraduationCap, UserCheck } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'Student'
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const loggedUser = login(data.email, data.password);
      toast.success(`Welcome back, ${loggedUser.name}! (${loggedUser.role || selectedRole}) 👋`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillAdminDemo = () => {
    setSelectedRole('Admin');
    setValue('email', 'admin@lms.com', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    toast.info('Filled Admin credentials: admin@lms.com', { autoClose: 1500 });
  };

  const fillStudentDemo = () => {
    setSelectedRole('Student');
    setValue('email', 'student@lms.com', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    toast.info('Filled Student credentials: student@lms.com', { autoClose: 1500 });
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#061923] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      {/* 2-Column Split Hero Layout Container */}
      <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Visual Hero Banner with Image */}
        <div className="lg:col-span-6 space-y-6 hidden lg:block">
          
          <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl group">
            {/* High Resolution Hero Image */}
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1000&q=80" 
              alt="Online LMS Portal" 
              className="w-full h-[540px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061923] via-[#061923]/70 to-transparent" />

            {/* Content Overlays */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                  {selectedRole === 'Admin' ? (
                    <><Shield className="w-4 h-4 text-emerald-400" /> Admin Portal v2.0</>
                  ) : (
                    <><GraduationCap className="w-4 h-4 text-emerald-400" /> Student Portal v2.0</>
                  )}
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white leading-tight">
                  Empower Education with Next-Gen LMS Platform
                </h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-semibold">
                  Manage courses, track student enrollments, faculty schedules, and interactive learning analytics in real-time.
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#061923]/80 backdrop-blur-md border border-emerald-500/30 flex items-center space-x-2.5">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs font-bold text-white">Course Management</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#061923]/80 backdrop-blur-md border border-emerald-500/30 flex items-center space-x-2.5">
                    <Users className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-white">Student Enrollment</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Form Login Card */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Header */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-1 shadow-lg shadow-emerald-500/20">
              {selectedRole === 'Admin' ? (
                <Shield className="w-8 h-8 text-emerald-400" />
              ) : (
                <GraduationCap className="w-8 h-8 text-emerald-400" />
              )}
            </div>
            <h2 className="text-3xl font-black tracking-tight text-white">
              Welcome Back to LMS
            </h2>
            <p className="text-emerald-200/70 text-sm">
              Sign in to your account to continue
            </p>
          </div>

          {/* Form Card */}
          <div className="teal-glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 border border-emerald-500/30">
            
            {/* Role Selection Toggle Pills */}
            <div className="space-y-2">
              <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">
                Select Account Role
              </label>
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#04121b] border border-emerald-500/30 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setSelectedRole('Admin')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                    selectedRole === 'Admin'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'text-emerald-200/70 hover:text-white hover:bg-emerald-500/10'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('Student')}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-black transition cursor-pointer ${
                    selectedRole === 'Student'
                      ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                      : 'text-emerald-200/70 hover:text-white hover:bg-emerald-500/10'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                </button>
              </div>
            </div>

            {/* Quick Demo Credentials Fill Buttons */}
            <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo Accounts
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                  {selectedRole} Role Active
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={fillAdminDemo}
                  className="py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-xl text-[11px] font-extrabold text-emerald-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Admin Demo</span>
                </button>
                <button
                  type="button"
                  onClick={fillStudentDemo}
                  className="py-2 px-3 bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/40 rounded-xl text-[11px] font-extrabold text-teal-200 hover:text-white transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-teal-400" />
                  <span>Student Demo</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              
              {/* Email Field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  Email Address ({selectedRole})
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
                    placeholder={selectedRole === 'Admin' ? "admin@lms.com" : "student@lms.com"}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-400 font-semibold pl-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs font-bold text-emerald-400 hover:text-amber-400 transition"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                    <LogIn className="w-4.5 h-4.5" />
                    <span>Sign In as {selectedRole}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Footer Link */}
            <div className="text-center pt-2 border-t border-emerald-500/20">
              <p className="text-xs text-emerald-200/60">
                Don't have an account?{' '}
                <Link to="/register" className="font-extrabold text-emerald-400 hover:text-amber-400 transition">
                  Create an Account
                </Link>
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

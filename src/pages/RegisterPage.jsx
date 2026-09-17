import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Shield, GraduationCap, ArrowRight, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'Student'
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
        password: data.password,
        role: selectedRole
      });
      toast.success(`${selectedRole} account created! Welcome, ${newUser.name}. 🎉`);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
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
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&q=80" 
              alt="Join Online LMS Platform" 
              className="w-full h-[580px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#061923] via-[#061923]/70 to-transparent" />

            {/* Content Overlays */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/30 backdrop-blur-md border border-emerald-400/40 text-emerald-200 text-xs font-black px-3.5 py-1.5 rounded-full shadow-lg">
                  {selectedRole === 'Admin' ? (
                    <><Shield className="w-4 h-4 text-emerald-400" /> Admin Registration</>
                  ) : (
                    <><GraduationCap className="w-4 h-4 text-emerald-400" /> Student Registration</>
                  )}
                </span>
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl font-black text-white leading-tight">
                  Join Thousands of Educators & Learners Worldwide
                </h2>
                <p className="text-xs text-emerald-100/80 leading-relaxed font-semibold">
                  Create your free LMS account to access full course administration, student tracking, assignments, and faculty management.
                </p>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-2xl bg-[#061923]/80 backdrop-blur-md border border-emerald-500/30 flex items-center space-x-2.5">
                    <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span className="text-xs font-bold text-white">Certified Courses</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#061923]/80 backdrop-blur-md border border-emerald-500/30 flex items-center space-x-2.5">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
                    <span className="text-xs font-bold text-white">Instant Access</span>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Form Register Card */}
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
              Create an Account
            </h2>
            <p className="text-emerald-200/70 text-sm">
              Register as an Administrator or Student to get started
            </p>
          </div>

          {/* Form Card */}
          <div className="teal-glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5 border border-emerald-500/30">
            
            {/* Role Selection Toggle Pills */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">
                Select Your Role
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
                    className={`block w-full pl-11 pr-4 py-2.5 teal-input rounded-xl text-sm ${
                      errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    placeholder={selectedRole === 'Admin' ? "Admin Director" : "Alex Johnson"}
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-rose-400 font-semibold pl-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                  Email Address
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
                    className={`block w-full pl-11 pr-4 py-2.5 teal-input rounded-xl text-sm ${
                      errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    placeholder={selectedRole === 'Admin' ? "newadmin@lms.com" : "newstudent@lms.com"}
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
                    className={`block w-full pl-11 pr-11 py-2.5 teal-input rounded-xl text-sm ${
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
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      validate: (val) => val === passwordVal || 'Passwords do not match'
                    })}
                    className={`block w-full pl-11 pr-11 py-2.5 teal-input rounded-xl text-sm ${
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
                    <span>Register {selectedRole} Account</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
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
    </div>
  );
}

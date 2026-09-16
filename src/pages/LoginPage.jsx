import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Mail, Lock, Eye, EyeOff, LogIn, Shield, Zap, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      toast.success(`Welcome back, ${loggedUser.name}! 👋`);
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setValue('email', 'admin@lms.com', { shouldValidate: true });
    setValue('password', 'password123', { shouldValidate: true });
    toast.info('Filled Admin credentials: admin@lms.com', { autoClose: 1500 });
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#061923] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-2 shadow-lg shadow-emerald-500/20">
            <Shield className="w-9 h-9 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white">
            Admin Portal Login
          </h2>
          <p className="text-emerald-200/70 text-sm">
            Sign in to manage courses, students, and instructors
          </p>
        </div>

        {/* Form Card */}
        <div className="teal-glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
          
          {/* Quick Admin Demo Fill Button */}
          <div className="p-3.5 rounded-2xl bg-[#04121b] border border-emerald-500/25 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Demo Credentials
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">Admin Role</span>
            </div>
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2.5 px-3.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 rounded-xl text-xs font-extrabold text-emerald-200 hover:text-white transition flex items-center justify-between"
            >
              <span>admin@lms.com / password123</span>
              <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded uppercase">Auto Fill</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Email Field */}
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
                    required: 'Admin email is required',
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
                  <span>Sign In to Admin Portal</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center pt-2 border-t border-emerald-500/20">
            <p className="text-xs text-emerald-200/60">
              Need an admin account?{' '}
              <Link to="/register" className="font-extrabold text-emerald-400 hover:text-amber-400 transition">
                Register Admin Account
              </Link>
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

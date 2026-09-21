import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap, ShieldCheck, UserCheck, RefreshCw, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';

export default function Navbar() {
  const { user, isAuthenticated, logout, switchRole } = useAuth();
  const navigate = useNavigate();

  const isStudent = user?.role?.toLowerCase() === 'student';

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleToggleRole = () => {
    const nextRole = isStudent ? 'Admin' : 'Student';
    switchRole(nextRole);
    toast.info(`Switched to ${nextRole} Portal!`, { autoClose: 1500 });
  };

  return (
    <header className="sticky top-0 z-50 teal-glass-panel border-b border-emerald-500/20 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center space-x-3.5 group">
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
              <GraduationCap className="w-6.5 h-6.5 text-slate-950" />
            </div>
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              EduPortal 
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-widest border ${
                isStudent
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              }`}>
                {isStudent ? 'Student Portal' : 'Admin Portal'}
              </span>
            </span>
            <span className="text-[11px] block font-semibold text-emerald-400/80 tracking-wider uppercase">
              Online Learning Management System
            </span>
          </div>
        </Link>

        {/* User Controls */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Quick Role Toggle Button */}
            <button
              onClick={handleToggleRole}
              className="py-1.5 px-3 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 border border-amber-400/30 text-xs font-black transition flex items-center gap-1.5 cursor-pointer"
              title="Switch between Admin and Student Portals"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">Switch to {isStudent ? 'Admin Console' : 'Student Portal'}</span>
            </button>

            {/* User Info Badge */}
            <div className="hidden sm:flex items-center space-x-3 teal-glass-card px-4 py-1.5 rounded-full border border-emerald-500/20">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-md ${
                isStudent ? 'bg-teal-400 text-slate-950' : 'bg-emerald-500 text-slate-950'
              }`}>
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="text-left pr-1">
                <p className="text-xs font-extrabold text-emerald-100 flex items-center gap-1">
                  {user?.name}
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1 text-amber-400">
                  {isStudent ? (
                    <><GraduationCap className="w-3 h-3 inline text-teal-400" /> Student</>
                  ) : (
                    <><ShieldCheck className="w-3 h-3 inline text-emerald-400" /> Admin</>
                  )}
                </p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3.5 py-2 text-xs font-extrabold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-600 rounded-xl border border-rose-500/30 transition-all duration-200 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>

          </div>
        ) : (
          <div className="flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-bold text-emerald-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-sm font-extrabold emerald-btn rounded-xl shadow-lg transition"
            >
              Create Account
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}

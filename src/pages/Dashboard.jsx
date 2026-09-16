import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Shield, CheckCircle2, BookOpen, Sparkles, Activity, ShieldCheck, ArrowUpRight, Award } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-[#061923] py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-teal-900 to-slate-950 p-6 sm:p-10 border border-emerald-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin LMS Portal Active</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Welcome back, <span className="gradient-mint-text">{user?.name}</span>
              </h1>
              <p className="text-emerald-100/80 text-sm sm:text-base max-w-2xl leading-relaxed">
                You are logged in with <span className="text-amber-400 font-extrabold">{user?.role || 'Admin'}</span> administrator permissions. Your session is securely stored in LocalStorage.
              </p>
            </div>

            {/* Admin Session Badge */}
            <div className="teal-glass-card p-4 rounded-2xl border border-emerald-500/30 flex items-center space-x-3.5 min-w-[220px]">
              <div className="w-12 h-12 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] text-emerald-300/70 font-bold uppercase tracking-wider">Admin ID</p>
                <p className="text-xs font-mono text-emerald-300 font-semibold">{user?.id}</p>
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-0.5">
                  <CheckCircle2 className="w-3 h-3" /> Active Admin Session
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Admin Profile */}
          <div className="teal-glass-card p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center space-x-3 text-emerald-400">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                  <User className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="font-extrabold text-white text-base">Admin Profile</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">Module 1</span>
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-emerald-500/10">
                <span className="text-emerald-200/70">Administrator Name</span>
                <span className="font-extrabold text-white">{user?.name}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-500/10">
                <span className="text-emerald-200/70">Email Address</span>
                <span className="font-extrabold text-white">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-emerald-200/70">Access Level</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {user?.role || 'Admin'}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Security & State */}
          <div className="teal-glass-card p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center space-x-3 text-teal-400">
                <div className="p-2.5 rounded-xl bg-teal-500/15 border border-teal-500/30">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                </div>
                <h3 className="font-extrabold text-white text-base">Portal Security</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">Module 1</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between py-1.5 border-b border-emerald-500/10">
                <span className="text-emerald-200/70">Session Guard</span>
                <span className="font-extrabold text-emerald-400">Protected Admin Routes</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-emerald-500/10">
                <span className="text-emerald-200/70">Persistence</span>
                <span className="font-extrabold text-white">LocalStorage API</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-emerald-200/70">Validation</span>
                <span className="font-extrabold text-emerald-300">React Hook Form</span>
              </div>
            </div>
          </div>

          {/* Card 3: LMS Roadmap */}
          <div className="teal-glass-card p-6 rounded-3xl space-y-5">
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
              <div className="flex items-center space-x-3 text-amber-400">
                <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30">
                  <Activity className="w-5 h-5 text-amber-400" />
                </div>
                <h3 className="font-extrabold text-white text-base">Module Roadmap</h3>
              </div>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold">1/9 Done</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold">
                <span>Module 1: Authentication</span>
                <span className="bg-emerald-400 text-slate-950 px-2 py-0.5 rounded-full text-[10px] font-black">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#04121b] border border-emerald-500/20 text-emerald-200/60">
                <span>Module 2: Admin Dashboard UI</span>
                <span className="text-[10px] text-amber-400 font-bold">Next Up</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#04121b] border border-emerald-500/20 text-emerald-200/40">
                <span>Module 3: Course Management</span>
                <span className="text-[10px]">Pending</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

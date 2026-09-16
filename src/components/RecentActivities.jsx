import React from 'react';
import { Activity, User, BookOpen, GraduationCap, CheckCircle2 } from 'lucide-react';

export default function RecentActivities({ activities }) {
  return (
    <div className="teal-glass-card p-6 rounded-3xl space-y-5">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Recent Activity Stream</h3>
            <p className="text-[11px] text-emerald-200/60 font-semibold">Real-time LMS system actions</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
          Live Updates
        </span>
      </div>

      <div className="space-y-4">
        {activities.map((act) => (
          <div key={act.id} className="flex items-start space-x-3.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black flex items-center justify-center text-xs shadow-md shrink-0 group-hover:scale-105 transition-transform">
              {act.avatar}
            </div>
            <div className="flex-1 min-w-0 pb-3 border-b border-emerald-500/10">
              <p className="text-xs text-white leading-relaxed font-semibold">
                <span className="font-extrabold text-emerald-300">{act.user}</span>{' '}
                <span className="text-emerald-200/80 font-normal">{act.action}</span>{' '}
                <span className="font-bold text-amber-300">{act.target}</span>
              </p>
              <div className="flex items-center justify-between mt-1 text-[10px] text-emerald-200/60">
                <span className="font-mono">{act.time}</span>
                <span className="uppercase tracking-widest font-extrabold text-emerald-400">
                  {act.type}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

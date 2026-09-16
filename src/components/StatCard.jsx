import React from 'react';
import { ArrowUpRight, TrendingUp } from 'lucide-react';

export default function StatCard({ title, value, growth, icon: Icon, subtext, color = 'emerald' }) {
  return (
    <div className="teal-glass-card p-5 rounded-3xl space-y-3 relative overflow-hidden group">
      
      {/* Decorative Accent Blur */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all duration-300" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-emerald-200/70 uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
          <Icon className="w-5 h-5 text-emerald-400" />
        </div>
      </div>

      <div className="flex items-baseline justify-between pt-1">
        <h3 className="text-3xl font-black text-white tracking-tight">
          {value}
        </h3>
        <span className="inline-flex items-center gap-0.5 text-xs font-black text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
          <TrendingUp className="w-3 h-3" />
          {growth}
        </span>
      </div>

      <p className="text-[11px] font-semibold text-emerald-300/60 pt-1 border-t border-emerald-500/10">
        {subtext}
      </p>
    </div>
  );
}

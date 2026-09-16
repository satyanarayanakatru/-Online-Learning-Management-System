import React from 'react';
import { Calendar, Clock, Video, UserCheck, ArrowRight } from 'lucide-react';

export default function UpcomingClasses({ classes }) {
  return (
    <div className="teal-glass-card p-6 rounded-3xl space-y-5">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Calendar className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Upcoming Live Classes</h3>
            <p className="text-[11px] text-emerald-200/60 font-semibold">Scheduled sessions for today & this week</p>
          </div>
        </div>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30">
          {classes.length} Sessions
        </span>
      </div>

      <div className="space-y-3.5">
        {classes.map((item) => (
          <div 
            key={item.id} 
            className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/30">
                  {item.courseName}
                </span>
                <h4 className="text-sm font-extrabold text-white mt-1.5 leading-snug">
                  {item.subject}
                </h4>
              </div>
              <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                item.status === 'Starting Soon' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' 
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {item.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-emerald-200/70 pt-1 gap-2 border-t border-emerald-500/10">
              <div className="flex items-center space-x-3">
                <span className="flex items-center gap-1 font-semibold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {item.instructor}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  {item.date}, {item.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-medium text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px]">{item.room}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

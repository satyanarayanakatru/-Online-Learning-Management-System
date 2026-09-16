import React from 'react';
import { PlusCircle, UserPlus, UserCheck, Megaphone, Zap } from 'lucide-react';

export default function QuickActionCards({ onOpenModal }) {
  const actions = [
    {
      id: 'add-course',
      title: 'Add New Course',
      desc: 'Create and publish a new course curriculum',
      icon: PlusCircle,
      badge: 'Course Mgmt'
    },
    {
      id: 'register-student',
      title: 'Register Student',
      desc: 'Enrol a new student into the LMS platform',
      icon: UserPlus,
      badge: 'Student Mgmt'
    },
    {
      id: 'add-instructor',
      title: 'Add Instructor',
      desc: 'Add a new faculty member & assign courses',
      icon: UserCheck,
      badge: 'Faculty'
    },
    {
      id: 'announcement',
      title: 'Post Announcement',
      desc: 'Broadcast quick update to students & staff',
      icon: Megaphone,
      badge: 'System Notice'
    }
  ];

  return (
    <div className="teal-glass-card p-6 rounded-3xl space-y-5">
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
        <div className="flex items-center space-x-3 text-emerald-400">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <Zap className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base">Quick Action Controls</h3>
            <p className="text-[11px] text-emerald-200/60 font-semibold">Fast administrative workflows</p>
          </div>
        </div>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 font-black px-2.5 py-1 rounded-full border border-amber-500/40">
          Admin Actions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => onOpenModal(act)}
              className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all text-left space-y-3 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-400 group-hover:bg-emerald-400 group-hover:text-slate-950 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {act.badge}
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm group-hover:text-emerald-300 transition-colors">
                  {act.title}
                </h4>
                <p className="text-[11px] text-emerald-200/60 font-semibold mt-1 leading-snug">
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserCheck, 
  GraduationCap, 
  TrendingUp, 
  FileText, 
  BarChart3, 
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';

export default function Sidebar({ isOpen, setIsOpen, isCollapsed, setIsCollapsed }) {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: 'Active' },
    { name: 'Courses', path: '/courses', icon: BookOpen, badge: 'Mod 3' },
    { name: 'Students', path: '/students', icon: Users, badge: 'Mod 4' },
    { name: 'Instructors', path: '/instructors', icon: UserCheck, badge: 'Mod 6' },
    { name: 'Enrollments', path: '/enrollments', icon: GraduationCap, badge: 'Mod 5' },
    { name: 'Learning Progress', path: '/progress', icon: TrendingUp, badge: 'Mod 7' },
    { name: 'Assignments', path: '/assignments', icon: FileText, badge: 'Mod 8' },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3, badge: 'Mod 9' },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Drawer Container */}
      <aside className={`fixed lg:static top-0 left-0 z-50 h-screen teal-glass-panel border-r border-emerald-500/20 flex flex-col transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
        
        {/* Sidebar Header */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-emerald-500/20">
          <div className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-xl flex items-center justify-center text-slate-950 font-black shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-base font-black text-white tracking-tight">Admin Console</span>
                <span className="text-[10px] block text-emerald-400 font-bold uppercase tracking-widest">LMS Portal</span>
              </div>
            )}
          </div>

          {/* Close button for Mobile */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-emerald-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `flex items-center justify-between px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-emerald-200/60 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Icon className="w-5 h-5 shrink-0 text-emerald-400" />
                  {!isCollapsed && (
                    <span className="truncate tracking-wide">{item.name}</span>
                  )}
                </div>
                {!isCollapsed && (
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#04121b] text-emerald-400 border border-emerald-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Collapse Toggle Footer */}
        <div className="hidden lg:flex p-3 border-t border-emerald-500/20">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#04121b] hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 transition-all text-xs font-bold gap-2"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <>
                <ChevronLeft className="w-5 h-5" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>

      </aside>
    </>
  );
}

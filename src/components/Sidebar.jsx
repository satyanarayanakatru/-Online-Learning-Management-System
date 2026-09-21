import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  const { user } = useAuth();
  const isStudent = user?.role?.toLowerCase() === 'student';

  const adminNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Courses', path: '/courses', icon: BookOpen },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Instructors', path: '/instructors', icon: UserCheck },
    { name: 'Enrollments', path: '/enrollments', icon: GraduationCap },
    { name: 'Learning Progress', path: '/progress', icon: TrendingUp },
    { name: 'Assignments & Quizzes', path: '/assignments', icon: FileText },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  ];

  const studentNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Browse Courses', path: '/courses', icon: BookOpen },
    { name: 'My Enrolled Courses', path: '/enrollments', icon: GraduationCap },
    { name: 'Faculty Instructors', path: '/instructors', icon: UserCheck },
    { name: 'My Learning Progress', path: '/progress', icon: TrendingUp },
    { name: 'Assignments & Quizzes', path: '/assignments', icon: FileText },
  ];

  const navItems = isStudent ? studentNavItems : adminNavItems;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)} 
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sticky/Fixed Height Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 z-40 h-screen teal-glass-panel border-r border-emerald-500/20 flex flex-col shrink-0 transition-all duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64`}>
        
        {/* Sidebar Header */}
        <div className="h-18 px-4 flex items-center justify-between border-b border-emerald-500/20 shrink-0">
          <div className={`flex items-center space-x-3 overflow-hidden ${isCollapsed ? 'lg:justify-center lg:w-full' : ''}`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black shadow-md shrink-0 ${
              isStudent 
                ? 'bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950' 
                : 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950'
            }`}>
              {isStudent ? <GraduationCap className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-base font-black text-white tracking-tight block truncate">
                  {isStudent ? 'Student Portal' : 'Admin Console'}
                </span>
                <span className="text-[10px] block text-emerald-400 font-bold uppercase tracking-widest">
                  {isStudent ? 'Learner Workspace' : 'LMS Management'}
                </span>
              </div>
            )}
          </div>

          {/* Mobile Close */}
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-emerald-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => `flex items-center space-x-3 px-3.5 py-3 rounded-xl font-bold text-xs transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-500/10'
                    : 'text-emerald-200/60 hover:text-white hover:bg-emerald-500/10 hover:border-emerald-500/20 border border-transparent'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="w-5 h-5 shrink-0 text-emerald-400" />
                {!isCollapsed && (
                  <span className="truncate tracking-wide">{item.name}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Collapse Toggle Footer */}
        <div className="hidden lg:flex p-3 border-t border-emerald-500/20 shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full flex items-center justify-center p-2.5 rounded-xl bg-[#04121b] hover:bg-emerald-500/15 border border-emerald-500/25 text-emerald-300 transition-all text-xs font-bold gap-2 cursor-pointer"
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

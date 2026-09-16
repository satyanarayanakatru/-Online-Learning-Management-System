import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import StatCard from '../components/StatCard';
import QuickActionCards from '../components/QuickActionCards';
import QuickActionModal from '../components/QuickActionModal';
import UpcomingClasses from '../components/UpcomingClasses';
import RecentActivities from '../components/RecentActivities';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { 
  INITIAL_DASHBOARD_STATS, 
  INITIAL_ENROLLED_COURSES, 
  INITIAL_UPCOMING_CLASSES, 
  INITIAL_RECENT_ACTIVITIES 
} from '../mock/dashboardData';
import { 
  BookOpen, 
  Users, 
  UserCheck, 
  GraduationCap, 
  Menu, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Layers
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function Dashboard() {
  const { user } = useAuth();
  
  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dashboard Data State
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [courses, setCourses] = useState(INITIAL_ENROLLED_COURSES);
  const [upcomingClasses, setUpcomingClasses] = useState(INITIAL_UPCOMING_CLASSES);
  const [recentActivities, setRecentActivities] = useState(INITIAL_RECENT_ACTIVITIES);

  // Modal State
  const [activeModalAction, setActiveModalAction] = useState(null);

  useEffect(() => {
    // Simulate initial data loading delay for skeleton loader
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleQuickActionSuccess = (actionId, data) => {
    if (actionId === 'add-course' && data.title) {
      const newCourse = {
        id: `crs-${Date.now()}`,
        title: data.title,
        instructor: user?.name || 'Admin Instructor',
        category: data.category || 'General',
        enrolledStudents: 1,
        progress: 10,
        status: 'In Progress',
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80'
      };
      setCourses([newCourse, ...courses]);
      setStats(prev => ({ ...prev, totalCourses: prev.totalCourses + 1 }));
    } else if (actionId === 'register-student') {
      setStats(prev => ({ ...prev, totalStudents: prev.totalStudents + 1 }));
    } else if (actionId === 'add-instructor') {
      setStats(prev => ({ ...prev, totalInstructors: prev.totalInstructors + 1 }));
    }

    // Add activity log
    const newAct = {
      id: `act-${Date.now()}`,
      user: user?.name || 'Admin User',
      avatar: user?.name?.charAt(0) || 'A',
      action: 'executed quick action',
      target: data.title || data.name || 'LMS Platform',
      time: 'Just now',
      type: 'admin'
    };
    setRecentActivities([newAct, ...recentActivities]);
  };

  return (
    <div className="min-h-screen bg-[#061923] flex text-f0fdf4">
      
      {/* Responsive Collapsible Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Dashboard Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header Bar for Mobile Sidebar Toggle & Page Title */}
        <header className="h-18 px-4 sm:px-6 lg:px-8 teal-glass-panel border-b border-emerald-500/20 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Admin Dashboard Overview
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                Real-time LMS metrics, course progress, live classes & activity logs
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin: {user?.name}</span>
            </span>
          </div>
        </header>

        {/* Dashboard Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* 1. Quick Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="Total Courses" 
                  value={stats.totalCourses} 
                  growth={stats.courseGrowth}
                  icon={BookOpen}
                  subtext="Published curricula"
                />
                <StatCard 
                  title="Total Students" 
                  value={stats.totalStudents} 
                  growth={stats.studentGrowth}
                  icon={Users}
                  subtext="Registered active learners"
                />
                <StatCard 
                  title="Total Instructors" 
                  value={stats.totalInstructors} 
                  growth={stats.instructorGrowth}
                  icon={UserCheck}
                  subtext="Faculty members"
                />
                <StatCard 
                  title="Active Enrollments" 
                  value={stats.activeEnrollments} 
                  growth={stats.enrollmentGrowth}
                  icon={GraduationCap}
                  subtext="Course registrations"
                />
              </div>

              {/* 2. Quick Action Cards Component */}
              <QuickActionCards onOpenModal={(action) => setActiveModalAction(action)} />

              {/* 3. Enrolled & Completed Courses Progress Grid */}
              <div className="teal-glass-card p-6 rounded-3xl space-y-5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                      <Layers className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base">Course Progress Monitor</h3>
                      <p className="text-[11px] text-emerald-200/60 font-semibold">Enrolled & completed course completion statuses</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2.5 py-1 rounded-full border border-emerald-500/30">
                    {courses.length} Active Courses
                  </span>
                </div>

                {courses.length === 0 ? (
                  <EmptyState 
                    title="No Courses Found" 
                    message="Get started by creating your first course using the Quick Actions bar."
                    onAction={() => setActiveModalAction({ id: 'add-course', title: 'Add New Course', desc: 'Create course curriculum', badge: 'Course Mgmt' })}
                    actionLabel="Add First Course"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.map((crs) => (
                      <div key={crs.id} className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/20 hover:border-emerald-500/40 transition-all space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={crs.thumbnail} 
                              alt={crs.title} 
                              className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30 shrink-0" 
                            />
                            <div>
                              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">{crs.category}</span>
                              <h4 className="text-sm font-extrabold text-white leading-snug line-clamp-1">{crs.title}</h4>
                              <p className="text-[11px] text-emerald-200/60 font-semibold">{crs.instructor}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 ${
                            crs.status === 'Completed' 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}>
                            {crs.status}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold text-emerald-200/80">
                            <span>Completion</span>
                            <span className="font-mono text-emerald-400">{crs.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${crs.progress}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 4. Upcoming Classes & Recent Activity Stream Split Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingClasses classes={upcomingClasses} />
                <RecentActivities activities={recentActivities} />
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Quick Action Interactive Modal Dialog */}
      <QuickActionModal 
        action={activeModalAction} 
        onClose={() => setActiveModalAction(null)} 
        onSuccess={handleQuickActionSuccess}
      />

    </div>
  );
}

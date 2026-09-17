import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { useStudents } from '../context/StudentContext';
import { useEnrollments } from '../context/EnrollmentContext';
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
  Layers,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const { courses, loading: coursesLoading, addCourse } = useCourses();
  const { students, loading: studentsLoading, addStudent } = useStudents();
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  
  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mock static stats for instructors (to be bound in Module 6)
  const [stats, setStats] = useState(INITIAL_DASHBOARD_STATS);
  const [upcomingClasses] = useState(INITIAL_UPCOMING_CLASSES);
  const [recentActivities, setRecentActivities] = useState(INITIAL_RECENT_ACTIVITIES);

  // Modal State
  const [activeModalAction, setActiveModalAction] = useState(null);

  const handleQuickActionSuccess = (actionId, data) => {
    if (actionId === 'add-course' && data.title) {
      addCourse({
        title: data.title,
        instructor: user?.name || 'Admin Instructor',
        category: data.category || 'Web Development',
        level: 'Beginner',
        price: 49.99,
        duration: '8 Weeks (32 Hours)',
        description: 'New course created from Admin Quick Actions.',
        rating: 4.9,
        thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80'
      });
    } else if (actionId === 'register-student' && data.name) {
      addStudent({
        fullName: data.name,
        email: data.email || 'student@example.com',
        mobile: '+1 555-0100',
        address: 'Main Campus, LMS Portal',
        qualification: "Bachelor's Degree",
        enrollmentDate: new Date().toISOString().split('T')[0]
      });
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

  const isLoading = coursesLoading || studentsLoading || enrollmentsLoading;

  return (
    <div className="min-h-screen bg-[#061923] flex text-[#f0fdf4]">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Dashboard Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Header */}
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
                Real-time LMS metrics, dynamic Course, Student & Enrollment Contexts
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

        {/* Dashboard Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8">
          
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* 1. Enhanced High-Res Image Hero Welcome Banner */}
              <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 shadow-2xl group min-h-[220px]">
                {/* Hero Image */}
                <img 
                  src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&q=80" 
                  alt="LMS Education Dashboard" 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {/* Gradient Blur Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#061923] via-[#061923]/90 to-[#061923]/70" />

                {/* Hero Content Overlay */}
                <div className="relative z-10 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-extrabold px-3.5 py-1 rounded-full shadow-lg backdrop-blur-md">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Admin Control Panel v2.0 Active</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                      Welcome back, <span className="gradient-mint-text">{user?.name}</span>
                    </h1>
                    <p className="text-emerald-100/90 text-xs sm:text-sm max-w-2xl leading-relaxed font-semibold">
                      You have full administrator access to course curricula, student directory, registrations, and learning analytics.
                    </p>
                  </div>

                  {/* Admin Session Badge */}
                  <div className="teal-glass-card p-4 rounded-2xl border border-emerald-500/40 flex items-center space-x-3.5 min-w-[220px] backdrop-blur-md">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-black text-xl shadow-lg">
                      {user?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300/70 font-bold uppercase tracking-wider">Admin ID</p>
                      <p className="text-xs font-mono text-emerald-300 font-semibold">{user?.id}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold mt-0.5">
                        ✓ Active Session
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Dynamic Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="Total Courses" 
                  value={courses.length} 
                  growth={stats.courseGrowth}
                  icon={BookOpen}
                  subtext="Live Global Course Context"
                />
                <StatCard 
                  title="Total Students" 
                  value={students.length} 
                  growth={stats.studentGrowth}
                  icon={Users}
                  subtext="Live Global Student Context"
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
                  value={enrollments.length} 
                  growth={stats.enrollmentGrowth}
                  icon={GraduationCap}
                  subtext="Live Global Enrollment Context"
                />
              </div>

              {/* 3. Quick Action Control Panel */}
              <QuickActionCards onOpenModal={(action) => setActiveModalAction(action)} />

              {/* 4. Real-Time Courses Progress Grid from CourseContext */}
              <div className="teal-glass-card p-6 rounded-3xl space-y-5">
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                  <div className="flex items-center space-x-3 text-emerald-400">
                    <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
                      <Layers className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base">Course Progress Monitor</h3>
                      <p className="text-[11px] text-emerald-200/60 font-semibold">Live courses synced via global CourseContext</p>
                    </div>
                  </div>
                  <Link 
                    to="/courses"
                    className="text-xs font-bold text-emerald-400 hover:text-amber-400 flex items-center gap-1 transition"
                  >
                    <span>View All Courses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {courses.length === 0 ? (
                  <EmptyState 
                    title="No Courses Available" 
                    message="Use Quick Actions to create your first course!"
                    onAction={() => setActiveModalAction({ id: 'add-course', title: 'Add New Course', desc: 'Create course curriculum', badge: 'Course Mgmt' })}
                    actionLabel="Add First Course"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {courses.slice(0, 4).map((crs) => (
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
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            ${crs.price}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex justify-between text-xs font-bold text-emerald-200/80">
                            <span>Level: {crs.level}</span>
                            <span className="font-mono text-emerald-400">Rating: {crs.rating} ⭐</span>
                          </div>
                          <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-emerald-500/20">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500" 
                              style={{ width: `${Math.min(crs.rating * 20, 100)}%` }} 
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 5. Upcoming Classes & Recent Activity Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <UpcomingClasses classes={upcomingClasses} />
                <RecentActivities activities={recentActivities} />
              </div>

            </div>
          )}

        </main>
      </div>

      {/* Quick Action Modal */}
      <QuickActionModal 
        action={activeModalAction} 
        onClose={() => setActiveModalAction(null)} 
        onSuccess={handleQuickActionSuccess}
      />

    </div>
  );
}

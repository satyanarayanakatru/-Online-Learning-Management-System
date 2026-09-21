import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { useStudents } from '../context/StudentContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { useInstructors } from '../context/InstructorContext';
import { useProgress } from '../context/ProgressContext';
import { useAssignments } from '../context/AssignmentContext';
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
  ShieldCheck,
  TrendingUp,
  Clock,
  Award,
  FileText,
  CheckCircle,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const isStudent = user?.role?.toLowerCase() === 'student';

  const { courses, loading: coursesLoading, addCourse } = useCourses();
  const { students, loading: studentsLoading, addStudent } = useStudents();
  const { enrollments, loading: enrollmentsLoading } = useEnrollments();
  const { instructors, loading: instructorsLoading } = useInstructors();
  const { progressRecords } = useProgress();
  const { assignments } = useAssignments();
  
  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Stats
  const [stats] = useState(INITIAL_DASHBOARD_STATS);
  const [upcomingClasses] = useState(INITIAL_UPCOMING_CLASSES);
  const [recentActivities, setRecentActivities] = useState(INITIAL_RECENT_ACTIVITIES);

  // Modal State
  const [activeModalAction, setActiveModalAction] = useState(null);

  // Student specific data calculations
  const myStudentId = user?.id || 'std-api-1';

  const myEnrollments = useMemo(() => {
    return enrollments.filter(e => String(e.studentId) === String(myStudentId));
  }, [enrollments, myStudentId]);

  const myProgressList = useMemo(() => {
    return myEnrollments.map(enr => {
      const stored = progressRecords.find(p => String(p.studentId) === String(enr.studentId) && String(p.courseId) === String(enr.courseId));
      const matchedCourse = courses.find(c => String(c.id) === String(enr.courseId));
      const percent = stored ? stored.progressPercentage : 0;
      return {
        id: enr.id,
        courseId: enr.courseId,
        courseTitle: matchedCourse?.title || enr.courseTitle,
        category: matchedCourse?.category || enr.category,
        instructor: matchedCourse?.instructor || enr.instructor,
        progressPercentage: percent,
        completedLessons: stored ? stored.completedLessons : 0,
        totalLessons: stored ? stored.totalLessons : 15,
        studyHours: stored ? stored.studyHours : 0,
        certificateIssued: percent === 100
      };
    });
  }, [myEnrollments, progressRecords, courses]);

  const studentCompletedCount = myProgressList.filter(p => p.progressPercentage === 100).length;
  const studentTotalHours = myProgressList.reduce((acc, curr) => acc + (curr.studyHours || 0), 0);
  const studentAvgPercent = myProgressList.length > 0 
    ? Math.round(myProgressList.reduce((acc, curr) => acc + curr.progressPercentage, 0) / myProgressList.length)
    : 0;

  // Student upcoming assignments
  const myAssignments = useMemo(() => {
    const myCourseIds = myEnrollments.map(e => String(e.courseId));
    if (myCourseIds.length === 0) return assignments;
    return assignments.filter(a => myCourseIds.includes(String(a.courseId)));
  }, [myEnrollments, assignments]);

  const isLoading = coursesLoading || studentsLoading || enrollmentsLoading || instructorsLoading;

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
                {isStudent ? 'Student Dashboard' : 'Admin Dashboard Overview'}
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                {isStudent 
                  ? `Welcome back, ${user?.name || 'Learner'}! Track enrolled courses, learning progress & tasks.`
                  : 'Real-time LMS metrics, dynamic Course, Student, Instructor & Enrollment Contexts'}
              </p>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* High Impact Visual Hero Banner */}
            <div className="relative rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl p-6 sm:p-8 bg-gradient-to-r from-[#04121b] via-[#061923] to-[#04121b]">
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-3 text-center md:text-left max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-black">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isStudent ? 'Student Portal' : 'LMS Management Platform'}</span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {isStudent 
                      ? `Welcome to Your Learning Workspace, ${user?.name || 'Learner'}!` 
                      : 'Empower Education with Real-Time Course Analytics'}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-200/70 font-semibold leading-relaxed">
                    {isStudent 
                      ? 'Access your enrolled courses, complete module lessons, submit coursework, and earn official certificates.' 
                      : 'Manage active courses, faculty instructors, student enrollments, and live learning progress.'}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <Link
                      to={isStudent ? "/courses" : "/courses"}
                      className="emerald-btn px-5 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center space-x-2 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>{isStudent ? 'Browse All Courses' : 'Manage Courses'}</span>
                    </Link>
                    <Link
                      to="/progress"
                      className="px-5 py-2.5 rounded-xl border border-emerald-500/30 text-emerald-200 hover:text-white hover:bg-emerald-500/10 text-xs font-bold transition flex items-center space-x-2"
                    >
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>{isStudent ? 'My Progress' : 'Learning Progress'}</span>
                    </Link>
                  </div>
                </div>

                <div className="shrink-0 hidden md:block">
                  <img
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80"
                    alt="LMS Hero"
                    className="w-56 h-36 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
                  />
                </div>
              </div>
            </div>

            {/* Dynamic Stats Grid */}
            {isStudent ? (
              
              /* STUDENT STATS GRID */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <StatCard 
                  title="My Enrolled Courses" 
                  value={myEnrollments.length} 
                  growth={100}
                  icon={GraduationCap}
                  subtext="Active Learning Enrollments"
                />
                <StatCard 
                  title="Completed Courses" 
                  value={studentCompletedCount} 
                  growth={studentCompletedCount > 0 ? 100 : 0}
                  icon={CheckCircle}
                  subtext="100% Passed Courses"
                />
                <StatCard 
                  title="Avg Progress" 
                  value={`${studentAvgPercent}%`} 
                  growth={studentAvgPercent}
                  icon={TrendingUp}
                  subtext="Overall Completion Rate"
                />
                <StatCard 
                  title="Study Hours Logged" 
                  value={`${studentTotalHours} Hrs`} 
                  growth={studentTotalHours > 0 ? 100 : 0}
                  icon={Clock}
                  subtext="Time Dedicated to Study"
                />
              </div>

            ) : (

              /* ADMIN STATS GRID */
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
                  value={instructors.length} 
                  growth={stats.instructorGrowth}
                  icon={UserCheck}
                  subtext="Live Global Instructor Context"
                />
                <StatCard 
                  title="Active Enrollments" 
                  value={enrollments.length} 
                  growth={stats.enrollmentGrowth}
                  icon={GraduationCap}
                  subtext="Live Global Enrollment Context"
                />
              </div>

            )}

            {/* Student View Specific: My Courses Progress Grid */}
            {isStudent ? (
              <div className="space-y-6">
                
                <div className="teal-glass-card p-6 rounded-3xl space-y-5">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <GraduationCap className="w-6 h-6" />
                      <div>
                        <h3 className="text-lg font-black text-white">My Enrolled Courses & Real-Time Progress</h3>
                        <p className="text-xs text-emerald-200/60 font-semibold">Track your course module completions and study hours</p>
                      </div>
                    </div>
                    <Link to="/progress" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                      <span>View All Progress</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {myProgressList.length === 0 ? (
                    <EmptyState 
                      title="You Are Not Enrolled in Any Courses Yet"
                      description="Explore our course catalog and enroll into courses to start learning."
                      onAction={() => {}}
                      actionText="Browse Course Catalog"
                    />
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myProgressList.map(item => (
                        <div key={item.id} className="p-5 rounded-2xl bg-[#04121b] border border-emerald-500/30 flex flex-col justify-between space-y-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">{item.category}</span>
                            <h4 className="text-base font-black text-white leading-snug">{item.courseTitle}</h4>
                            <p className="text-xs text-emerald-200/60">Instructor: {item.instructor}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold">
                              <span className="text-emerald-300">Lessons Completed</span>
                              <span className="text-white">{item.completedLessons} / {item.totalLessons} ({item.progressPercentage}%)</span>
                            </div>
                            <div className="w-full bg-[#061923] h-3 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
                              <div 
                                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${item.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-emerald-500/15">
                            <Link
                              to="/progress"
                              className="w-full py-2 emerald-btn rounded-xl text-xs font-black text-center flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Continue Learning</span>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* My Assignments & Tasks Section */}
                <div className="teal-glass-card p-6 rounded-3xl space-y-5">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                    <div className="flex items-center space-x-3 text-teal-400">
                      <FileText className="w-6 h-6" />
                      <div>
                        <h3 className="text-lg font-black text-white">Upcoming Coursework & Tasks</h3>
                        <p className="text-xs text-emerald-200/60 font-semibold">Submit coursework assignments and online quizzes</p>
                      </div>
                    </div>
                    <Link to="/assignments" className="text-xs font-bold text-teal-400 hover:underline flex items-center gap-1">
                      <span>View All Tasks</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myAssignments.slice(0, 2).map(asg => (
                      <div key={asg.id} className="p-4 rounded-2xl bg-[#04121b] border border-emerald-500/30 flex justify-between items-center space-x-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <span className="text-[10px] font-bold text-amber-400 uppercase">{asg.type} • {asg.totalPoints} Points</span>
                          <h4 className="text-xs font-bold text-white truncate">{asg.title}</h4>
                          <p className="text-[11px] text-emerald-200/60 truncate">Due: {asg.dueDate}</p>
                        </div>
                        <Link
                          to="/assignments"
                          className="px-3 py-1.5 emerald-btn rounded-xl text-xs font-black shrink-0"
                        >
                          Submit
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (

              /* ADMIN VIEW EXTRA PANELS */
              <>
                <QuickActionCards onOpenModal={(action) => setActiveModalAction(action)} />

                <div className="teal-glass-card p-6 rounded-3xl space-y-5">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
                    <div className="flex items-center space-x-3 text-emerald-400">
                      <BookOpen className="w-6 h-6" />
                      <div>
                        <h3 className="text-lg font-black text-white">Live Courses Catalog</h3>
                        <p className="text-xs text-emerald-200/60 font-semibold">Active courses available across all learning categories</p>
                      </div>
                    </div>
                    <Link to="/courses" className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
                      <span>View All Courses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.slice(0, 3).map((course) => (
                      <div key={course.id} className="teal-glass-panel p-5 rounded-2xl border border-emerald-500/30 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                            {course.category}
                          </span>
                          <h4 className="font-extrabold text-white text-base leading-snug">{course.title}</h4>
                          <p className="text-xs text-emerald-200/60">Instructor: {course.instructor}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-emerald-500/15 text-xs font-bold">
                          <span className="text-emerald-300">${course.price}</span>
                          <span className="text-emerald-400">{course.level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>

            )}

          </div>
        </main>
      </div>

    </div>
  );
}

import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Menu, TrendingUp, Search, Filter, RefreshCw, Award, 
  BookOpen, User, CheckCircle, Clock, Edit3, Eye, FileCheck, ShieldCheck, Grid, List 
} from 'lucide-react';
import { useProgress } from '../context/ProgressContext';
import { useStudents } from '../context/StudentContext';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import UpdateProgressModal from '../components/progress/UpdateProgressModal';
import ProgressDetailsModal from '../components/progress/ProgressDetailsModal';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const STATUS_FILTERS = ['All', 'In Progress', 'Completed', 'Not Started'];

export default function LearningProgress() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const { 
    progressRecords, 
    loading, 
    searchQuery, 
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    updateProgress,
    createProgressRecord,
    refreshProgress 
  } = useProgress();

  const { enrollments } = useEnrollments();
  const { students } = useStudents();
  const { courses } = useCourses();

  // Dynamically compute progress records EXCLUSIVELY for active enrolled students
  const enrolledProgressRecords = React.useMemo(() => {
    return enrollments.map((enr) => {
      // Find stored progress details if available
      const stored = progressRecords.find(
        (p) => String(p.studentId) === String(enr.studentId) && String(p.courseId) === String(enr.courseId)
      );
      const matchedStudent = students.find((s) => String(s.id) === String(enr.studentId));
      const matchedCourse = courses.find((c) => String(c.id) === String(enr.courseId));

      const completedLessons = stored ? stored.completedLessons : 0;
      const totalLessons = stored ? stored.totalLessons : 15;
      const progressPercentage = stored 
        ? stored.progressPercentage 
        : Math.round((completedLessons / totalLessons) * 100);
      
      let status = 'In Progress';
      if (progressPercentage === 100) status = 'Completed';
      else if (progressPercentage === 0) status = 'Not Started';

      return {
        id: stored?.id || `prg-enr-${enr.id}`,
        enrollmentId: enr.id,
        studentId: enr.studentId,
        studentName: matchedStudent ? matchedStudent.fullName : enr.studentName,
        studentEmail: matchedStudent ? matchedStudent.email : enr.studentEmail,
        courseId: enr.courseId,
        courseTitle: matchedCourse ? matchedCourse.title : enr.courseTitle,
        category: matchedCourse ? matchedCourse.category : enr.category,
        completedLessons,
        totalLessons,
        progressPercentage,
        status,
        studyHours: stored ? stored.studyHours : 0,
        certificateIssued: stored ? stored.certificateIssued : (progressPercentage === 100),
        certificateCode: stored ? stored.certificateCode : null,
        lessonsList: stored?.lessonsList || []
      };
    });
  }, [enrollments, progressRecords, students, courses]);

  // Filtered progress
  const filteredProgress = React.useMemo(() => {
    return enrolledProgressRecords.filter((record) => {
      const matchesSearch = 
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        selectedStatus === 'All' || 
        record.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [enrolledProgressRecords, searchQuery, selectedStatus]);

  // Modals state
  const [selectedRecordForUpdate, setSelectedRecordForUpdate] = useState(null);
  const [selectedRecordForDetails, setSelectedRecordForDetails] = useState(null);

  // Statistics calculations
  const totalLearners = enrolledProgressRecords.length;
  const completedCoursesCount = enrolledProgressRecords.filter(p => p.progressPercentage === 100).length;
  const certificatesIssuedCount = enrolledProgressRecords.filter(p => p.certificateIssued).length;
  const avgProgressPercentage = totalLearners > 0
    ? Math.round(enrolledProgressRecords.reduce((acc, curr) => acc + (curr.progressPercentage || 0), 0) / totalLearners)
    : 0;

  const handleUpdateSubmit = async (id, data) => {
    try {
      const targetRecord = enrolledProgressRecords.find(r => r.id === id);
      let targetId = id;
      if (id.startsWith('prg-enr-') && targetRecord) {
        const created = await createProgressRecord(
          targetRecord.studentId,
          targetRecord.studentName,
          targetRecord.courseId,
          targetRecord.courseTitle,
          data.totalLessons || 15
        );
        targetId = created.id;
      }

      const updated = await updateProgress(targetId, data);
      toast.success(`Updated learning progress for ${targetRecord?.studentName || updated.studentName}! (${updated.progressPercentage}%) 🎉`);
    } catch (err) {
      toast.error(err.message || 'Failed to update progress');
    }
  };

  return (
    <div className="min-h-screen bg-[#061923] flex text-[#f0fdf4]">
      
      {/* Sticky Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Navbar */}
        <header className="h-18 px-4 sm:px-6 lg:px-8 teal-glass-panel border-b border-emerald-500/20 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-emerald-300 hover:text-white bg-emerald-500/10 hover:bg-emerald-500/20 transition cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Learning Progress</h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                Module 7: Student Course Completion Percentages, Lessons & Certifications
              </p>
            </div>
          </div>

          <button
            onClick={refreshProgress}
            className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition cursor-pointer"
            title="Refresh Progress Records"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Main Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Active Learners</p>
                <h3 className="text-2xl font-black text-white">{totalLearners}</h3>
              </div>
            </div>

            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Completed Courses</p>
                <h3 className="text-2xl font-black text-white">{completedCoursesCount}</h3>
              </div>
            </div>

            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Avg Completion</p>
                <h3 className="text-2xl font-black text-white">{avgProgressPercentage}%</h3>
              </div>
            </div>

            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Certificates Issued</p>
                <h3 className="text-2xl font-black text-white">{certificatesIssuedCount}</h3>
              </div>
            </div>

          </div>

          {/* Search, Filter & Layout Control Bar */}
          <div className="teal-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by student name or course..."
                className="w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-xs"
              />
            </div>

            {/* Status Filter & View Toggle */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="py-2.5 px-3 teal-input rounded-xl text-xs bg-[#061923]"
                >
                  {STATUS_FILTERS.map(status => (
                    <option key={status} value={status} className="bg-[#061923] text-white">
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Switcher */}
              <div className="flex items-center p-1 bg-[#04121b] border border-emerald-500/30 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    viewMode === 'grid' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-emerald-300 hover:text-white'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-lg transition cursor-pointer ${
                    viewMode === 'table' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-emerald-300 hover:text-white'
                  }`}
                  title="Table View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>

            </div>

          </div>

          {/* Loading & Empty States */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : filteredProgress.length === 0 ? (
            <EmptyState 
              title="No Learning Progress Records Found"
              description="No progress tracking entries match your selected filters."
              onAction={() => {
                setSearchQuery('');
                setSelectedStatus('All');
              }}
              actionText="Reset Progress Filters"
            />
          ) : viewMode === 'grid' ? (
            
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProgress.map(record => {
                const percent = record.progressPercentage || 0;
                const isCompleted = percent === 100;

                return (
                  <div 
                    key={record.id}
                    className="teal-glass-card rounded-3xl p-6 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 min-w-0 pr-2">
                        <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                          Student Learner
                        </span>
                        <h3 className="text-base font-black text-white truncate group-hover:text-emerald-300 transition">
                          {record.studentName}
                        </h3>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border shrink-0 ${
                        isCompleted 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                          : percent > 0 
                          ? 'bg-teal-500/20 text-teal-300 border-teal-400/40' 
                          : 'bg-slate-700/50 text-slate-300 border-slate-600'
                      }`}>
                        {record.status}
                      </span>
                    </div>

                    {/* Course Title */}
                    <div className="p-3 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center space-x-3">
                      <BookOpen className="w-5 h-5 text-teal-400 shrink-0" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{record.courseTitle}</h4>
                        <p className="text-[10px] text-emerald-200/60">
                          {record.completedLessons} of {record.totalLessons} Lessons
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Percentage */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="text-emerald-200/70">Completion Progress</span>
                        <span className="text-white font-black">{percent}%</span>
                      </div>
                      <div className="w-full bg-[#04121b] h-3 rounded-full overflow-hidden p-0.5 border border-emerald-500/30">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted 
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-400' 
                              : percent > 0 
                              ? 'bg-emerald-500' 
                              : 'bg-slate-700'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats summary */}
                    <div className="flex items-center justify-between text-[11px] text-emerald-200/60 pt-2 border-t border-emerald-500/15">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-emerald-400" />
                        {record.studyHours || 0} Study Hrs
                      </span>
                      {record.certificateIssued && (
                        <span className="flex items-center gap-1 text-amber-400 font-extrabold">
                          <Award className="w-3.5 h-3.5" />
                          Certified
                        </span>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20">
                      <button
                        onClick={() => setSelectedRecordForDetails(record)}
                        className="py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Analytics</span>
                      </button>

                      <button
                        onClick={() => setSelectedRecordForUpdate(record)}
                        className="py-2 px-3 rounded-xl emerald-btn text-xs font-black shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update Progress</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

          ) : (

            /* Table View */
            <div className="teal-glass-card rounded-3xl overflow-hidden border border-emerald-500/30">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#04121b] border-b border-emerald-500/30 text-emerald-300 uppercase font-black tracking-wider text-[11px]">
                      <th className="p-4">Student</th>
                      <th className="p-4">Course Enrolled</th>
                      <th className="p-4">Progress %</th>
                      <th className="p-4">Lessons</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/15 text-emerald-100">
                    {filteredProgress.map(record => {
                      const percent = record.progressPercentage || 0;
                      return (
                        <tr key={record.id} className="hover:bg-emerald-500/5 transition">
                          <td className="p-4 font-bold text-white">{record.studentName}</td>
                          <td className="p-4 font-semibold text-emerald-300">{record.courseTitle}</td>
                          <td className="p-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-24 bg-[#04121b] h-2.5 rounded-full overflow-hidden border border-emerald-500/30">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="font-extrabold text-white">{percent}%</span>
                            </div>
                          </td>
                          <td className="p-4 font-bold">{record.completedLessons} / {record.totalLessons}</td>
                          <td className="p-4">
                            <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                              percent === 100 
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                                : percent > 0 
                                ? 'bg-teal-500/20 text-teal-300 border-teal-400/40' 
                                : 'bg-slate-700/50 text-slate-300 border-slate-600'
                            }`}>
                              {record.status}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center space-x-2">
                              <button
                                onClick={() => setSelectedRecordForDetails(record)}
                                className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setSelectedRecordForUpdate(record)}
                                className="p-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 transition cursor-pointer"
                                title="Update Progress"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          )}

        </main>
      </div>

      {/* Modals */}
      <UpdateProgressModal
        isOpen={!!selectedRecordForUpdate}
        onClose={() => setSelectedRecordForUpdate(null)}
        record={selectedRecordForUpdate}
        onUpdate={handleUpdateSubmit}
      />

      <ProgressDetailsModal
        isOpen={!!selectedRecordForDetails}
        onClose={() => setSelectedRecordForDetails(null)}
        record={selectedRecordForDetails}
      />

    </div>
  );
}

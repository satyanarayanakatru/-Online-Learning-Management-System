import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { useStudents } from '../context/StudentContext';
import { useCourses } from '../context/CourseContext';
import Sidebar from '../components/Sidebar';
import EnrollmentFormModal from '../components/EnrollmentFormModal';
import RemoveEnrollmentConfirmModal from '../components/RemoveEnrollmentConfirmModal';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Search, 
  GraduationCap, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  BookOpen, 
  Users, 
  DollarSign,
  Calendar,
  Sparkles,
  PlusCircle
} from 'lucide-react';

export default function EnrollmentManagement() {
  const { user } = useAuth();
  const { enrollments, loading, removeEnrollment } = useEnrollments();
  const { students } = useStudents();
  const { courses } = useCourses();

  // Dynamically resolve real-time student details & course info
  const resolvedEnrollments = useMemo(() => {
    return enrollments.map((enr) => {
      const matchedStudent = students.find((s) => s.id === enr.studentId);
      const matchedCourse = courses.find((c) => c.id === enr.courseId);
      return {
        ...enr,
        studentName: matchedStudent ? matchedStudent.fullName : enr.studentName,
        studentEmail: matchedStudent ? matchedStudent.email : enr.studentEmail,
        courseTitle: matchedCourse ? matchedCourse.title : enr.courseTitle,
        category: matchedCourse ? matchedCourse.category : enr.category,
        instructor: matchedCourse ? matchedCourse.instructor : enr.instructor
      };
    });
  }, [enrollments, students, courses]);

  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Search & Filter Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-newest');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [enrollmentToRemove, setEnrollmentToRemove] = useState(null);

  // Enrollment Summary Metrics
  const metrics = useMemo(() => {
    const totalCount = resolvedEnrollments.length;
    const uniqueStudents = new Set(resolvedEnrollments.map((e) => e.studentId)).size;
    const uniqueCourses = new Set(resolvedEnrollments.map((e) => e.courseId)).size;
    const totalRevenue = resolvedEnrollments.reduce((sum, e) => sum + Number(e.price || 0), 0);

    return { totalCount, uniqueStudents, uniqueCourses, totalRevenue };
  }, [resolvedEnrollments]);

  // Filter & Sort Logic
  const filteredAndSortedEnrollments = useMemo(() => {
    return resolvedEnrollments
      .filter((e) => {
        const matchesSearch = 
          e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = selectedCategory === 'All' || e.category === selectedCategory;
        return matchesSearch && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'date-newest') return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
        if (sortBy === 'date-oldest') return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
        if (sortBy === 'fee-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'fee-low') return Number(a.price) - Number(b.price);
        return 0;
      });
  }, [resolvedEnrollments, searchQuery, selectedCategory, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredAndSortedEnrollments.length / itemsPerPage) || 1;
  const paginatedEnrollments = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedEnrollments.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedEnrollments, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#061923] flex text-[#f0fdf4]">
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Header Bar */}
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
                Course Enrollment Console
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                Enroll students, manage active course registrations, prevent duplicates & track revenue
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEnrollModalOpen(true)}
            className="px-4 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Enroll Student</span>
          </button>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* 1. Enrollment Summary Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="teal-glass-card p-4 rounded-3xl border border-emerald-500/20 flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <GraduationCap className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-wider block">Active Enrollments</span>
                  <span className="text-2xl font-black text-white">{metrics.totalCount}</span>
                </div>
              </div>

              <div className="teal-glass-card p-4 rounded-3xl border border-emerald-500/20 flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-teal-500/15 text-teal-400">
                  <Users className="w-6 h-6 text-teal-400" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-wider block">Enrolled Students</span>
                  <span className="text-2xl font-black text-white">{metrics.uniqueStudents}</span>
                </div>
              </div>

              <div className="teal-glass-card p-4 rounded-3xl border border-emerald-500/20 flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-400">
                  <BookOpen className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-wider block">Active Courses</span>
                  <span className="text-2xl font-black text-white">{metrics.uniqueCourses}</span>
                </div>
              </div>

              <div className="teal-glass-card p-4 rounded-3xl border border-emerald-500/20 flex items-center space-x-3">
                <div className="p-3 rounded-2xl bg-emerald-500/15 text-emerald-400">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200/60 font-bold uppercase tracking-wider block">Enrollment Fees</span>
                  <span className="text-2xl font-black text-emerald-400">${metrics.totalRevenue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* 2. Control Toolbar */}
            <div className="teal-glass-panel p-4 rounded-3xl space-y-4 shadow-xl border border-emerald-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student or course name..."
                    className="w-full pl-10 pr-3 py-2.5 teal-input rounded-xl text-xs font-semibold"
                  />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="All">All Categories</option>
                    <option value="Web Development">Web Development</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Backend Architecture">Backend Architecture</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Cyber Security">Cyber Security</option>
                    <option value="Mobile Apps">Mobile Apps</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="date-newest">Sort: Enrollment Date (Newest)</option>
                    <option value="date-oldest">Sort: Enrollment Date (Oldest)</option>
                    <option value="fee-high">Sort: Course Fee (Highest)</option>
                    <option value="fee-low">Sort: Course Fee (Lowest)</option>
                  </select>
                </div>

              </div>

              {/* Counter */}
              <div className="flex items-center justify-between text-xs text-emerald-200/70 pt-2 border-t border-emerald-500/10">
                <span className="font-semibold">
                  Showing <strong className="text-white">{filteredAndSortedEnrollments.length}</strong> active enrollment(s)
                </span>
                {(searchQuery || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* 3. Enrollments Table / Empty State */}
            {loading ? (
              <SkeletonLoader />
            ) : paginatedEnrollments.length === 0 ? (
              <EmptyState 
                title="No Enrollments Found" 
                message="Enroll a student into a course using the 'Enroll Student' action button." 
                onAction={() => setIsEnrollModalOpen(true)}
                actionLabel="Enroll Student Now"
              />
            ) : (
              <div className="space-y-4">
                
                {/* Desktop Data Table */}
                <div className="teal-glass-panel rounded-3xl overflow-hidden border border-emerald-500/20 shadow-xl hidden md:block">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#04121b] text-emerald-300 font-extrabold uppercase border-b border-emerald-500/20">
                        <tr>
                          <th className="py-4 px-6">Student</th>
                          <th className="py-4 px-6">Enrolled Course</th>
                          <th className="py-4 px-6">Instructor</th>
                          <th className="py-4 px-6">Enrollment Date</th>
                          <th className="py-4 px-6">Course Fee</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-500/10 text-emerald-100/90 font-semibold">
                        {paginatedEnrollments.map((enr) => (
                          <tr key={enr.id} className="hover:bg-emerald-500/10 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                                  {enr.studentName?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-white text-sm">{enr.studentName}</p>
                                  <p className="text-[10px] text-emerald-400/80 font-mono">{enr.studentEmail}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div>
                                <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                                  {enr.category}
                                </span>
                                <p className="font-extrabold text-white text-sm leading-snug">{enr.courseTitle}</p>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-emerald-200">
                              {enr.instructor}
                            </td>
                            <td className="py-4 px-6 font-mono text-emerald-300">
                              {enr.enrollmentDate}
                            </td>
                            <td className="py-4 px-6 font-black text-emerald-400 text-sm">
                              ${Number(enr.price || 0).toFixed(2)}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => setEnrollmentToRemove(enr)}
                                className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                                title="Remove Enrollment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards Layout */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedEnrollments.map((enr) => (
                    <div key={enr.id} className="teal-glass-card p-5 rounded-3xl space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider">{enr.category}</span>
                          <h4 className="font-extrabold text-white text-base leading-snug">{enr.courseTitle}</h4>
                        </div>
                        <span className="text-sm font-black text-emerald-400 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40">
                          ${enr.price}
                        </span>
                      </div>

                      <div className="space-y-1 text-xs text-emerald-200/80 pt-2 border-t border-emerald-500/10">
                        <p><strong className="text-white">Student:</strong> {enr.studentName} ({enr.studentEmail})</p>
                        <p><strong className="text-white">Instructor:</strong> {enr.instructor}</p>
                        <p><strong className="text-white">Enrolled On:</strong> {enr.enrollmentDate}</p>
                      </div>

                      <div className="flex justify-end pt-2 border-t border-emerald-500/10">
                        <button
                          onClick={() => setEnrollmentToRemove(enr)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 text-xs font-bold border border-rose-500/30 flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove Enrollment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Pagination Bar */}
            {!loading && filteredAndSortedEnrollments.length > itemsPerPage && (
              <div className="teal-glass-panel p-4 rounded-3xl flex items-center justify-between shadow-xl border border-emerald-500/20">
                <span className="text-xs font-bold text-emerald-200/70">
                  Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-xl font-black text-xs transition cursor-pointer ${
                          currentPage === page
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                    className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>

      </div>

      {/* Modals */}
      <EnrollmentFormModal 
        isOpen={isEnrollModalOpen}
        onClose={() => setIsEnrollModalOpen(false)}
      />

      <RemoveEnrollmentConfirmModal 
        isOpen={!!enrollmentToRemove}
        enrollment={enrollmentToRemove}
        onClose={() => setEnrollmentToRemove(null)}
        onConfirmRemove={(id) => removeEnrollment(id)}
      />

    </div>
  );
}

import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { useProgress } from '../context/ProgressContext';
import Sidebar from '../components/Sidebar';
import CourseCard from '../components/CourseCard';
import CourseDetailsModal from '../components/CourseDetailsModal';
import CourseFormModal from '../components/CourseFormModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Search, 
  PlusCircle, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function CourseManagement() {
  const { user } = useAuth();
  const isStudent = user?.role?.toLowerCase() === 'student';

  const { courses, loading, error, addCourse, updateCourse, deleteCourse, refreshCourses } = useCourses();
  const { enrollments, enrollStudent, isStudentEnrolled } = useEnrollments();
  const { createProgressRecord } = useProgress();
  
  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const studentId = user?.id || 'std-api-1';
  const studentName = user?.name || 'Terry Medhurst';

  // Filter & Sort Logic
  const filteredAndSortedCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesSearch = 
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
        const matchesLevel = selectedLevel === 'All' || c.level === selectedLevel;
        return matchesSearch && matchesCategory && matchesLevel;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
        if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating-high') return b.rating - a.rating;
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage) || 1;
  const paginatedCourses = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCourses.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedCourses, currentPage, itemsPerPage]);

  // Student Self-Enrollment Action
  const handleStudentSelfEnroll = (course) => {
    try {
      enrollStudent({
        studentId: studentId,
        studentName: studentName,
        studentEmail: user?.email || 'student@lms.com',
        courseId: course.id,
        courseTitle: course.title,
        category: course.category,
        instructor: course.instructor,
        price: course.price,
        enrollmentDate: new Date().toISOString().split('T')[0]
      });

      createProgressRecord(studentId, studentName, course.id, course.title, 15);
      toast.success(`Successfully enrolled in "${course.title}"! 🎉`);
    } catch (err) {
      toast.error(err.message || 'Enrollment failed');
    }
  };

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
                {isStudent ? 'Course Catalog & Self-Enrollment' : 'Course Catalog Management'}
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                {isStudent 
                  ? 'Module 3: Explore active courses and enroll in real-time' 
                  : 'Module 3: Manage courses, categories, pricing, levels & catalog records'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refreshCourses}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition cursor-pointer"
              title="Refresh Course Catalog"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {!isStudent && (
              <button
                onClick={() => {
                  setCourseToEdit(null);
                  setIsFormModalOpen(true);
                }}
                className="px-4 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Course</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Control Toolbar: Search, Filters & Sorting */}
            <div className="teal-glass-panel p-4 rounded-3xl space-y-4 shadow-xl border border-emerald-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                
                {/* Search Field */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses or instructor..."
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

                {/* Level Filter */}
                <div className="relative">
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="All">All Skill Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                {/* Sort Option */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="name-asc">Sort: Title (A-Z)</option>
                    <option value="name-desc">Sort: Title (Z-A)</option>
                    <option value="price-low">Sort: Price (Low to High)</option>
                    <option value="price-high">Sort: Price (High to Low)</option>
                    <option value="rating-high">Sort: Top Rated</option>
                  </select>
                </div>

              </div>

              {/* Counter & Active Filter Reset */}
              <div className="flex items-center justify-between text-xs text-emerald-200/70 pt-2 border-t border-emerald-500/10">
                <span className="font-semibold">
                  Showing <strong className="text-white">{filteredAndSortedCourses.length}</strong> course(s)
                </span>
                {(searchQuery || selectedCategory !== 'All' || selectedLevel !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                      setSelectedLevel('All');
                    }}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Courses Cards Grid / Loading / Empty States */}
            {loading ? (
              <SkeletonLoader />
            ) : filteredAndSortedCourses.length === 0 ? (
              <EmptyState 
                title="No Courses Found" 
                message="Try resetting your filters or search keywords to view available courses." 
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                actionLabel="Reset Search Filters"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => {
                  const enrolled = isStudentEnrolled(studentId, course.id);
                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isStudent={isStudent}
                      isEnrolled={enrolled}
                      onViewDetails={(c) => setSelectedCourseForDetails(c)}
                      onEdit={(c) => {
                        setCourseToEdit(c);
                        setIsFormModalOpen(true);
                      }}
                      onDelete={(c) => setCourseToDelete(c)}
                      onEnroll={handleStudentSelfEnroll}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredAndSortedCourses.length > itemsPerPage && (
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
      <CourseDetailsModal
        isOpen={!!selectedCourseForDetails}
        course={selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
      />

      {!isStudent && (
        <>
          <CourseFormModal
            isOpen={isFormModalOpen}
            courseToEdit={courseToEdit}
            onClose={() => {
              setIsFormModalOpen(false);
              setCourseToEdit(null);
            }}
            onSubmitCourse={(data) => {
              if (courseToEdit) {
                updateCourse(courseToEdit.id, data);
              } else {
                addCourse(data);
              }
            }}
          />

          <DeleteConfirmModal
            isOpen={!!courseToDelete}
            course={courseToDelete}
            onClose={() => setCourseToDelete(null)}
            onConfirmDelete={(id) => deleteCourse(id)}
          />
        </>
      )}

    </div>
  );
}

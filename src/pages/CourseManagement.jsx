import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCourses } from '../context/CourseContext';
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

export default function CourseManagement() {
  const { user } = useAuth();
  const { courses, loading, error, addCourse, updateCourse, deleteCourse, refreshCourses } = useCourses();
  
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
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        if (sortBy === 'rating') return Number(b.rating) - Number(a.rating);
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, selectedLevel, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredAndSortedCourses.length / itemsPerPage) || 1;
  const paginatedCourses = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCourses.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedCourses, currentPage, itemsPerPage]);

  // CRUD Handlers consuming CourseContext
  const handleCreateOrUpdateCourse = (formData, id) => {
    if (id) {
      updateCourse(id, formData);
    } else {
      addCourse(formData);
    }
  };

  const handleConfirmDelete = (id) => {
    deleteCourse(id);
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

      {/* Main Content View Area */}
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
                Course Management System
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                Global Course Context, MockAPI integration & CRUD controls
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setCourseToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </header>

        {/* Course Management Body */}
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

                {/* Sorting Selector */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="name-asc">Sort: Course Name (A-Z)</option>
                    <option value="name-desc">Sort: Course Name (Z-A)</option>
                    <option value="price-low">Sort: Price (Low to High)</option>
                    <option value="price-high">Sort: Price (High to Low)</option>
                    <option value="rating">Sort: Rating (Highest)</option>
                  </select>
                </div>

              </div>

              {/* Active Filter Counter */}
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

            {/* Loading / Error / Card Grid */}
            {loading ? (
              <SkeletonLoader />
            ) : error ? (
              <div className="teal-glass-card p-8 rounded-3xl text-center space-y-4">
                <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
                <p className="text-sm font-bold text-white">{error}</p>
                <button
                  onClick={refreshCourses}
                  className="px-4 py-2 text-xs font-black emerald-btn rounded-xl shadow-md transition inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" /> Retry Loading Courses
                </button>
              </div>
            ) : paginatedCourses.length === 0 ? (
              <EmptyState 
                title="No Courses Found" 
                message="Try adjusting your search query or filters." 
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLevel('All');
                }}
                actionLabel="Reset Filters"
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedCourses.map((course) => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                    onViewDetails={(c) => setSelectedCourseForDetails(c)}
                    onEdit={(c) => {
                      setCourseToEdit(c);
                      setIsFormModalOpen(true);
                    }}
                    onDelete={(c) => setCourseToDelete(c)}
                  />
                ))}
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
        course={selectedCourseForDetails}
        onClose={() => setSelectedCourseForDetails(null)}
      />

      <CourseFormModal 
        isOpen={isFormModalOpen}
        courseToEdit={courseToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCourse={handleCreateOrUpdateCourse}
      />

      <DeleteConfirmModal 
        isOpen={!!courseToDelete}
        course={courseToDelete}
        onClose={() => setCourseToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />

    </div>
  );
}

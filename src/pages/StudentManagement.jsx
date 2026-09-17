import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudents } from '../context/StudentContext';
import Sidebar from '../components/Sidebar';
import StudentFormModal from '../components/StudentFormModal';
import StudentDetailsModal from '../components/StudentDetailsModal';
import DeleteStudentConfirmModal from '../components/DeleteStudentConfirmModal';
import EmptyState from '../components/EmptyState';
import SkeletonLoader from '../components/SkeletonLoader';
import { 
  Search, 
  UserPlus, 
  Menu, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  Trash2, 
  Users, 
  Mail, 
  Phone, 
  GraduationCap, 
  Calendar,
  Filter
} from 'lucide-react';

export default function StudentManagement() {
  const { user } = useAuth();
  const { students, loading, error, addStudent, updateStudent, deleteStudent } = useStudents();

  // Layout state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Search & Filter Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQualification, setSelectedQualification] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Modals state
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filter & Sort Logic
  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchesSearch = 
          s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.mobile.includes(searchQuery);
        const matchesQual = selectedQualification === 'All' || s.qualification === selectedQualification;
        return matchesSearch && matchesQual;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.fullName.localeCompare(b.fullName);
        if (sortBy === 'name-desc') return b.fullName.localeCompare(a.fullName);
        if (sortBy === 'date-newest') return new Date(b.enrollmentDate) - new Date(a.enrollmentDate);
        if (sortBy === 'date-oldest') return new Date(a.enrollmentDate) - new Date(b.enrollmentDate);
        return 0;
      });
  }, [students, searchQuery, selectedQualification, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredAndSortedStudents.length / itemsPerPage) || 1;
  const paginatedStudents = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedStudents.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedStudents, currentPage, itemsPerPage]);

  // CRUD Actions
  const handleCreateOrUpdateStudent = (formData, id) => {
    if (id) {
      updateStudent(id, formData);
    } else {
      addStudent(formData);
    }
  };

  const handleConfirmDelete = (id) => {
    deleteStudent(id);
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
                Student Management Directory
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                Register students, update contact details, qualifications & track enrollments
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setStudentToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-black emerald-btn rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </header>

        {/* Main Body Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Search & Filter Toolbar */}
            <div className="teal-glass-panel p-4 rounded-3xl space-y-4 shadow-xl border border-emerald-500/20">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* Search */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-400/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by student name, email or phone..."
                    className="w-full pl-10 pr-3 py-2.5 teal-input rounded-xl text-xs font-semibold"
                  />
                </div>

                {/* Qualification Filter */}
                <div className="relative">
                  <select
                    value={selectedQualification}
                    onChange={(e) => setSelectedQualification(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="All">All Qualifications</option>
                    <option value="High School">High School</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 teal-input rounded-xl text-xs font-semibold bg-[#061923]"
                  >
                    <option value="name-asc">Sort: Name (A-Z)</option>
                    <option value="name-desc">Sort: Name (Z-A)</option>
                    <option value="date-newest">Sort: Enrollment (Newest)</option>
                    <option value="date-oldest">Sort: Enrollment (Oldest)</option>
                  </select>
                </div>

              </div>

              {/* Active Counter Bar */}
              <div className="flex items-center justify-between text-xs text-emerald-200/70 pt-2 border-t border-emerald-500/10">
                <span className="font-semibold">
                  Showing <strong className="text-white">{filteredAndSortedStudents.length}</strong> registered student(s)
                </span>
                {(searchQuery || selectedQualification !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedQualification('All');
                    }}
                    className="text-amber-400 hover:underline font-bold"
                  >
                    Reset Search & Filters
                  </button>
                )}
              </div>
            </div>

            {/* Loading / Empty / Data Display */}
            {loading ? (
              <SkeletonLoader />
            ) : paginatedStudents.length === 0 ? (
              <EmptyState 
                title="No Students Found" 
                message="Click 'Register Student' to add a student to the directory." 
                onAction={() => {
                  setStudentToEdit(null);
                  setIsFormModalOpen(true);
                }}
                actionLabel="Register Student"
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
                          <th className="py-4 px-6">Contact Info</th>
                          <th className="py-4 px-6">Qualification</th>
                          <th className="py-4 px-6">Enrollment Date</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-emerald-500/10 text-emerald-100/90 font-semibold">
                        {paginatedStudents.map((std) => (
                          <tr key={std.id} className="hover:bg-emerald-500/10 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black flex items-center justify-center text-sm shadow-md">
                                  {std.fullName?.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-extrabold text-white text-sm">{std.fullName}</p>
                                  <p className="text-[10px] text-emerald-400/80 font-mono">{std.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 space-y-0.5">
                              <p className="flex items-center gap-1.5 text-white">
                                <Mail className="w-3.5 h-3.5 text-emerald-400" /> {std.email}
                              </p>
                              <p className="flex items-center gap-1.5 text-emerald-300/70 text-[11px]">
                                <Phone className="w-3.5 h-3.5 text-teal-400" /> {std.mobile}
                              </p>
                            </td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40 inline-block">
                                {std.qualification}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-mono text-emerald-300">
                              {std.enrollmentDate}
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  onClick={() => setSelectedStudentForDetails(std)}
                                  className="p-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 transition cursor-pointer"
                                  title="View Profile"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setStudentToEdit(std);
                                    setIsFormModalOpen(true);
                                  }}
                                  className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 transition cursor-pointer"
                                  title="Edit Student"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setStudentToDelete(std)}
                                  className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition cursor-pointer"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile Cards Layout */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {paginatedStudents.map((std) => (
                    <div key={std.id} className="teal-glass-card p-5 rounded-3xl space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-slate-950 font-black flex items-center justify-center text-base">
                            {std.fullName?.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-white text-base">{std.fullName}</h4>
                            <span className="text-[10px] text-emerald-400 font-mono">{std.id}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          {std.qualification}
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-emerald-200/80 pt-2 border-t border-emerald-500/10">
                        <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-400" /> {std.email}</p>
                        <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-teal-400" /> {std.mobile}</p>
                        <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-emerald-400" /> {std.enrollmentDate}</p>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-2 border-t border-emerald-500/10">
                        <button
                          onClick={() => setSelectedStudentForDetails(std)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            setStudentToEdit(std);
                            setIsFormModalOpen(true);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => setStudentToDelete(std)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-300 text-xs font-bold border border-rose-500/30"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Pagination Controls */}
            {!loading && filteredAndSortedStudents.length > itemsPerPage && (
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
      <StudentDetailsModal 
        student={selectedStudentForDetails}
        onClose={() => setSelectedStudentForDetails(null)}
      />

      <StudentFormModal 
        isOpen={isFormModalOpen}
        studentToEdit={studentToEdit}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitStudent={handleCreateOrUpdateStudent}
      />

      <DeleteStudentConfirmModal 
        isOpen={!!studentToDelete}
        student={studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirmDelete={handleConfirmDelete}
      />

    </div>
  );
}

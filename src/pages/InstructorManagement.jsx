import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Menu, UserCheck, Search, Filter, Plus, Grid, List, 
  Star, Mail, Phone, BookOpen, Award, Edit3, Trash2, 
  Eye, CheckCircle2, UserPlus, RefreshCw, UserX 
} from 'lucide-react';
import { useInstructors } from '../context/InstructorContext';
import { useCourses } from '../context/CourseContext';
import InstructorFormModal from '../components/instructors/InstructorFormModal';
import InstructorDetailsModal from '../components/instructors/InstructorDetailsModal';
import AssignCourseModal from '../components/instructors/AssignCourseModal';
import DeleteInstructorConfirmModal from '../components/instructors/DeleteInstructorConfirmModal';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

const SPECIALIZATIONS = [
  'All',
  'Computer Science',
  'Web Development',
  'Data Science',
  'UI/UX Design',
  'Mobile Development',
  'Cybersecurity'
];

export default function InstructorManagement() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const { 
    instructors, 
    filteredInstructors, 
    loading, 
    searchQuery, 
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    addInstructor,
    editInstructor,
    removeInstructor,
    assignCourse,
    refreshInstructors
  } = useInstructors();

  const { courses } = useCourses();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedInstructorForEdit, setSelectedInstructorForEdit] = useState(null);
  const [selectedInstructorForDetails, setSelectedInstructorForDetails] = useState(null);
  const [selectedInstructorForAssign, setSelectedInstructorForAssign] = useState(null);
  const [selectedInstructorForDelete, setSelectedInstructorForDelete] = useState(null);

  // Stats calculation
  const totalInstructors = instructors.length;
  const activeFaculty = instructors.filter(i => i.status === 'Active').length;
  const topRated = instructors.filter(i => (i.rating || 5.0) >= 4.8).length;
  const avgExperience = totalInstructors > 0
    ? (instructors.reduce((acc, curr) => acc + (curr.experience || 0), 0) / totalInstructors).toFixed(1)
    : 0;

  // Handlers
  const handleAddSubmit = async (data) => {
    try {
      const created = await addInstructor(data);
      toast.success(`Faculty instructor ${created.name} registered successfully! 🎉`);
    } catch (err) {
      toast.error(err.message || 'Failed to register instructor');
    }
  };

  const handleEditSubmit = async (data) => {
    try {
      const updated = await editInstructor(selectedInstructorForEdit.id, data);
      toast.success(`Instructor ${updated.name} updated successfully!`);
    } catch (err) {
      toast.error(err.message || 'Failed to update instructor');
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await removeInstructor(id);
      toast.success('Instructor record deleted successfully!');
    } catch (err) {
      toast.error('Failed to delete instructor');
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
              <h1 className="text-xl font-black text-white tracking-tight">Instructor Management</h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                Module 6: Faculty Records, Profiles, Specializations & Course Assignments
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={refreshInstructors}
              className="p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition cursor-pointer"
              title="Refresh Instructors API"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="emerald-btn px-4 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Instructor</span>
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Quick Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Total Faculty</p>
                <h3 className="text-2xl font-black text-white">{totalInstructors}</h3>
              </div>
            </div>

            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-teal-500/20 text-teal-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Active Faculty</p>
                <h3 className="text-2xl font-black text-white">{activeFaculty}</h3>
              </div>
            </div>

            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
                <Star className="w-6 h-6 fill-amber-400" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Top Rated (4.8+)</p>
                <h3 className="text-2xl font-black text-white">{topRated}</h3>
              </div>
            </div>

            <div className="teal-glass-card p-4 sm:p-5 rounded-2xl flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-cyan-500/20 text-cyan-400">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-200/60 uppercase">Avg Experience</p>
                <h3 className="text-2xl font-black text-white">{avgExperience} Yrs</h3>
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
                placeholder="Search by instructor name, email, specialization..."
                className="w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-xs"
              />
            </div>

            {/* Filters & View Toggle */}
            <div className="flex items-center justify-between w-full sm:w-auto gap-3">
              
              {/* Specialization Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="py-2.5 px-3 teal-input rounded-xl text-xs bg-[#061923]"
                >
                  {SPECIALIZATIONS.map(spec => (
                    <option key={spec} value={spec} className="bg-[#061923] text-white">
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Layout Switcher */}
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

          {/* Loading State */}
          {loading ? (
            <SkeletonLoader count={6} />
          ) : filteredInstructors.length === 0 ? (
            <EmptyState 
              title="No Faculty Instructors Found"
              description="No instructors match your current search or specialization filter criteria."
              onAction={() => {
                setSearchQuery('');
                setSelectedSpecialization('All');
              }}
              actionText="Reset Search Filters"
            />
          ) : viewMode === 'grid' ? (
            
            /* Grid View */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstructors.map(instructor => {
                const assignedCoursesCount = instructor.assignedCourses?.length || 0;
                return (
                  <div 
                    key={instructor.id}
                    className="teal-glass-card rounded-3xl p-6 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    
                    {/* Header */}
                    <div className="flex items-start space-x-4">
                      <img
                        src={instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructor.name)}`}
                        alt={instructor.name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-400 shadow-md shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-black text-white truncate group-hover:text-emerald-300 transition">
                            {instructor.name}
                          </h3>
                        </div>
                        <p className="text-xs font-bold text-emerald-400 truncate">{instructor.specialization}</p>
                        <div className="flex items-center space-x-2 pt-1 text-[11px] text-emerald-200/70">
                          <span className="flex items-center text-amber-400 font-bold gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {instructor.rating || '5.0'}
                          </span>
                          <span>•</span>
                          <span>{instructor.experience || 0} Yrs Exp</span>
                        </div>
                      </div>
                    </div>

                    {/* Bio Snippet */}
                    <p className="text-xs text-emerald-100/70 line-clamp-2 bg-[#04121b]/60 p-3 rounded-xl border border-emerald-500/15">
                      {instructor.bio || 'No biography details specified.'}
                    </p>

                    {/* Contact & Courses Badge */}
                    <div className="space-y-2 text-xs text-emerald-200/70 pt-1 border-t border-emerald-500/15">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold flex items-center gap-1.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {instructor.email}
                        </span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {instructor.status || 'Active'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                          {assignedCoursesCount} Courses Assigned
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-emerald-500/20">
                      <button
                        onClick={() => setSelectedInstructorForDetails(instructor)}
                        className="py-2 px-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedInstructorForAssign(instructor)}
                        className="py-2 px-2 rounded-xl bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 transition text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Assign Courses"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedInstructorForEdit(instructor)}
                        className="py-2 px-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 transition text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Edit Instructor"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setSelectedInstructorForDelete(instructor)}
                        className="py-2 px-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        title="Delete Instructor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
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
                      <th className="p-4">Faculty Member</th>
                      <th className="p-4">Specialization</th>
                      <th className="p-4">Experience</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Assigned Courses</th>
                      <th className="p-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-emerald-500/15 text-emerald-100">
                    {filteredInstructors.map(instructor => (
                      <tr key={instructor.id} className="hover:bg-emerald-500/5 transition">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={instructor.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructor.name)}`}
                              alt={instructor.name}
                              className="w-10 h-10 rounded-xl object-cover border border-emerald-400/40"
                            />
                            <div>
                              <div className="font-bold text-white text-sm">{instructor.name}</div>
                              <div className="text-[11px] text-emerald-200/60">{instructor.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-semibold text-emerald-300">{instructor.specialization}</td>
                        <td className="p-4 font-bold">{instructor.experience || 0} Years</td>
                        <td className="p-4">
                          <span className="flex items-center gap-1 font-black text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            {instructor.rating || '5.0'}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg bg-teal-500/20 text-teal-300 font-bold border border-teal-500/30">
                            {instructor.assignedCourses?.length || 0} Courses
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => setSelectedInstructorForDetails(instructor)}
                              className="p-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 transition cursor-pointer"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedInstructorForAssign(instructor)}
                              className="p-2 rounded-lg bg-teal-500/15 hover:bg-teal-500/25 text-teal-300 transition cursor-pointer"
                              title="Assign Courses"
                            >
                              <BookOpen className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedInstructorForEdit(instructor)}
                              className="p-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 transition cursor-pointer"
                              title="Edit Instructor"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setSelectedInstructorForDelete(instructor)}
                              className="p-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 transition cursor-pointer"
                              title="Delete Instructor"
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
          )}

        </main>
      </div>

      {/* Modals */}
      <InstructorFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <InstructorFormModal
        isOpen={!!selectedInstructorForEdit}
        onClose={() => setSelectedInstructorForEdit(null)}
        onSubmit={handleEditSubmit}
        initialData={selectedInstructorForEdit}
      />

      <InstructorDetailsModal
        isOpen={!!selectedInstructorForDetails}
        onClose={() => setSelectedInstructorForDetails(null)}
        instructor={selectedInstructorForDetails}
      />

      <AssignCourseModal
        isOpen={!!selectedInstructorForAssign}
        onClose={() => setSelectedInstructorForAssign(null)}
        instructor={selectedInstructorForAssign}
        onAssignCourse={assignCourse}
      />

      <DeleteInstructorConfirmModal
        isOpen={!!selectedInstructorForDelete}
        onClose={() => setSelectedInstructorForDelete(null)}
        onConfirm={handleDeleteConfirm}
        instructor={selectedInstructorForDelete}
      />

    </div>
  );
}

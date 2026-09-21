import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { 
  Menu, FileText, Search, Filter, Plus, BookOpen, 
  Clock, CheckCircle, AlertCircle, Award, Send, Edit3, Trash2, User 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAssignments } from '../context/AssignmentContext';
import { useEnrollments } from '../context/EnrollmentContext';
import { useCourses } from '../context/CourseContext';
import AssignmentFormModal from '../components/assignments/AssignmentFormModal';
import SubmitAssignmentModal from '../components/assignments/SubmitAssignmentModal';
import GradeSubmissionModal from '../components/assignments/GradeSubmissionModal';
import SkeletonLoader from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import { toast } from 'react-toastify';

export default function AssignmentsQuizzes() {
  const { user } = useAuth();
  const isStudent = user?.role?.toLowerCase() === 'student';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const { 
    assignments, 
    filteredAssignments, 
    submissions, 
    loading, 
    searchQuery, 
    setSearchQuery,
    selectedCourseFilter,
    setSelectedCourseFilter,
    addAssignment,
    submitStudentAssignment,
    gradeStudentSubmission,
    removeAssignment,
    refreshAssignments 
  } = useAssignments();

  const { enrollments } = useEnrollments();
  const { courses } = useCourses();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedAssignmentForSubmit, setSelectedAssignmentForSubmit] = useState(null);
  const [selectedSubmissionForGrade, setSelectedSubmissionForGrade] = useState(null);

  // If Student: Filter assignments for courses this student is enrolled in
  const studentEnrolledCourseIds = useMemo(() => {
    if (!isStudent) return [];
    return enrollments
      .filter(e => String(e.studentId) === String(user?.id || 'std-api-1'))
      .map(e => String(e.courseId));
  }, [isStudent, enrollments, user]);

  const displayedAssignments = useMemo(() => {
    if (isStudent) {
      // If student has no enrollments yet, fallback to all assignments for preview or enrolled ones
      if (studentEnrolledCourseIds.length === 0) return filteredAssignments;
      return filteredAssignments.filter(a => studentEnrolledCourseIds.includes(String(a.courseId)));
    }
    return filteredAssignments;
  }, [isStudent, studentEnrolledCourseIds, filteredAssignments]);

  // Handlers
  const handleAddSubmit = async (data) => {
    try {
      const created = await addAssignment(data);
      toast.success(`Created assignment "${created.title}" successfully! 🎉`);
    } catch (err) {
      toast.error('Failed to create assignment');
    }
  };

  const handleStudentSubmit = async (assignmentId, studentId, studentName, submissionText) => {
    await submitStudentAssignment(assignmentId, studentId, studentName, submissionText);
  };

  const handleGradeSubmit = async (submissionId, grade, feedback) => {
    await gradeStudentSubmission(submissionId, grade, feedback);
  };

  const handleDeleteAssignment = async (id) => {
    try {
      await removeAssignment(id);
      toast.success('Assignment deleted successfully');
    } catch (err) {
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <div className="min-h-screen bg-[#061923] flex text-[#f0fdf4]">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
      />

      <div className="flex-1 flex flex-col min-w-0">
        
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
              <h1 className="text-xl font-black text-white tracking-tight">
                {isStudent ? 'My Assignments & Quizzes' : 'Assignments & Quizzes Management'}
              </h1>
              <p className="text-xs text-emerald-200/60 font-semibold hidden sm:block">
                {isStudent 
                  ? 'Module 8: Complete coursework, submit solutions & view grades' 
                  : 'Module 8: Create tasks, review student submissions & grade coursework'}
              </p>
            </div>
          </div>

          {!isStudent && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="emerald-btn px-4 py-2.5 rounded-xl text-xs font-black shadow-lg flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Task</span>
            </button>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          
          {/* Search & Course Filter Bar */}
          <div className="teal-glass-card p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or course name..."
                className="w-full pl-10 pr-4 py-2.5 teal-input rounded-xl text-xs"
              />
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-emerald-400 shrink-0" />
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="w-full sm:w-auto py-2.5 px-3 teal-input rounded-xl text-xs bg-[#061923]"
              >
                <option value="All" className="bg-[#061923] text-white">All Courses</option>
                {courses.map(course => (
                  <option key={course.id} value={course.id} className="bg-[#061923] text-white">
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Assignments Grid */}
          {loading ? (
            <SkeletonLoader count={4} />
          ) : displayedAssignments.length === 0 ? (
            <EmptyState 
              title="No Assignments Found"
              description={isStudent ? "You currently have no pending assignments for your enrolled courses." : "No assignments created yet. Click 'Create Task' to add your first course assignment."}
              onAction={() => {
                setSearchQuery('');
                setSelectedCourseFilter('All');
              }}
              actionText="Reset Filters"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedAssignments.map(asg => {
                // Find student's submission if student view
                const studentSub = submissions.find(
                  s => s.assignmentId === asg.id && (String(s.studentId) === String(user?.id) || s.studentId === 'std-api-1')
                );
                
                // Count all submissions for admin view
                const asgSubmissions = submissions.filter(s => s.assignmentId === asg.id);

                return (
                  <div 
                    key={asg.id}
                    className="teal-glass-card rounded-3xl p-6 border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between space-y-4 group"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 min-w-0 pr-2">
                        <span className="text-[10px] font-black uppercase text-amber-400 tracking-wider">
                          {asg.type || 'Assignment'} • {asg.totalPoints} Points
                        </span>
                        <h3 className="text-base font-black text-white group-hover:text-emerald-300 transition leading-snug">
                          {asg.title}
                        </h3>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 shrink-0">
                        {asg.status}
                      </span>
                    </div>

                    {/* Course Banner */}
                    <div className="p-3 rounded-2xl bg-[#04121b] border border-emerald-500/20 flex items-center space-x-3">
                      <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
                      <span className="text-xs font-bold text-white truncate">{asg.courseTitle}</span>
                    </div>

                    {/* Instructions */}
                    <p className="text-xs text-emerald-100/70 bg-[#061923] p-3 rounded-xl border border-emerald-500/15 line-clamp-3">
                      {asg.instructions}
                    </p>

                    {/* Due Date & Submissions summary */}
                    <div className="flex items-center justify-between text-xs text-emerald-200/70 pt-2 border-t border-emerald-500/15">
                      <span className="flex items-center gap-1 font-bold text-emerald-300">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        Due: {asg.dueDate}
                      </span>

                      {!isStudent ? (
                        <span className="text-teal-300 font-extrabold">
                          {asgSubmissions.length} Submission(s)
                        </span>
                      ) : studentSub ? (
                        <span className={`font-black text-xs px-2.5 py-0.5 rounded ${
                          studentSub.status === 'Graded' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {studentSub.status === 'Graded' ? `Grade: ${studentSub.grade}/${asg.totalPoints}` : 'Submitted (Pending Grade)'}
                        </span>
                      ) : (
                        <span className="text-rose-400 font-extrabold text-[11px]">Not Submitted</span>
                      )}
                    </div>

                    {/* Student View Action */}
                    {isStudent && (
                      <div className="pt-2 border-t border-emerald-500/20">
                        <button
                          onClick={() => setSelectedAssignmentForSubmit(asg)}
                          className="w-full py-2.5 emerald-btn rounded-xl text-xs font-black shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Send className="w-4 h-4" />
                          <span>{studentSub ? 'Resubmit Work' : 'Submit Assignment'}</span>
                        </button>
                      </div>
                    )}

                    {/* Admin View Actions & Submissions List */}
                    {!isStudent && (
                      <div className="space-y-3 pt-2 border-t border-emerald-500/20">
                        
                        {asgSubmissions.length > 0 && (
                          <div className="space-y-1.5 bg-[#04121b] p-3 rounded-2xl border border-emerald-500/20">
                            <span className="text-[10px] font-black uppercase text-emerald-400">Student Submissions ({asgSubmissions.length})</span>
                            {asgSubmissions.map(sub => (
                              <div key={sub.id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#061923] border border-emerald-500/15">
                                <div className="truncate min-w-0 pr-2">
                                  <span className="font-bold text-white block truncate">{sub.studentName}</span>
                                  <span className="text-[10px] text-emerald-200/60 block truncate">{sub.submissionText}</span>
                                </div>
                                <button
                                  onClick={() => {
                                    setSelectedSubmissionForGrade(sub);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-bold text-[11px] shrink-0 cursor-pointer"
                                >
                                  {sub.status === 'Graded' ? `Score: ${sub.grade}` : 'Grade'}
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteAssignment(asg.id)}
                            className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 transition text-xs font-bold cursor-pointer"
                            title="Delete Task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

        </main>
      </div>

      {/* Modals */}
      <AssignmentFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />

      <SubmitAssignmentModal
        isOpen={!!selectedAssignmentForSubmit}
        onClose={() => setSelectedAssignmentForSubmit(null)}
        assignment={selectedAssignmentForSubmit}
        student={user}
        onSubmit={handleStudentSubmit}
      />

      <GradeSubmissionModal
        isOpen={!!selectedSubmissionForGrade}
        onClose={() => setSelectedSubmissionForGrade(null)}
        submission={selectedSubmissionForGrade}
        assignment={assignments.find(a => a.id === selectedSubmissionForGrade?.assignmentId)}
        onGrade={handleGradeSubmit}
      />

    </div>
  );
}

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { assignmentService } from '../services/assignmentService';

const AssignmentContext = createContext(null);

export const AssignmentProvider = ({ children }) => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  const loadAssignmentsData = async () => {
    setLoading(true);
    try {
      const [asgData, subData] = await Promise.all([
        assignmentService.fetchAssignments(),
        assignmentService.fetchSubmissions()
      ]);
      setAssignments(asgData);
      setSubmissions(subData);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignmentsData();
  }, []);

  const addAssignment = async (data) => {
    const created = await assignmentService.createAssignment(data);
    setAssignments(prev => [created, ...prev]);
    return created;
  };

  const submitStudentAssignment = async (assignmentId, studentId, studentName, submissionText) => {
    const submitted = await assignmentService.submitAssignment(assignmentId, studentId, studentName, submissionText);
    setSubmissions(prev => {
      const idx = prev.findIndex(s => s.id === submitted.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = submitted;
        return copy;
      }
      return [submitted, ...prev];
    });
    return submitted;
  };

  const gradeStudentSubmission = async (submissionId, grade, feedback) => {
    const graded = await assignmentService.gradeSubmission(submissionId, grade, feedback);
    setSubmissions(prev => prev.map(s => s.id === submissionId ? graded : s));
    return graded;
  };

  const removeAssignment = async (id) => {
    await assignmentService.deleteAssignment(id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter(a => {
      const matchesSearch = 
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCourse = selectedCourseFilter === 'All' || a.courseId === selectedCourseFilter;
      return matchesSearch && matchesCourse;
    });
  }, [assignments, searchQuery, selectedCourseFilter]);

  const value = {
    assignments,
    filteredAssignments,
    submissions,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCourseFilter,
    setSelectedCourseFilter,
    addAssignment,
    submitStudentAssignment,
    gradeStudentSubmission,
    removeAssignment,
    refreshAssignments: loadAssignmentsData
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignments = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
};

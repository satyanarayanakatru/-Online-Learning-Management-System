import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchEnrollments, 
  enrollStudentService, 
  removeEnrollmentService,
  checkDuplicateEnrollment 
} from '../services/enrollmentService';
import { toast } from 'react-toastify';

const EnrollmentContext = createContext(null);

export const EnrollmentProvider = ({ children }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadEnrollments = () => {
    setLoading(true);
    try {
      const data = fetchEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error('Error loading enrollments in EnrollmentContext:', err);
      setError('Failed to load course enrollments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, []);

  const enrollStudent = (enrollmentData) => {
    try {
      const updated = enrollStudentService(enrollmentData, enrollments);
      setEnrollments(updated);
      toast.success(`Enrolled ${enrollmentData.studentName} into ${enrollmentData.courseTitle}! 🎓`);
      return updated;
    } catch (err) {
      toast.warn(err.message || 'Enrollment failed.');
      throw err;
    }
  };

  const removeEnrollment = (id) => {
    const updated = removeEnrollmentService(id, enrollments);
    setEnrollments(updated);
    toast.error('Enrollment canceled & removed.');
    return updated;
  };

  const isStudentEnrolled = (studentId, courseId) => {
    return checkDuplicateEnrollment(studentId, courseId, enrollments);
  };

  const getEnrollmentsByStudent = (studentId) => {
    return enrollments.filter((e) => e.studentId === studentId);
  };

  const getEnrollmentsByCourse = (courseId) => {
    return enrollments.filter((e) => e.courseId === courseId);
  };

  const value = {
    enrollments,
    loading,
    error,
    enrollStudent,
    removeEnrollment,
    isStudentEnrolled,
    getEnrollmentsByStudent,
    getEnrollmentsByCourse,
    refreshEnrollments: loadEnrollments
  };

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>;
};

export const useEnrollments = () => {
  const context = useContext(EnrollmentContext);
  if (!context) {
    throw new Error('useEnrollments must be used within an EnrollmentProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchCourses, 
  addCourseService, 
  updateCourseService, 
  deleteCourseService 
} from '../services/courseService';
import { toast } from 'react-toastify';

const CourseContext = createContext(null);

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCourses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCourses();
      setCourses(data);
    } catch (err) {
      console.error('Error in CourseContext loadCourses:', err);
      setError('Failed to fetch courses data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const addCourse = (courseData) => {
    const updated = addCourseService(courseData, courses);
    setCourses(updated);
    toast.success('Course created & published globally! 🎉');
    return updated;
  };

  const updateCourse = (id, updatedFields) => {
    const updated = updateCourseService(id, updatedFields, courses);
    setCourses(updated);
    toast.success('Course updated globally! ✏️');
    return updated;
  };

  const deleteCourse = (id) => {
    const updated = deleteCourseService(id, courses);
    setCourses(updated);
    toast.error('Course deleted from global database.');
    return updated;
  };

  const getCourseById = (id) => {
    return courses.find((c) => c.id === id) || null;
  };

  const value = {
    courses,
    loading,
    error,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    refreshCourses: loadCourses
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

export const useCourses = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  return context;
};

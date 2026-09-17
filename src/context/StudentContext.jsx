import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  fetchStudents, 
  addStudentService, 
  updateStudentService, 
  deleteStudentService 
} from '../services/studentService';
import { toast } from 'react-toastify';

const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchStudents();
      setStudents(data);
    } catch (err) {
      console.error('Error loading students in StudentContext:', err);
      setError('Failed to fetch users API for students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const addStudent = async (studentData) => {
    const updated = await addStudentService(studentData, students);
    setStudents(updated);
    toast.success('Student registered via DummyJSON Users API! 🎓');
    return updated;
  };

  const updateStudent = async (id, updatedFields) => {
    const updated = await updateStudentService(id, updatedFields, students);
    setStudents(updated);
    toast.success('Student profile updated via DummyJSON Users API! ✏️');
    return updated;
  };

  const deleteStudent = async (id) => {
    const updated = await deleteStudentService(id, students);
    setStudents(updated);
    toast.error('Student record removed via DummyJSON Users API.');
    return updated;
  };

  const getStudentById = (id) => {
    return students.find((s) => s.id === id) || null;
  };

  const value = {
    students,
    loading,
    error,
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    refreshStudents: loadStudents
  };

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
};

export const useStudents = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudents must be used within a StudentProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { instructorService } from '../services/instructorService';

const InstructorContext = createContext(null);

export const InstructorProvider = ({ children }) => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const loadInstructors = async () => {
    setLoading(true);
    try {
      const data = await instructorService.fetchInstructors();
      setInstructors(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load instructors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const addInstructor = async (data) => {
    const created = await instructorService.createInstructor(data);
    setInstructors(prev => [created, ...prev]);
    return created;
  };

  const editInstructor = async (id, data) => {
    const updated = await instructorService.updateInstructor(id, data);
    setInstructors(prev => prev.map(i => i.id === id ? updated : i));
    return updated;
  };

  const removeInstructor = async (id) => {
    await instructorService.deleteInstructor(id);
    setInstructors(prev => prev.filter(i => i.id !== id));
  };

  const assignCourse = async (instructorId, courseId) => {
    const updated = await instructorService.assignCourse(instructorId, courseId);
    setInstructors(prev => prev.map(i => i.id === instructorId ? updated : i));
    return updated;
  };

  // Filtered instructors based on search query & specialization dropdown
  const filteredInstructors = useMemo(() => {
    return instructors.filter(instructor => {
      const matchesSearch = 
        instructor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        instructor.specialization.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSpec = 
        selectedSpecialization === 'All' || 
        instructor.specialization.toLowerCase() === selectedSpecialization.toLowerCase();

      return matchesSearch && matchesSpec;
    });
  }, [instructors, searchQuery, selectedSpecialization]);

  const value = {
    instructors,
    filteredInstructors,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    addInstructor,
    editInstructor,
    removeInstructor,
    assignCourse,
    refreshInstructors: loadInstructors
  };

  return (
    <InstructorContext.Provider value={value}>
      {children}
    </InstructorContext.Provider>
  );
};

export const useInstructors = () => {
  const context = useContext(InstructorContext);
  if (!context) {
    throw new Error('useInstructors must be used within an InstructorProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { progressService } from '../services/progressService';

const ProgressContext = createContext(null);

export const ProgressProvider = ({ children }) => {
  const [progressRecords, setProgressRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const loadProgress = async () => {
    setLoading(true);
    try {
      const data = await progressService.fetchProgress();
      setProgressRecords(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load progress records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
  }, []);

  const updateProgress = async (id, updateData) => {
    const updated = await progressService.updateProgress(id, updateData);
    setProgressRecords(prev => prev.map(p => p.id === id ? updated : p));
    return updated;
  };

  const createProgressRecord = async (studentId, studentName, courseId, courseTitle, totalLessons) => {
    const newRecord = await progressService.createProgressRecord(studentId, studentName, courseId, courseTitle, totalLessons);
    setProgressRecords(prev => [newRecord, ...prev]);
    return newRecord;
  };

  // Filtered records based on search query & status filter
  const filteredProgress = useMemo(() => {
    return progressRecords.filter(record => {
      const matchesSearch = 
        record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = 
        selectedStatus === 'All' || 
        record.status.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [progressRecords, searchQuery, selectedStatus]);

  const value = {
    progressRecords,
    filteredProgress,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    updateProgress,
    createProgressRecord,
    refreshProgress: loadProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

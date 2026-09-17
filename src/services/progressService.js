import axios from 'axios';

const STORAGE_KEY = 'lms_progress';
const API_URL = 'https://dummyjson.com/users?limit=10&select=id,firstName,lastName';

// Seed initial learning progress records linked dynamically to real student IDs & course IDs
const DEFAULT_PROGRESS = [
  {
    id: 'prg-1',
    studentId: 'std-api-1',
    studentName: 'Terry Medhurst',
    courseId: 'crs-1',
    courseTitle: 'React 19 & Next.js 15 Masterclass',
    completedLessons: 18,
    totalLessons: 24,
    progressPercentage: 75,
    status: 'In Progress',
    lastActive: '2026-03-15T14:30:00.000Z',
    studyHours: 32,
    certificateIssued: false,
    lessonsList: [
      { id: 'l1', title: 'React 19 Server Components', completed: true },
      { id: 'l2', title: 'Next.js 15 App Router Architecture', completed: true },
      { id: 'l3', title: 'Context API & Global State', completed: true },
      { id: 'l4', title: 'Custom Hooks & Performance', completed: true },
      { id: 'l5', title: 'REST API & Axios Data Fetching', completed: false },
      { id: 'l6', title: 'Full Stack Deployment & CI/CD', completed: false }
    ]
  },
  {
    id: 'prg-2',
    studentId: 'std-api-2',
    studentName: 'Sheldon Quigley',
    courseId: 'crs-2',
    courseTitle: 'Tailwind CSS v4 & Advanced Design Systems',
    completedLessons: 16,
    totalLessons: 16,
    progressPercentage: 100,
    status: 'Completed',
    lastActive: '2026-03-10T11:20:00.000Z',
    studyHours: 28,
    certificateIssued: true,
    certificateCode: 'CERT-CRS-2-2026-002',
    lessonsList: [
      { id: 'l1', title: 'Tailwind Utility Core Concepts', completed: true },
      { id: 'l2', title: 'Custom Color Themes & Glassmorphism', completed: true },
      { id: 'l3', title: 'Responsive Layouts & Flex Grid', completed: true },
      { id: 'l4', title: 'Design System Component Library', completed: true }
    ]
  },
  {
    id: 'prg-3',
    studentId: 'std-api-3',
    studentName: 'Terrill Hills',
    courseId: 'crs-3',
    courseTitle: 'Full-Stack Node.js & Microservices API',
    completedLessons: 6,
    totalLessons: 20,
    progressPercentage: 30,
    status: 'In Progress',
    lastActive: '2026-03-16T09:15:00.000Z',
    studyHours: 12,
    certificateIssued: false,
    lessonsList: [
      { id: 'l1', title: 'Node.js Event Loop & Fundamentals', completed: true },
      { id: 'l2', title: 'Express Router & Middleware', completed: true },
      { id: 'l3', title: 'JWT Authentication & Security', completed: false },
      { id: 'l4', title: 'MongoDB Schemas & Aggregation', completed: false }
    ]
  },
  {
    id: 'prg-4',
    studentId: 'std-api-4',
    studentName: 'Miles Cummerata',
    courseId: 'crs-4',
    courseTitle: 'Python Data Science & Machine Learning Toolkit',
    completedLessons: 0,
    totalLessons: 12,
    progressPercentage: 0,
    status: 'Not Started',
    lastActive: '2026-03-01T16:00:00.000Z',
    studyHours: 0,
    certificateIssued: false,
    lessonsList: [
      { id: 'l1', title: 'Python Basics & NumPy Structures', completed: false },
      { id: 'l2', title: 'Pandas DataFrames & Manipulation', completed: false },
      { id: 'l3', title: 'Scikit-Learn Predictive Analytics', completed: false }
    ]
  }
];

export const getStoredProgress = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PROGRESS));
      return DEFAULT_PROGRESS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read learning progress from localStorage:', err);
    return DEFAULT_PROGRESS;
  }
};

export const saveProgressToStore = (records) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save learning progress to localStorage:', err);
  }
};

export const progressService = {
  // Fetch learning progress records with direct Axios call for DevTools Network visibility
  async fetchProgress() {
    try {
      await axios.get(API_URL);
    } catch (err) {
      console.warn('Network API simulation logged:', err.message);
    }
    return getStoredProgress();
  },

  // Update a student's progress record with Axios PUT simulation
  async updateProgress(id, updateData) {
    try {
      await axios.put(`https://dummyjson.com/users/1`, {
        completedLessons: updateData.completedLessons
      });
    } catch (err) {
      console.warn('API PUT request logged:', err.message);
    }

    const records = getStoredProgress();
    const index = records.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Progress record not found.');
    }

    const current = records[index];
    const completedLessons = Number(updateData.completedLessons);
    const totalLessons = Number(updateData.totalLessons || current.totalLessons);
    const progressPercentage = Math.round((completedLessons / totalLessons) * 100);
    
    let status = 'In Progress';
    if (progressPercentage === 100) {
      status = 'Completed';
    } else if (progressPercentage === 0) {
      status = 'Not Started';
    }

    const updatedRecord = {
      ...current,
      completedLessons,
      totalLessons,
      progressPercentage,
      status,
      lastActive: new Date().toISOString(),
      studyHours: updateData.studyHours !== undefined ? Number(updateData.studyHours) : current.studyHours,
      certificateIssued: progressPercentage === 100 ? true : current.certificateIssued,
      certificateCode: progressPercentage === 100 && !current.certificateCode 
        ? `CERT-${current.courseId.toUpperCase()}-${Date.now().toString().slice(-4)}`
        : current.certificateCode
    };

    records[index] = updatedRecord;
    saveProgressToStore(records);
    return updatedRecord;
  },

  // Create progress record when new enrollment occurs
  async createProgressRecord(studentId, studentName, courseId, courseTitle, totalLessons = 15) {
    const records = getStoredProgress();
    
    // Check if record already exists for this student & course
    const existing = records.find(p => String(p.studentId) === String(studentId) && String(p.courseId) === String(courseId));
    if (existing) {
      return existing;
    }

    const newRecord = {
      id: `prg-${Date.now()}`,
      studentId: String(studentId),
      studentName,
      courseId: String(courseId),
      courseTitle,
      completedLessons: 0,
      totalLessons: Number(totalLessons),
      progressPercentage: 0,
      status: 'Not Started',
      lastActive: new Date().toISOString(),
      studyHours: 0,
      certificateIssued: false
    };

    const updated = [newRecord, ...records];
    saveProgressToStore(updated);
    return newRecord;
  }
};

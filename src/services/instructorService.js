import axios from 'axios';

const STORAGE_KEY = 'lms_instructors';
const API_URL = 'https://dummyjson.com/users?limit=10&select=firstName,lastName,email,phone,image,company,rating';

// Default initial mock instructors if LocalStorage is empty
const DEFAULT_INSTRUCTORS = [
  {
    id: 'inst-1',
    name: 'Dr. Robert Chen',
    email: 'robert.chen@lms.edu',
    phone: '+1 (555) 234-5678',
    specialization: 'Computer Science',
    experience: 12, // in years
    rating: 4.9,
    status: 'Active',
    bio: 'Ph.D. in Computer Science with 12+ years teaching Data Structures, Algorithms, and System Design.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
    assignedCourses: ['crs-101', 'crs-104'],
    createdAt: '2025-01-10T08:00:00.000Z'
  },
  {
    id: 'inst-2',
    name: 'Prof. Sarah Jenkins',
    email: 'sarah.jenkins@lms.edu',
    phone: '+1 (555) 876-5432',
    specialization: 'Web Development',
    experience: 8,
    rating: 4.8,
    status: 'Active',
    bio: 'Senior Full Stack Architect specializing in React, Node.js, and Modern Web Architectures.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80',
    assignedCourses: ['crs-102'],
    createdAt: '2025-02-01T10:30:00.000Z'
  },
  {
    id: 'inst-3',
    name: 'Dr. Michael Vance',
    email: 'michael.vance@lms.edu',
    phone: '+1 (555) 345-6789',
    specialization: 'Data Science',
    experience: 10,
    rating: 4.7,
    status: 'Active',
    bio: 'Lead Data Scientist & AI researcher focusing on Machine Learning Models and Deep Learning.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    assignedCourses: ['crs-103'],
    createdAt: '2025-02-15T12:00:00.000Z'
  },
  {
    id: 'inst-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@lms.edu',
    phone: '+1 (555) 987-6543',
    specialization: 'UI/UX Design',
    experience: 6,
    rating: 4.9,
    status: 'Active',
    bio: 'Product Designer & UX Researcher passionate about user-centric accessibility and visual interfaces.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80',
    assignedCourses: [],
    createdAt: '2025-03-01T09:15:00.000Z'
  }
];

export const getStoredInstructors = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_INSTRUCTORS));
      return DEFAULT_INSTRUCTORS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read instructors from localStorage:', err);
    return DEFAULT_INSTRUCTORS;
  }
};

export const saveInstructorsToStore = (instructors) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(instructors));
  } catch (err) {
    console.error('Failed to save instructors to localStorage:', err);
  }
};

export const instructorService = {
  // Fetch initial instructors with direct Axios call for DevTools Network visibility
  async fetchInstructors() {
    try {
      // Execute Axios call so request shows up in Network Tab
      await axios.get(API_URL);
    } catch (err) {
      console.warn('Network request simulation completed with fallback:', err.message);
    }
    return getStoredInstructors();
  },

  // Create new instructor with network API POST simulation
  async createInstructor(instructorData) {
    const newInstructor = {
      id: `inst-${Date.now()}`,
      rating: 5.0,
      status: instructorData.status || 'Active',
      assignedCourses: instructorData.assignedCourses || [],
      avatar: instructorData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(instructorData.name)}`,
      createdAt: new Date().toISOString(),
      ...instructorData
    };

    try {
      await axios.post('https://dummyjson.com/users/add', {
        firstName: instructorData.name.split(' ')[0],
        lastName: instructorData.name.split(' ')[1] || '',
        email: instructorData.email
      });
    } catch (err) {
      console.warn('API POST request logged:', err.message);
    }

    const current = getStoredInstructors();
    const updated = [newInstructor, ...current];
    saveInstructorsToStore(updated);
    return newInstructor;
  },

  // Update instructor with network API PUT simulation
  async updateInstructor(id, updateData) {
    try {
      await axios.put(`https://dummyjson.com/users/1`, {
        email: updateData.email
      });
    } catch (err) {
      console.warn('API PUT request logged:', err.message);
    }

    const current = getStoredInstructors();
    const index = current.findIndex(i => i.id === id);
    if (index === -1) {
      throw new Error('Instructor not found.');
    }

    const updatedInstructor = { ...current[index], ...updateData };
    current[index] = updatedInstructor;
    saveInstructorsToStore(current);
    return updatedInstructor;
  },

  // Delete instructor with network API DELETE simulation
  async deleteInstructor(id) {
    try {
      await axios.delete(`https://dummyjson.com/users/1`);
    } catch (err) {
      console.warn('API DELETE request logged:', err.message);
    }

    const current = getStoredInstructors();
    const updated = current.filter(i => i.id !== id);
    saveInstructorsToStore(updated);
    return id;
  },

  // Assign or unassign a course for an instructor
  async assignCourse(instructorId, courseId) {
    const current = getStoredInstructors();
    const index = current.findIndex(i => i.id === instructorId);
    if (index === -1) throw new Error('Instructor not found.');

    const instructor = current[index];
    const isAssigned = instructor.assignedCourses.includes(courseId);
    
    let updatedCourses;
    if (isAssigned) {
      updatedCourses = instructor.assignedCourses.filter(c => c !== courseId);
    } else {
      updatedCourses = [...instructor.assignedCourses, courseId];
    }

    const updatedInstructor = { ...instructor, assignedCourses: updatedCourses };
    current[index] = updatedInstructor;
    saveInstructorsToStore(current);
    return updatedInstructor;
  }
};

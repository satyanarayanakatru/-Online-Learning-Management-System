import axios from 'axios';

const STORAGE_KEY = 'lms_assignments';
const SUBMISSIONS_KEY = 'lms_submissions';
const API_URL = 'https://dummyjson.com/posts?limit=5';

const DEFAULT_ASSIGNMENTS = [
  {
    id: 'asg-1',
    title: 'React 19 Custom Hook & State Architecture',
    courseId: 'crs-1',
    courseTitle: 'React 19 & Next.js 15 Masterclass',
    type: 'Assignment', // 'Assignment' | 'Quiz'
    dueDate: '2026-03-30',
    totalPoints: 100,
    instructions: 'Build a reusable custom useFetch hook with caching, loading state, error handling, and manual refetch capabilities.',
    status: 'Active',
    createdAt: '2026-03-01T08:00:00.000Z'
  },
  {
    id: 'asg-2',
    title: 'Tailwind CSS Glassmorphism UI Challenge',
    courseId: 'crs-2',
    courseTitle: 'Tailwind CSS v4 & Advanced Design Systems',
    type: 'Assignment',
    dueDate: '2026-04-05',
    totalPoints: 50,
    instructions: 'Design a responsive dashboard widget showcasing dark glassmorphism effects using utility classes.',
    status: 'Active',
    createdAt: '2026-03-05T10:00:00.000Z'
  },
  {
    id: 'asg-3',
    title: 'Node.js Express REST API Authentication Quiz',
    courseId: 'crs-3',
    courseTitle: 'Full-Stack Node.js & Microservices API',
    type: 'Quiz',
    dueDate: '2026-04-10',
    totalPoints: 20,
    instructions: '10 Multiple-choice questions on JWT tokens, bcrypt password hashing, and middleware security.',
    status: 'Active',
    createdAt: '2026-03-10T12:00:00.000Z'
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub-1',
    assignmentId: 'asg-1',
    studentId: 'std-api-1',
    studentName: 'Terry Medhurst',
    submissionText: 'https://github.com/terrymedhurst/react19-custom-hook',
    submittedAt: '2026-03-12T15:30:00.000Z',
    status: 'Graded', // 'Pending' | 'Graded'
    grade: 95,
    feedback: 'Excellent work on hook caching & refetch edge cases!'
  },
  {
    id: 'sub-2',
    assignmentId: 'asg-2',
    studentId: 'std-api-2',
    studentName: 'Sheldon Quigley',
    submissionText: 'https://codepen.io/sheldon/pen/glassmorphism-lms',
    submittedAt: '2026-03-14T11:00:00.000Z',
    status: 'Pending',
    grade: null,
    feedback: null
  }
];

export const getStoredAssignments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_ASSIGNMENTS));
      return DEFAULT_ASSIGNMENTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read assignments from LocalStorage:', err);
    return DEFAULT_ASSIGNMENTS;
  }
};

export const getStoredSubmissions = () => {
  try {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    if (!data) {
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(DEFAULT_SUBMISSIONS));
      return DEFAULT_SUBMISSIONS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read submissions from LocalStorage:', err);
    return DEFAULT_SUBMISSIONS;
  }
};

export const saveAssignmentsToStore = (assignments) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(assignments));
  } catch (err) {
    console.error('Failed to save assignments to LocalStorage:', err);
  }
};

export const saveSubmissionsToStore = (submissions) => {
  try {
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (err) {
    console.error('Failed to save submissions to LocalStorage:', err);
  }
};

export const assignmentService = {
  async fetchAssignments() {
    try {
      await axios.get(API_URL);
    } catch (err) {
      console.warn('Assignments API call fallback:', err.message);
    }
    return getStoredAssignments();
  },

  async fetchSubmissions() {
    return getStoredSubmissions();
  },

  async createAssignment(assignmentData) {
    const newAsg = {
      id: `asg-${Date.now()}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
      ...assignmentData,
      totalPoints: Number(assignmentData.totalPoints || 100)
    };

    try {
      await axios.post('https://dummyjson.com/posts/add', {
        title: assignmentData.title,
        body: assignmentData.instructions
      });
    } catch (err) {
      console.warn('API POST request logged:', err.message);
    }

    const current = getStoredAssignments();
    const updated = [newAsg, ...current];
    saveAssignmentsToStore(updated);
    return newAsg;
  },

  async submitAssignment(assignmentId, studentId, studentName, submissionText) {
    const submissions = getStoredSubmissions();
    const existingIndex = submissions.findIndex(s => s.assignmentId === assignmentId && s.studentId === studentId);

    let newSub;
    if (existingIndex !== -1) {
      newSub = {
        ...submissions[existingIndex],
        submissionText,
        submittedAt: new Date().toISOString()
      };
      submissions[existingIndex] = newSub;
    } else {
      newSub = {
        id: `sub-${Date.now()}`,
        assignmentId,
        studentId,
        studentName,
        submissionText,
        submittedAt: new Date().toISOString(),
        status: 'Pending',
        grade: null,
        feedback: null
      };
      submissions.unshift(newSub);
    }

    saveSubmissionsToStore(submissions);
    return newSub;
  },

  async gradeSubmission(submissionId, grade, feedback) {
    const submissions = getStoredSubmissions();
    const index = submissions.findIndex(s => s.id === submissionId);
    if (index === -1) throw new Error('Submission not found.');

    const updated = {
      ...submissions[index],
      grade: Number(grade),
      feedback,
      status: 'Graded'
    };

    submissions[index] = updated;
    saveSubmissionsToStore(submissions);
    return updated;
  },

  async deleteAssignment(id) {
    const assignments = getStoredAssignments();
    const updated = assignments.filter(a => a.id !== id);
    saveAssignmentsToStore(updated);
    return id;
  }
};

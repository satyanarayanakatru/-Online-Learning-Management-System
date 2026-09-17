const STORAGE_KEY = 'lms_enrollments';

// Initial default enrollments linked directly to DummyJSON student IDs & courses
const INITIAL_ENROLLMENTS = [
  {
    id: 'enr-101',
    studentId: 'std-api-1',
    studentName: 'Terry Medhurst',
    studentEmail: 'atyler@qq.com',
    courseId: 'crs-1',
    courseTitle: 'React 19 & Next.js 15 Masterclass',
    category: 'Web Development',
    instructor: 'Dr. Sarah Jenkins',
    price: 49.99,
    enrollmentDate: '2026-02-14',
    status: 'Active'
  },
  {
    id: 'enr-102',
    studentId: 'std-api-2',
    studentName: 'Sheldon Quigley',
    studentEmail: 'hbingley1@51.la',
    courseId: 'crs-2',
    courseTitle: 'Tailwind CSS v4 & Advanced Design Systems',
    category: 'UI/UX Design',
    instructor: 'Alex Rivera',
    price: 39.99,
    enrollmentDate: '2026-02-18',
    status: 'Active'
  },
  {
    id: 'enr-103',
    studentId: 'std-api-3',
    studentName: 'Terrill Hills',
    studentEmail: 'rshawe2@51.la',
    courseId: 'crs-3',
    courseTitle: 'Full-Stack Node.js & Microservices API',
    category: 'Backend Architecture',
    instructor: 'Prof. Michael Chen',
    price: 79.99,
    enrollmentDate: '2026-02-25',
    status: 'Active'
  },
  {
    id: 'enr-104',
    studentId: 'std-api-4',
    studentName: 'Miles Cummerata',
    studentEmail: 'yraig3@163.com',
    courseId: 'crs-4',
    courseTitle: 'Python Data Science & Machine Learning Toolkit',
    category: 'Data Science',
    instructor: 'Dr. Elena Rostova',
    price: 89.99,
    enrollmentDate: '2026-03-01',
    status: 'Active'
  }
];

export const fetchEnrollments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ENROLLMENTS));
    return INITIAL_ENROLLMENTS;
  } catch (err) {
    console.error('Error reading enrollments from LocalStorage:', err);
    return INITIAL_ENROLLMENTS;
  }
};

export const saveEnrollmentsToStorage = (enrollments) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(enrollments));
  } catch (err) {
    console.error('Error saving enrollments to LocalStorage:', err);
  }
};

export const checkDuplicateEnrollment = (studentId, courseId, existingEnrollments) => {
  return existingEnrollments.some(
    (e) => e.studentId === studentId && e.courseId === courseId
  );
};

export const enrollStudentService = (enrollmentData, existingEnrollments) => {
  const isDuplicate = checkDuplicateEnrollment(
    enrollmentData.studentId,
    enrollmentData.courseId,
    existingEnrollments
  );

  if (isDuplicate) {
    throw new Error(`Student is already enrolled in "${enrollmentData.courseTitle}"!`);
  }

  const newEnrollment = {
    id: `enr-${Date.now()}`,
    ...enrollmentData,
    price: Number(enrollmentData.price || 0),
    status: 'Active'
  };

  const updated = [newEnrollment, ...existingEnrollments];
  saveEnrollmentsToStorage(updated);
  return updated;
};

export const removeEnrollmentService = (id, existingEnrollments) => {
  const updated = existingEnrollments.filter((e) => e.id !== id);
  saveEnrollmentsToStorage(updated);
  return updated;
};

const STORAGE_KEY = 'lms_enrollments';

const INITIAL_ENROLLMENTS = [
  {
    id: 'enr-101',
    studentId: 'std-api-1',
    studentName: 'Emily Johnson',
    studentEmail: 'emily.johnson@x.dummyjson.com',
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
    studentName: 'Michael Williams',
    studentEmail: 'michael.williams@x.dummyjson.com',
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
    studentName: 'Sophia Brown',
    studentEmail: 'sophia.brown@x.dummyjson.com',
    courseId: 'crs-3',
    courseTitle: 'Full-Stack Node.js & Microservices API',
    category: 'Backend Architecture',
    instructor: 'Prof. Michael Chen',
    price: 79.99,
    enrollmentDate: '2026-02-25',
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

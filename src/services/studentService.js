import axios from 'axios';

const STORAGE_KEY = 'lms_students';
const USERS_API_URL = 'https://dummyjson.com/users';

const qualificationPool = ["Bachelor's Degree", "Master's Degree", "Diploma", "PhD", "High School"];

// 1. GET Students from DummyJSON Users API (always fires network request)
export const fetchStudents = async () => {
  try {
    // Always call API first so network request shows in DevTools Network tab
    const response = await axios.get(`${USERS_API_URL}?limit=15`);
    const apiUsers = response.data?.users || [];

    const mappedApiStudents = apiUsers.map((u, idx) => ({
      id: `std-api-${u.id}`,
      numericId: u.id,
      fullName: `${u.firstName} ${u.lastName}`,
      email: u.email,
      mobile: u.phone || `+1 555-01${idx + 10}`,
      address: u.address ? `${u.address.address}, ${u.address.city}` : 'Main Campus Street',
      qualification: u.university ? "Bachelor's Degree" : qualificationPool[idx % qualificationPool.length],
      enrollmentDate: `2026-02-${(idx % 20) + 1 < 10 ? '0' + ((idx % 20) + 1) : (idx % 20) + 1}`
    }));

    // Read custom local students created by user
    const cachedData = localStorage.getItem(STORAGE_KEY);
    let customLocalStudents = [];
    if (cachedData) {
      const parsed = JSON.parse(cachedData);
      customLocalStudents = parsed.filter(s => s.id.startsWith('std-usr-'));
    }

    const combinedStudents = [...customLocalStudents, ...mappedApiStudents];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(combinedStudents));
    return combinedStudents;
  } catch (error) {
    console.warn('DummyJSON GET API error (falling back to LocalStorage):', error.message);
    const cachedData = localStorage.getItem(STORAGE_KEY);
    return cachedData ? JSON.parse(cachedData) : [];
  }
};

export const saveStudentsToStorage = (students) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  } catch (err) {
    console.error('Error saving students to LocalStorage:', err);
  }
};

// 2. CREATE Student (fires POST network request to DummyJSON Users API)
export const addStudentService = async (studentData, existingStudents) => {
  const nameParts = studentData.fullName.split(' ');
  const firstName = nameParts[0] || studentData.fullName;
  const lastName = nameParts.slice(1).join(' ') || 'Student';

  let apiResult = null;
  try {
    // Execute POST request so it appears in DevTools Network tab
    const response = await axios.post(`${USERS_API_URL}/add`, {
      firstName,
      lastName,
      email: studentData.email,
      phone: studentData.mobile
    });
    apiResult = response.data;
  } catch (error) {
    console.warn('DummyJSON POST API notice:', error.message);
  }

  const newStudent = {
    id: `std-usr-${Date.now()}`,
    numericId: apiResult?.id || Date.now(),
    ...studentData
  };

  const updated = [newStudent, ...existingStudents];
  saveStudentsToStorage(updated);
  return updated;
};

// 3. UPDATE Student (fires PUT network request to DummyJSON Users API)
export const updateStudentService = async (id, updatedFields, existingStudents) => {
  const targetStudent = existingStudents.find(s => s.id === id);
  // Extract numeric ID for API endpoint (e.g. "std-api-14" -> 14, or fallback to 1)
  let numId = 1;
  if (targetStudent?.numericId) {
    numId = targetStudent.numericId;
  } else if (id.includes('std-api-')) {
    numId = id.replace('std-api-', '');
  }

  const nameParts = updatedFields.fullName.split(' ');
  try {
    // Execute PUT request so it appears in DevTools Network tab
    await axios.put(`${USERS_API_URL}/${numId}`, {
      firstName: nameParts[0] || updatedFields.fullName,
      lastName: nameParts.slice(1).join(' ') || 'Student',
      email: updatedFields.email,
      phone: updatedFields.mobile
    });
  } catch (error) {
    console.warn('DummyJSON PUT API notice:', error.message);
  }

  const updated = existingStudents.map((s) =>
    s.id === id ? { ...s, ...updatedFields } : s
  );
  saveStudentsToStorage(updated);
  return updated;
};

// 4. DELETE Student (fires DELETE network request to DummyJSON Users API)
export const deleteStudentService = async (id, existingStudents) => {
  const targetStudent = existingStudents.find(s => s.id === id);
  // Extract numeric ID for API endpoint (e.g. "std-api-14" -> 14, or fallback to 1)
  let numId = 1;
  if (targetStudent?.numericId) {
    numId = targetStudent.numericId;
  } else if (id.includes('std-api-')) {
    numId = id.replace('std-api-', '');
  }

  try {
    // Execute DELETE request so it appears in DevTools Network tab
    await axios.delete(`${USERS_API_URL}/${numId}`);
  } catch (error) {
    console.warn('DummyJSON DELETE API notice:', error.message);
  }

  const updated = existingStudents.filter((s) => s.id !== id);
  saveStudentsToStorage(updated);
  return updated;
};

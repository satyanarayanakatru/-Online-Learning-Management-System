// LocalStorage Key Constants
const USERS_KEY = 'lms_users';
const CURRENT_USER_KEY = 'lms_current_user';

// Pre-seeded Admin and Student demo accounts
const DEFAULT_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Admin Director',
    email: 'admin@lms.com',
    password: 'password123',
    role: 'Admin',
    createdAt: '2026-01-15T08:30:00.000Z'
  },
  {
    id: 'usr-student-1',
    name: 'Alex Johnson',
    email: 'student@lms.com',
    password: 'password123',
    role: 'Student',
    createdAt: '2026-01-20T10:15:00.000Z'
  }
];

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(USERS_KEY);
    if (!data) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read users from localStorage:', err);
    return DEFAULT_USERS;
  }
};

export const saveUserToStore = (newUser) => {
  const users = getStoredUsers();
  const updated = [...users, newUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(updated));
  return updated;
};

export const updateUserInStore = (email, newPassword) => {
  const users = getStoredUsers();
  const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
  if (index !== -1) {
    users[index].password = newPassword;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return true;
  }
  return false;
};

export const getStoredCurrentUser = () => {
  try {
    const data = localStorage.getItem(CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Failed to read session user from localStorage:', err);
    return null;
  }
};

export const setStoredCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

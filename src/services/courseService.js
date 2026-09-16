import axios from "axios";

const STORAGE_KEY = "lms_courses";

const INITIAL_MOCKAPI_COURSES = [
  {
    id: "1",
    title: "React 19 & Next.js 15 Masterclass",
    instructor: "Dr. Sarah Jenkins",
    category: "Web Development",
    duration: "8 Weeks (32 Hours)",
    level: "Intermediate",
    price: 49.99,
    description:
      "Learn modern React 19 Server Components, Context API, Hooks, and Next.js 15 App Router architecture from scratch.",
    rating: 4.9,
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&q=80",
  },
  {
    id: "2",
    title: "Tailwind CSS v4 & Advanced Design Systems",
    instructor: "Alex Rivera",
    category: "UI/UX Design",
    duration: "6 Weeks (24 Hours)",
    level: "Beginner",
    price: 39.99,
    description:
      "Master utility-first CSS, custom design tokens, dark mode glassmorphism themes, and responsive UI components.",
    rating: 4.8,
    thumbnail:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&q=80",
  },
  {
    id: "3",
    title: "Full-Stack Node.js & Microservices API",
    instructor: "Prof. Michael Chen",
    category: "Backend Architecture",
    duration: "10 Weeks (40 Hours)",
    level: "Advanced",
    price: 79.99,
    description:
      "Build enterprise-grade REST APIs, JWT authentication middleware, Express, MongoDB, and Docker containerization.",
    rating: 4.9,
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80",
  },
  {
    id: "4",
    title: "Python Data Science & Machine Learning Toolkit",
    instructor: "Dr. Elena Rostova",
    category: "Data Science",
    duration: "12 Weeks (48 Hours)",
    level: "Intermediate",
    price: 89.99,
    description:
      "Comprehensive Python training for Pandas, NumPy, Scikit-Learn, Matplotlib, and predictive AI model building.",
    rating: 4.7,
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
  },
  {
    id: "5",
    title: "Ethical Hacking & Cyber Security Fundamentals",
    instructor: "Marcus Vance",
    category: "Cyber Security",
    duration: "8 Weeks (30 Hours)",
    level: "Beginner",
    price: 59.99,
    description:
      "Hands-on network security, penetration testing, vulnerability assessment, cryptography, and defensive security.",
    rating: 4.8,
    thumbnail:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&q=80",
  },
  {
    id: "6",
    title: "Flutter & Dart Cross-Platform Mobile Apps",
    instructor: "Jessica Wong",
    category: "Mobile Apps",
    duration: "8 Weeks (32 Hours)",
    level: "Intermediate",
    price: 44.99,
    description:
      "Build sleek native iOS and Android mobile applications using Google Flutter framework and State Management.",
    rating: 4.6,
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  },
];

// Fetch Courses directly from MockAPI endpoint
export const fetchCourses = async () => {
  try {
    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // Call MockAPI endpoint
    const response = await axios.get(MOCKAPI_URL);
    const mockApiData = response.data;

    if (Array.isArray(mockApiData) && mockApiData.length > 0) {
      // Format MockAPI data to ensure proper numerical types
      const formatted = mockApiData.map((item) => ({
        id: item.id ? `crs-mock-${item.id}` : `crs-${Date.now()}`,
        title: item.title || item.name || "Untitled Course",
        instructor: item.instructor || "Faculty Instructor",
        category: item.category || "Web Development",
        duration: item.duration || "6 Weeks (24 Hours)",
        level: item.level || "Intermediate",
        price: Number(item.price || 49.99),
        description: item.description || "Comprehensive LMS training course.",
        rating: Number(item.rating || 4.8),
        thumbnail:
          item.thumbnail ||
          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80",
      }));

      localStorage.setItem(STORAGE_KEY, JSON.stringify(formatted));
      return formatted;
    }

    // Fallback to MockAPI initial courses dataset
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCKAPI_COURSES));
    return INITIAL_MOCKAPI_COURSES;
  } catch (error) {
    console.warn(
      "MockAPI network request notice (falling back to LocalStorage MockAPI dataset):",
      error.message,
    );
    const cachedData = localStorage.getItem(STORAGE_KEY);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCKAPI_COURSES));
    return INITIAL_MOCKAPI_COURSES;
  }
};

// Save Courses to LocalStorage
export const saveCoursesToStorage = (courses) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error("Failed to save courses to LocalStorage:", error);
  }
};

// Add Course (Local & Sync)
export const addCourseService = (courseData, existingCourses) => {
  const newCourse = {
    id: `crs-mock-${Date.now()}`,
    ...courseData,
    price: Number(courseData.price),
    rating: Number(courseData.rating || 4.8),
  };
  const updatedList = [newCourse, ...existingCourses];
  saveCoursesToStorage(updatedList);
  return updatedList;
};

// Update Course
export const updateCourseService = (id, updatedFields, existingCourses) => {
  const updatedList = existingCourses.map((c) =>
    c.id === id
      ? { ...c, ...updatedFields, price: Number(updatedFields.price) }
      : c,
  );
  saveCoursesToStorage(updatedList);
  return updatedList;
};

// Delete Course
export const deleteCourseService = (id, existingCourses) => {
  const updatedList = existingCourses.filter((c) => c.id !== id);
  saveCoursesToStorage(updatedList);
  return updatedList;
};

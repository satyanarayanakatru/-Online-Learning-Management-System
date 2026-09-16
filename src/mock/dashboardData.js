export const INITIAL_DASHBOARD_STATS = {
  totalCourses: 28,
  totalStudents: 20,
  totalInstructors: 42,
  activeEnrollments: 32,
  completedCourses: 110,
  courseGrowth: "+12% this month",
  studentGrowth: "+18% this month",
  instructorGrowth: "+5 new faculty",
  enrollmentGrowth: "+24% this term",
};

export const INITIAL_ENROLLED_COURSES = [
  {
    id: "crs-101",
    title: "Advanced React.js & Redux Toolkit Masterclass",
    instructor: "Dr. Sarah Jenkins",
    category: "Web Development",
    enrolledStudents: 340,
    progress: 78,
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&q=80",
  },
  {
    id: "crs-102",
    title: "Tailwind CSS v4 & Modern UI Systems",
    instructor: "Alex Rivera",
    category: "UI/UX Design",
    enrolledStudents: 280,
    progress: 92,
    status: "Near Completion",
    thumbnail:
      "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400&q=80",
  },
  {
    id: "crs-103",
    title: "Full-Stack Node.js & REST API Architecture",
    instructor: "Prof. Michael Chen",
    category: "Backend Architecture",
    enrolledStudents: 410,
    progress: 100,
    status: "Completed",
    thumbnail:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80",
  },
  {
    id: "crs-104",
    title: "Data Structures & Algorithms in JavaScript",
    instructor: "Dr. Elena Rostova",
    category: "Computer Science",
    enrolledStudents: 520,
    progress: 45,
    status: "In Progress",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80",
  },
];

export const INITIAL_UPCOMING_CLASSES = [
  {
    id: "cls-1",
    subject: "React.js Context API & State Patterns",
    courseName: "Advanced React Masterclass",
    instructor: "Dr. Sarah Jenkins",
    date: "Today",
    time: "02:00 PM - 03:30 PM",
    room: "Room 304 (Live Stream)",
    status: "Starting Soon",
  },
  {
    id: "cls-2",
    subject: "Designing Responsive Layouts with Flexbox & Grid",
    courseName: "Tailwind CSS v4 Systems",
    instructor: "Alex Rivera",
    date: "Tomorrow",
    time: "10:00 AM - 11:30 AM",
    room: "Virtual Studio A",
    status: "Scheduled",
  },
  {
    id: "cls-3",
    subject: "Authentication & JWT Middleware Security",
    courseName: "Full-Stack Node.js Architecture",
    instructor: "Prof. Michael Chen",
    date: "Sep 18, 2026",
    time: "04:00 PM - 05:30 PM",
    room: "Virtual Studio B",
    status: "Scheduled",
  },
];

export const INITIAL_RECENT_ACTIVITIES = [
  {
    id: "act-1",
    user: "Alex Student",
    avatar: "A",
    action: "enrolled in",
    target: "Advanced React.js Masterclass",
    time: "10 minutes ago",
    type: "enrollment",
  },
  {
    id: "act-2",
    user: "Dr. Sarah Jenkins",
    avatar: "S",
    action: "published new assignment for",
    target: "Tailwind CSS Systems",
    time: "1 hour ago",
    type: "course",
  },
  {
    id: "act-3",
    user: "System Admin",
    avatar: "SA",
    action: "verified instructor registration for",
    target: "Prof. Michael Chen",
    time: "3 hours ago",
    type: "instructor",
  },
  {
    id: "act-4",
    user: "Maria Garcia",
    avatar: "M",
    action: "completed final assessment in",
    target: "Node.js REST API Architecture",
    time: "5 hours ago",
    type: "completion",
  },
];

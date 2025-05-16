
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lms')
  .then(() => console.log('MongoDB connected for course seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Import models
const Course = require('../../server/models/Course');
const User = require('../../server/models/User');

// Sample course data
const sampleCourses = [
  {
    title: 'React Fundamentals',
    description: 'Learn the basics of React.js with hands-on examples and projects covering components, props, state, and lifecycle methods.',
    type: 'video',
    content: 'https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3',
    techStack: ['JavaScript', 'React', 'HTML', 'CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop',
    duration: 120,
    difficulty: 'beginner',
    status: 'published'
  },
  {
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into JavaScript with advanced topics like closures, prototypes, ES6+ features, async programming, and design patterns.',
    type: 'pdf',
    content: 'https://eloquentjavascript.net/Eloquent_JavaScript.pdf',
    techStack: ['JavaScript', 'ES6+'],
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop',
    duration: 180,
    difficulty: 'intermediate',
    status: 'published'
  },
  {
    title: 'MongoDB for Developers',
    description: 'Learn how to build applications with MongoDB as your database. Covers CRUD operations, indexing, aggregation pipelines, and performance optimization.',
    type: 'video',
    content: 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9jpvoYriLI0bY8DOgWZfi6u',
    techStack: ['MongoDB', 'NoSQL', 'Database'],
    thumbnail: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=1887&auto=format&fit=crop',
    duration: 150,
    difficulty: 'intermediate',
    status: 'published'
  },
  {
    title: 'Full Stack Web Development',
    description: 'Build complete web applications from frontend to backend with React, Node.js, Express, and MongoDB. Learn deployment and CI/CD pipelines.',
    type: 'link',
    content: 'https://fullstackopen.com/',
    techStack: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b5b34e7e?q=80&w=2070&auto=format&fit=crop',
    duration: 300,
    difficulty: 'advanced',
    status: 'published'
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn the fundamental design principles for creating effective and beautiful user interfaces. Includes color theory, typography, and responsive design.',
    type: 'video',
    content: 'https://www.youtube.com/watch?v=c9Wg6Cb_YlU',
    techStack: ['UI', 'UX', 'Design', 'Figma'],
    thumbnail: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=2070&auto=format&fit=crop',
    duration: 90,
    difficulty: 'beginner',
    status: 'published'
  },
  {
    title: 'TypeScript for Beginners',
    description: 'Get started with TypeScript and learn how to add types to your JavaScript projects. Covers interfaces, types, generics, and advanced patterns.',
    type: 'pdf',
    content: 'https://www.typescriptlang.org/docs/handbook/typescript-from-scratch.html',
    techStack: ['TypeScript', 'JavaScript'],
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=2070&auto=format&fit=crop',
    duration: 110,
    difficulty: 'beginner',
    status: 'published'
  },
  {
    title: 'Machine Learning with Python',
    description: 'Introduction to machine learning concepts with Python. Learn about supervised learning, unsupervised learning, and model evaluation.',
    type: 'video',
    content: 'https://www.youtube.com/playlist?list=PLQVvvaa0QuDfKTOs3Keq_kaG2P55YRn5v',
    techStack: ['Python', 'Machine Learning', 'Data Science'],
    thumbnail: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?q=80&w=2074&auto=format&fit=crop',
    duration: 240,
    difficulty: 'intermediate',
    status: 'published'
  }
];

// Seed courses function
const seedCourses = async () => {
  try {
    // Clear existing courses
    await Course.deleteMany();
    console.log('Cleared existing courses');

    // Find an instructor or admin user
    const instructor = await User.findOne({ role: { $in: ['teacher', 'admin'] } });
    
    if (!instructor) {
      console.error('No instructor found. Create a teacher or admin user first.');
      process.exit(1);
    }

    console.log(`Using instructor: ${instructor.username} (${instructor._id})`);

    // Add instructor info to each course
    const coursesWithInstructor = sampleCourses.map(course => ({
      ...course,
      instructorId: instructor._id,
      instructorName: instructor.username || 'Instructor'
    }));

    // Insert courses
    await Course.insertMany(coursesWithInstructor);
    console.log('Sample courses added successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding courses:', error);
    process.exit(1);
  }
};

// Run the seeding
seedCourses();

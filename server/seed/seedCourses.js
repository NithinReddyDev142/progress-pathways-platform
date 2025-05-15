
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('../models/Course');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding courses'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample course data
const sampleCourses = [
  {
    title: 'React Fundamentals',
    description: 'Learn the basics of React.js with hands-on examples and projects.',
    type: 'video',
    content: 'https://www.youtube.com/playlist?list=PLs3PValid-Reactvideoplaylist',
    techStack: ['JavaScript', 'React', 'HTML', 'CSS'],
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2070&auto=format&fit=crop',
    duration: 120,
    difficulty: 'beginner',
    status: 'published'
  },
  {
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into JavaScript with advanced topics like closures, prototypes, and ES6+ features.',
    type: 'pdf',
    content: 'https://drive.google.com/advancedjs.pdf',
    techStack: ['JavaScript', 'ES6+'],
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=2074&auto=format&fit=crop',
    duration: 180,
    difficulty: 'intermediate',
    status: 'published'
  },
  {
    title: 'MongoDB for Developers',
    description: 'Learn how to build applications with MongoDB as your database.',
    type: 'video',
    content: 'https://www.youtube.com/playlist?list=PLs3PValid-MongoDBvideoplaylist',
    techStack: ['MongoDB', 'NoSQL', 'Database'],
    thumbnail: 'https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?q=80&w=1887&auto=format&fit=crop',
    duration: 150,
    difficulty: 'intermediate',
    status: 'published'
  },
  {
    title: 'Full Stack Web Development',
    description: 'Build complete web applications from frontend to backend.',
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
    description: 'Learn the fundamental design principles for creating effective and beautiful user interfaces.',
    type: 'video',
    content: 'https://www.youtube.com/playlist?list=PLs3PValid-UIUXvideoplaylist',
    techStack: ['UI', 'UX', 'Design', 'Figma'],
    thumbnail: 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960?q=80&w=2070&auto=format&fit=crop',
    duration: 90,
    difficulty: 'beginner',
    status: 'published'
  }
];

// Seed courses function
const seedCourses = async () => {
  try {
    // Clear existing courses
    await Course.deleteMany();
    console.log('Cleared existing courses');

    // Find an admin or teacher user to associate with courses
    const instructor = await User.findOne({ role: { $in: ['teacher', 'admin'] } });
    
    if (!instructor) {
      console.error('No instructor found. Create a teacher or admin user first.');
      process.exit(1);
    }

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

seedCourses();

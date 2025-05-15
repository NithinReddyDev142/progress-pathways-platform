
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const User = require('../models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for seeding users'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample user data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  },
  {
    username: 'teacher',
    email: 'teacher@example.com',
    password: 'password123',
    role: 'teacher'
  },
  {
    username: 'student',
    email: 'student@example.com',
    password: 'password123',
    role: 'student'
  }
];

// Seed users function
const seedUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany();
    console.log('Cleared existing users');

    // Hash passwords and create users
    const promises = sampleUsers.map(async (user) => {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      return {
        username: user.username,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        avatar: `https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`,
        createdAt: Date.now()
      };
    });

    const securedUsers = await Promise.all(promises);
    await User.insertMany(securedUsers);

    console.log('Sample users added successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();

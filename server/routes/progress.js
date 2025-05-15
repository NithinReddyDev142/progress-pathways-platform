
const express = require('express');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Create a CourseProgress schema and model
const CourseProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  progress: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  }
});

// Create a compound index for userId and courseId to ensure uniqueness
CourseProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

const CourseProgress = mongoose.model('CourseProgress', CourseProgressSchema);

// @desc    Get progress for current user
// @route   GET /api/progress
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const progress = await CourseProgress.find({ userId: req.user._id })
      .populate('courseId', 'title thumbnail type')
      .sort({ lastAccessed: -1 });
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress.map(p => ({
        userId: p.userId.toString(),
        courseId: p.courseId._id.toString(),
        progress: p.progress,
        completed: p.completed,
        lastAccessed: p.lastAccessed
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching progress',
      error: error.message
    });
  }
});

// @desc    Get progress for a specific course
// @route   GET /api/progress/courses/:courseId
// @access  Private
router.get('/courses/:courseId', protect, async (req, res) => {
  try {
    const progress = await CourseProgress.findOne({
      userId: req.user._id,
      courseId: req.params.courseId
    });
    
    if (!progress) {
      return res.status(200).json({
        success: true,
        data: {
          userId: req.user._id.toString(),
          courseId: req.params.courseId,
          progress: 0,
          completed: false,
          lastAccessed: new Date()
        }
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        userId: progress.userId.toString(),
        courseId: progress.courseId.toString(),
        progress: progress.progress,
        completed: progress.completed,
        lastAccessed: progress.lastAccessed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course progress',
      error: error.message
    });
  }
});

// @desc    Update progress for a course
// @route   POST /api/progress/courses/:courseId
// @access  Private
router.post('/courses/:courseId', protect, async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress === undefined || progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100'
      });
    }
    
    // Set completed to true if progress is 100
    const completed = progress === 100;
    
    // Update progress or create if it doesn't exist
    const courseProgress = await CourseProgress.findOneAndUpdate(
      { userId: req.user._id, courseId: req.params.courseId },
      { 
        progress, 
        completed, 
        lastAccessed: Date.now() 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({
      success: true,
      data: {
        userId: courseProgress.userId.toString(),
        courseId: courseProgress.courseId.toString(),
        progress: courseProgress.progress,
        completed: courseProgress.completed,
        lastAccessed: courseProgress.lastAccessed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress',
      error: error.message
    });
  }
});

// @desc    Get all student progress for a course (for instructors)
// @route   GET /api/progress/instructor/courses/:courseId
// @access  Private (Instructors and admins)
router.get('/instructor/courses/:courseId', protect, async (req, res) => {
  try {
    // First verify the instructor owns the course or is admin
    const course = await mongoose.model('Course').findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (course.instructorId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this course progress'
      });
    }
    
    // Get all student progress for the course
    const progress = await CourseProgress.find({ courseId: req.params.courseId })
      .populate('userId', 'username email avatar')
      .sort({ lastAccessed: -1 });
    
    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress.map(p => ({
        userId: p.userId._id.toString(),
        username: p.userId.username,
        courseId: p.courseId.toString(),
        progress: p.progress,
        completed: p.completed,
        lastAccessed: p.lastAccessed
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course progress',
      error: error.message
    });
  }
});

module.exports = router;

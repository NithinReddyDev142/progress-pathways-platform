
const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Create Question schema and model
const QuestionSchema = new mongoose.Schema({
  courseId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: true
  },
  studentId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true,
  },
  answer: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  answeredAt: {
    type: Date
  }
});

const Question = mongoose.model('Question', QuestionSchema);

// @desc    Ask a question
// @route   POST /api/questions
// @access  Private (Students only)
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { courseId, question } = req.body;
    
    if (!courseId || !question) {
      return res.status(400).json({
        success: false,
        message: 'Please provide course ID and question'
      });
    }
    
    // Get the course to verify it exists and get teacher ID
    const course = await mongoose.model('Course').findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Create the question
    const newQuestion = await Question.create({
      courseId,
      studentId: req.user._id,
      studentName: req.user.username,
      teacherId: course.instructorId,
      question
    });
    
    // Populate course and teacher details
    await newQuestion.populate('courseId', 'title');
    await newQuestion.populate('teacherId', 'username');
    
    res.status(201).json({
      success: true,
      data: newQuestion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while creating question',
      error: error.message
    });
  }
});

// @desc    Get questions for a student
// @route   GET /api/questions/student
// @access  Private (Students only)
router.get('/student', protect, authorize('student'), async (req, res) => {
  try {
    // Get all questions asked by the student
    const questions = await Question.find({ studentId: req.user._id })
      .populate('courseId', 'title')
      .populate('teacherId', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
      error: error.message
    });
  }
});

// @desc    Get questions for a teacher
// @route   GET /api/questions/teacher
// @access  Private (Teachers only)
router.get('/teacher', protect, authorize('teacher'), async (req, res) => {
  try {
    // Get all questions directed to the teacher
    const questions = await Question.find({ teacherId: req.user._id })
      .populate('courseId', 'title')
      .populate('studentId', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching questions',
      error: error.message
    });
  }
});

// @desc    Get questions for a specific course
// @route   GET /api/questions/courses/:courseId
// @access  Private (Course instructor or admin)
router.get('/courses/:courseId', protect, async (req, res) => {
  try {
    // Get the course to verify access rights
    const course = await mongoose.model('Course').findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user is student enrolled in course, course instructor, or admin
    const isInstructor = course.instructorId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isStudent = req.user.role === 'student'; // AND is enrolled - add enrollment logic
    
    if (!isInstructor && !isAdmin && !isStudent) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access questions for this course'
      });
    }
    
    // Get questions for the course
    const questions = await Question.find({ courseId: req.params.courseId })
      .populate('studentId', 'username')
      .populate('teacherId', 'username')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course questions',
      error: error.message
    });
  }
});

// @desc    Answer a question
// @route   PUT /api/questions/:id
// @access  Private (Teachers only - must be the question's teacher)
router.put('/:id', protect, authorize('teacher'), async (req, res) => {
  try {
    const { answer } = req.body;
    
    if (!answer) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an answer'
      });
    }
    
    // Get the question
    let question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({
        success: false,
        message: 'Question not found'
      });
    }
    
    // Ensure the teacher is the one assigned to the question
    if (question.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to answer this question'
      });
    }
    
    // Update the answer and answeredAt timestamp
    question = await Question.findByIdAndUpdate(req.params.id, {
      answer,
      answeredAt: Date.now()
    }, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: question
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while answering question',
      error: error.message
    });
  }
});

module.exports = router;


const express = require('express');
const { protect } = require('../middleware/auth');
const mongoose = require('mongoose');

const router = express.Router();

// Create Notification schema and model
const NotificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Please add a message'],
    trim: true,
  },
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', NotificationSchema);

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ to: req.user._id })
      .populate('from', 'username avatar')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching notifications',
      error: error.message
    });
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let notification = await Notification.findById(req.params.id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    // Ensure the notification belongs to the current user
    if (notification.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this notification'
      });
    }
    
    notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    
    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating notification',
      error: error.message
    });
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { to: req.user._id, read: false },
      { read: true }
    );
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while updating notifications',
      error: error.message
    });
  }
});

// @desc    Send a notification
// @route   POST /api/notifications
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, message, to } = req.body;
    
    if (!title || !message || !to) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, message, and recipient (to)'
      });
    }
    
    // Check if recipient exists
    const recipient = await mongoose.model('User').findById(to);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient user not found'
      });
    }
    
    // Create notification
    const notification = await Notification.create({
      title,
      message,
      from: req.user._id,
      to
    });
    
    await notification.populate('from', 'username avatar');
    
    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while sending notification',
      error: error.message
    });
  }
});

module.exports = router;

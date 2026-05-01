const express = require('express');
const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get all notifications
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const notifications = await Notification.find({}).sort({ createdAt: -1 });
  res.json(notifications);
}));

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private/Admin
router.put('/:id/read', protect, admin, asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    notification.read = true;
    const updatedNotification = await notification.save();
    res.json(updatedNotification);
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
}));

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private/Admin
router.put('/read-all', protect, admin, asyncHandler(async (req, res) => {
  await Notification.updateMany({ read: false }, { read: true });
  res.json({ message: 'All notifications marked as read' });
}));

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (notification) {
    await notification.deleteOne();
    res.json({ message: 'Notification removed' });
  } else {
    res.status(404);
    throw new Error('Notification not found');
  }
}));

// @route   DELETE /api/notifications/all
// @desc    Delete all notifications
// @access  Private/Admin
router.delete('/all', protect, admin, asyncHandler(async (req, res) => {
  await Notification.deleteMany({});
  res.json({ message: 'All notifications removed' });
}));

module.exports = router;

const express = require('express');
const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// @route   GET /api/reviews
// @desc    Fetch all approved reviews
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
  res.json(reviews);
}));

// @route   GET /api/reviews/all
// @desc    Fetch all reviews (for admin)
// @access  Private/Admin
router.get('/all', protect, admin, asyncHandler(async (req, res) => {
  const reviews = await Review.find({}).sort({ createdAt: -1 });
  res.json(reviews);
}));

// @route   POST /api/reviews
// @desc    Create a new review (pending approval)
// @access  Public
router.post('/', upload.single('image'), asyncHandler(async (req, res) => {
  const { name, rating, comment } = req.body;

  const review = new Review({
    name,
    rating: Number(rating),
    comment,
    image: req.file ? req.file.path : undefined,
    approved: false // Admin must approve
  });

  const createdReview = await review.save();
  res.status(201).json(createdReview);
}));

// @route   PUT /api/reviews/:id/approve
// @desc    Approve/Reject review
// @access  Private/Admin
router.put('/:id/approve', protect, admin, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    review.approved = req.body.approved;
    const updatedReview = await review.save();
    res.json(updatedReview);
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
}));

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);

  if (review) {
    await review.deleteOne();
    res.json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
}));

module.exports = router;

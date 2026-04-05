const express = require('express');
const asyncHandler = require('express-async-handler');
const Portfolio = require('../models/Portfolio');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// @route   GET /api/portfolio
// @desc    Fetch all portfolio items
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const items = await Portfolio.find({});
  res.json(items);
}));

// @route   POST /api/portfolio
// @desc    Create a portfolio item
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
  const { title, category } = req.body;
  
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  const image = req.file.path;

  const newItem = new Portfolio({
    title,
    category,
    image,
    beforeImage: image, // Fallback for old code
    isBeforeAfter: false
  });

  const createdItem = await newItem.save();
  res.status(201).json(createdItem);
}));

// @route   DELETE /api/portfolio/:id
// @desc    Delete a portfolio item
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const item = await Portfolio.findById(req.params.id);

  if (item) {
    await item.deleteOne();
    res.json({ message: 'Portfolio item removed' });
  } else {
    res.status(404);
    throw new Error('Portfolio item not found');
  }
}));

module.exports = router;

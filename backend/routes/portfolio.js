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
router.post('/', protect, admin, upload.fields([
  { name: 'beforeImage', maxCount: 1 },
  { name: 'afterImage', maxCount: 1 }
]), asyncHandler(async (req, res) => {
  const { title, category, isBeforeAfter } = req.body;
  
  if (!req.files || !req.files['beforeImage']) {
    res.status(400);
    throw new Error('Before image is required');
  }

  const beforeImage = req.files['beforeImage'][0].path;
  const afterImage = req.files['afterImage'] ? req.files['afterImage'][0].path : undefined;

  const newItem = new Portfolio({
    title,
    category,
    beforeImage,
    afterImage,
    isBeforeAfter: isBeforeAfter === 'true' || isBeforeAfter === true
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

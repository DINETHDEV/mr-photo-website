const express = require('express');
const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/products
// @desc    Fetch all products
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true });
  res.json(products);
}));

// @route   GET /api/products/all
// @desc    Fetch all products including inactive (for admin)
// @access  Private/Admin
router.get('/all', protect, admin, asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
}));

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const { name, category, price, description } = req.body;

  const product = new Product({
    name,
    category,
    price,
    description
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
}));

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const { name, category, price, description, isActive } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.category = category || product.category;
    product.price = price || product.price;
    product.description = description || product.description;
    if (isActive !== undefined) product.isActive = isActive;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
}));

module.exports = router;

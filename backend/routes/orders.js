const express = require('express');
const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create a new order
// @access  Public
router.post('/', upload.single('uploadedImage'), asyncHandler(async (req, res) => {
  const { customerName, phone, address, serviceType, packageId, message, uploadedImage: bodyImage } = req.body;

  if (!customerName || !phone || !address || !serviceType) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  const order = new Order({
    customerName,
    phone,
    address,
    serviceType,
    packageId: packageId || undefined,
    message,
    uploadedImage: req.file ? req.file.path : bodyImage
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
}));

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('packageId', 'name price').sort({ createdAt: -1 });
  res.json(orders);
}));

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private/Admin
router.get('/:id', protect, admin, asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('packageId', 'name price');

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
}));

module.exports = router;

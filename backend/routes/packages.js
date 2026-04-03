const express = require('express');
const asyncHandler = require('express-async-handler');
const Package = require('../models/Package');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// @route   GET /api/packages
// @desc    Fetch all packages
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const packages = await Package.find({ isActive: true });
  res.json(packages);
}));

// @route   GET /api/packages/all
// @desc    Fetch all packages including inactive (for admin)
// @access  Private/Admin
router.get('/all', protect, admin, asyncHandler(async (req, res) => {
  const packages = await Package.find({});
  res.json(packages);
}));

// @route   POST /api/packages
// @desc    Create a package
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
  const { name, description, price, features } = req.body;
  
  if (!req.file) {
    res.status(400);
    throw new Error('Image is required');
  }

  // Parse features if they come as a JSON string
  let parsedFeatures = features;
  if (typeof features === 'string') {
    try {
      parsedFeatures = JSON.parse(features);
    } catch(e) {
      parsedFeatures = features.split(',').map(f => f.trim());
    }
  }

  const newPackage = new Package({
    name,
    description,
    price,
    features: parsedFeatures,
    image: req.file.path // Cloudinary URL
  });

  const createdPackage = await newPackage.save();
  res.status(201).json(createdPackage);
}));

// @route   PUT /api/packages/:id
// @desc    Update a package
// @access  Private/Admin
router.put('/:id', protect, admin, upload.single('image'), asyncHandler(async (req, res) => {
  const { name, description, price, features, isActive } = req.body;

  const pkg = await Package.findById(req.params.id);

  if (pkg) {
    pkg.name = name || pkg.name;
    pkg.description = description || pkg.description;
    pkg.price = price || pkg.price;
    if (isActive !== undefined) pkg.isActive = isActive;
    
    if (features) {
       let parsedFeatures = features;
       if (typeof features === 'string') {
         try {
           parsedFeatures = JSON.parse(features);
         } catch(e) {
           parsedFeatures = features.split(',').map(f => f.trim());
         }
       }
       pkg.features = parsedFeatures;
    }

    if (req.file) {
      pkg.image = req.file.path;
    }

    const updatedPackage = await pkg.save();
    res.json(updatedPackage);
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
}));

// @route   DELETE /api/packages/:id
// @desc    Delete a package
// @access  Private/Admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const pkg = await Package.findById(req.params.id);

  if (pkg) {
    await pkg.deleteOne();
    res.json({ message: 'Package removed' });
  } else {
    res.status(404);
    throw new Error('Package not found');
  }
}));

module.exports = router;

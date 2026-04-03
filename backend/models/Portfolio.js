const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true, // e.g., 'restoration', 'design', 'frames'
    trim: true
  },
  beforeImage: {
    type: String, // Cloudinary URL format required for comparison slider
    required: true
  },
  afterImage: {
    type: String, // Cloudinary URL
  },
  isBeforeAfter: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);

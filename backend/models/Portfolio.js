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
  image: {
    type: String, // Main masterpiece image
    required: true
  },
  beforeImage: {
    type: String, // Deprecated
  },
  afterImage: {
    type: String, // Deprecated
  },
  isBeforeAfter: {
    type: Boolean, // Deprecated
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);

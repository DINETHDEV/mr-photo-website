const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  image: {
    type: String // Optional customer image
  },
  approved: {
    type: Boolean,
    default: false // Requires admin approval to show on site
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);

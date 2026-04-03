const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true, // e.g., 'frame', 'printing', 'laminating', 'restoration'
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true
  },
  image: {
    type: String, // Cloudinary URL
  }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

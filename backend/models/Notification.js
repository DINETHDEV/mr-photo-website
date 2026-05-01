const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'review', 'system'],
    default: 'system'
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel',
    required: false
  },
  onModel: {
    type: String,
    enum: ['Order', 'Review'],
    required: false
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

module.exports = Notification;

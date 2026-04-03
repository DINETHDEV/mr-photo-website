const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected for reset'))
  .catch(err => console.error('MongoDB connection error:', err));

const resetAdmin = async () => {
  try {
    // Delete the existing admin if it exists
    await User.deleteOne({ email: 'mrphoto444@gmail.com' });
    console.log('🗑️ Old admin account removed (if existed)');

    // Create a fresh admin account
    const admin = await User.create({
      email: 'mrphoto444@gmail.com',
      password: 'adminpassword123',
      role: 'admin'
    });

    console.log('✅ Admin account completely reset!');
    console.log('Email:', admin.email);
    console.log('Password: adminpassword123');
    process.exit();
  } catch (error) {
    console.error('❌ Error resetting admin:', error);
    process.exit(1);
  }
};

resetAdmin();

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected for seeding'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: 'mrphoto444@gmail.com' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      process.exit();
    }

    const admin = await User.create({
      email: 'mrphoto444@gmail.com',
      password: 'adminpassword123', // Change this after first login
      role: 'admin'
    });

    console.log('✅ Admin user created successfully:', admin.email);
    console.log('⚠️ Please change the default password after deployment');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

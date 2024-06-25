const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
require('dotenv').config({ path: '/home/ubuntu/Documents/zvzsitev2/albion-zerg-manager/server/.env' });

const createAdmin = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const adminPassword = 'your_admin_password'; // Set the password you want to use here
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const newUser = new User({
      password: hashedPassword,
    });

    await newUser.save();
    console.log('Admin user created');
    mongoose.connection.close();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

createAdmin();

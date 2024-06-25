const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Make sure this is the correct path to your User model

exports.login = async (req, res) => {
  const { password } = req.body;

  try {
    // Fetch the admin user
    const adminUser = await User.findOne();
    if (!adminUser) {
      return res.status(404).json({ success: false, message: 'Admin user not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: adminUser._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ success: true, token });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

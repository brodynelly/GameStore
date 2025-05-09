const User = require('../models/User');

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && user.password === password) { // Note: In production, use proper password hashing
      res.json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email
        }
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User registration
exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user
    const user = new User({
      email,
      password // Note: In production, hash the password
    });

    const savedUser = await user.save();
    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: savedUser._id,
        email: savedUser.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
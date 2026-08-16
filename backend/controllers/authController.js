const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'hostel_management_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// @desc    Login user (Admin or Student)
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password').populate('room');

    if (user && (await user.matchPassword(password))) {
      const userObj = user.toObject();
      delete userObj.password;

      res.json({
        success: true,
        token: generateToken(user._id),
        user: userObj,
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('room');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update profile details
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phone = req.body.phone || user.phone;
    user.fatherName = req.body.fatherName || user.fatherName;
    user.fatherPhone = req.body.fatherPhone || user.fatherPhone;
    user.collegeName = req.body.collegeName || user.collegeName;
    user.course = req.body.course || user.course;
    user.semester = req.body.semester || user.semester;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;

    res.json({ success: true, message: 'Profile updated successfully', user: userObj });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { loginUser, getMe, updateProfile };

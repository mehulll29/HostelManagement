const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'student'],
      default: 'student',
    },
    phone: {
      type: String,
      default: '',
    },
    // Student-specific details
    rollNumber: {
      type: String,
      default: '',
    },
    collegeName: {
      type: String,
      default: 'Dharmsinh Desai University',
    },
    course: {
      type: String,
      default: 'MCA',
    },
    semester: {
      type: String,
      default: '1',
    },
    fatherName: {
      type: String,
      default: '',
    },
    fatherPhone: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      default: null,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

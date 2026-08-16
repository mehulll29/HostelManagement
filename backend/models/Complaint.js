const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Maintenance', 'Electrical', 'Plumbing', 'Cleanliness', 'Mess / Food', 'Internet / Wi-Fi', 'Other'],
      default: 'Maintenance',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'resolved'],
      default: 'pending',
    },
    resolutionNote: {
      type: String,
      default: '',
    },
    resolutionDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);

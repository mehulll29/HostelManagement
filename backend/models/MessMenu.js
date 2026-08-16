const mongoose = require('mongoose');

const messMenuSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
      unique: true,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    breakfast: {
      type: String,
      required: true,
      default: 'Poha, Tea / Coffee, Bread Butter',
    },
    lunch: {
      type: String,
      required: true,
      default: 'Roti, Dal, Rice, Sabzi, Salad',
    },
    snacks: {
      type: String,
      required: true,
      default: 'Samosa / Tea',
    },
    dinner: {
      type: String,
      required: true,
      default: 'Roti, Paneer Sabzi, Rice, Sweet',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('MessMenu', messMenuSchema);

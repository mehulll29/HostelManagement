const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
      trim: true,
    },
    block: {
      type: String,
      default: 'A Block',
    },
    type: {
      type: String,
      enum: ['AC', 'Non-AC'],
      default: 'Non-AC',
    },
    capacity: {
      type: Number,
      required: [true, 'Room capacity is required'],
      default: 2,
    },
    occupiedBeds: {
      type: Number,
      default: 0,
    },
    occupants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['available', 'full', 'maintenance'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Middleware to calculate status before save
roomSchema.pre('save', function (next) {
  if (this.occupiedBeds >= this.capacity) {
    this.status = 'full';
  } else if (this.status !== 'maintenance') {
    this.status = 'available';
  }
  next();
});

module.exports = mongoose.model('Room', roomSchema);

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    seats: {
      type: [String], // ["A1", "A2"]
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['card', 'upi', 'netbanking', 'wallet'],
      default: 'card',
    },
    paymentId: { type: String, default: null },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);

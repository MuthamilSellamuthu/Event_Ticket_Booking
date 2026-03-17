const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
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
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },
    seats: [String],
    qrCode: {
      type: String, // Base64 QR image
      required: true,
    },
    qrData: {
      type: String, // Raw QR string data
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
    issuedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);

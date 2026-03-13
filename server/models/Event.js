const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId: { type: String, required: true }, // e.g., "A1"
  isBooked: { type: Boolean, default: false },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: String,
      enum: ['Music', 'Sports', 'Tech', 'Arts', 'Food', 'Comedy', 'Other'],
      default: 'Other',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    endDate: { type: Date },
    venue: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalSeats: {
      type: Number,
      required: [true, 'Total seats is required'],
    },
    availableSeats: {
      type: Number,
    },
    seats: [seatSchema],
    rows: { type: Number, default: 5 },
    cols: { type: Number, default: 10 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [String],
  },
  { timestamps: true }
);

// Auto-generate seats before saving a new event
eventSchema.pre('save', function (next) {
  if (this.isNew && this.seats.length === 0) {
    const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const seats = [];
    for (let r = 0; r < this.rows; r++) {
      for (let c = 1; c <= this.cols; c++) {
        seats.push({ seatId: `${rowLabels[r]}${c}`, isBooked: false });
      }
    }
    this.seats = seats;
    this.totalSeats = seats.length;
    this.availableSeats = seats.length;
  }
  next();
});

module.exports = mongoose.model('Event', eventSchema);

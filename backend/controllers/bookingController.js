const Booking = require('../models/Booking');
const Event = require('../models/Event');
const { ticketsBookedCounter } = require('../utils/metrics');

// @desc    Create a booking (seats reserved, payment pending)
// @route   POST /api/bookings
exports.createBooking = async (req, res) => {
  try {
    const { eventId, seats } = req.body;
    const userId = req.user.id;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    // Check seats availability
    for (const seatId of seats) {
      const seat = event.seats.find((s) => s.seatId === seatId);
      if (!seat) return res.status(400).json({ success: false, message: `Seat ${seatId} does not exist` });
      if (seat.isBooked) return res.status(400).json({ success: false, message: `Seat ${seatId} is already booked` });
    }

    // Lock seats
    for (const seatId of seats) {
      const seat = event.seats.find((s) => s.seatId === seatId);
      seat.isBooked = true;
      seat.bookedBy = userId;
    }
    event.availableSeats -= seats.length;
    await event.save();

    const totalPrice = seats.length * event.price;

    const booking = await Booking.create({
      userId,
      eventId,
      seats,
      totalPrice,
      paymentStatus: 'pending',
    });

    // Track successfully booked tickets in Prometheus
    ticketsBookedCounter.inc(seats.length);

    res.status(201).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for a user
// @route   GET /api/bookings/user/:userId
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId })
      .populate('eventId', 'title date venue image category')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('eventId')
      .populate('userId', 'name email');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });

    // Release seats
    const event = await Event.findById(booking.eventId);
    if (event) {
      for (const seatId of booking.seats) {
        const seat = event.seats.find((s) => s.seatId === seatId);
        if (seat) { seat.isBooked = false; seat.bookedBy = null; }
      }
      event.availableSeats += booking.seats.length;
      await event.save();
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    res.json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

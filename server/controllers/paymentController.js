const Booking = require('../models/Booking');
const Ticket = require('../models/Ticket');
const { generateQRCode } = require('../utils/qrGenerator');
const { v4: uuidv4 } = require('uuid');

// @desc    Process payment and generate ticket
// @route   POST /api/payment
exports.processPayment = async (req, res) => {
  try {
    const { bookingId, paymentMethod = 'card' } = req.body;

    const booking = await Booking.findById(bookingId).populate('eventId').populate('userId', 'name email');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ success: false, message: 'Already paid' });
    }

    // Simulate payment processing (always succeeds in demo)
    await new Promise((resolve) => setTimeout(resolve, 800));

    const paymentId = `PAY-${uuidv4().slice(0, 12).toUpperCase()}`;

    // Update booking
    booking.paymentStatus = 'completed';
    booking.paymentMethod = paymentMethod;
    booking.paymentId = paymentId;
    await booking.save();

    // Generate ticket
    const ticketNumber = `TKT-${Date.now().toString(36).toUpperCase()}`;
    const qrData = JSON.stringify({
      ticketId: ticketNumber,
      bookingId: booking._id,
      userId: booking.userId._id,
      eventId: booking.eventId._id,
      eventTitle: booking.eventId.title,
      seats: booking.seats,
      totalPrice: booking.totalPrice,
      issuedAt: new Date().toISOString(),
    });

    const qrCode = await generateQRCode(qrData);

    const ticket = await Ticket.create({
      bookingId: booking._id,
      userId: booking.userId._id,
      eventId: booking.eventId._id,
      ticketNumber,
      seats: booking.seats,
      qrCode,
      qrData,
    });

    res.json({
      success: true,
      message: 'Payment successful! Ticket generated.',
      paymentId,
      ticket,
      booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const { protect } = require('../middleware/authMiddleware');

// Get ticket by booking ID
router.get('/booking/:bookingId', protect, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ bookingId: req.params.bookingId })
      .populate('eventId', 'title date venue image category')
      .populate('userId', 'name email');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all tickets for a user
router.get('/user/:userId', protect, async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId })
      .populate('eventId', 'title date venue image category')
      .sort({ createdAt: -1 });
    res.json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;

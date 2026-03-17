const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getBooking, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/user/:userId', protect, getUserBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;

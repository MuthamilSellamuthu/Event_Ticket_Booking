/**
 * Generate seat layout for an event
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns per row
 * @returns {Array} - Array of seat objects
 */
const generateSeats = (rows = 5, cols = 10) => {
  const rowLabels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const seats = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 1; c <= cols; c++) {
      seats.push({
        seatId: `${rowLabels[r]}${c}`,
        isBooked: false,
        bookedBy: null,
      });
    }
  }
  return seats;
};

/**
 * Check if requested seats are available
 * @param {Array} eventSeats - Event's seats array
 * @param {Array} requestedSeats - Seat IDs to check
 * @returns {{available: boolean, unavailable: string[]}}
 */
const checkSeatAvailability = (eventSeats, requestedSeats) => {
  const unavailable = [];
  for (const seatId of requestedSeats) {
    const seat = eventSeats.find((s) => s.seatId === seatId);
    if (!seat || seat.isBooked) unavailable.push(seatId);
  }
  return { available: unavailable.length === 0, unavailable };
};

module.exports = { generateSeats, checkSeatAvailability };

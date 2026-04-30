const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const client = require('prom-client');   // ⭐ ADD THIS

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ⭐ PROMETHEUS METRICS
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Import custom metrics
const { httpRequestCounter } = require('./utils/metrics');

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prometheus HTTP request tracking middleware
app.use((req, res, next) => {
  res.on('finish', () => {
    // Only track API requests, skip root or other assets if needed
    if (req.path.startsWith('/api')) {
      httpRequestCounter.inc({
        method: req.method,
        route: req.path,
        status_code: res.statusCode
      });
    }
  });
  next();
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EventPulse API is running 🎟️' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
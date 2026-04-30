const client = require('prom-client');

// Counter for all HTTP requests to the API
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests made to the API',
  labelNames: ['method', 'route', 'status_code'],
});

// Counter for tickets booked
const ticketsBookedCounter = new client.Counter({
  name: 'tickets_booked_total',
  help: 'Total number of tickets successfully booked',
});

// Counter for new events created
const eventsCreatedCounter = new client.Counter({
  name: 'events_created_total',
  help: 'Total number of events created in the system',
});

module.exports = {
  httpRequestCounter,
  ticketsBookedCounter,
  eventsCreatedCounter,
};

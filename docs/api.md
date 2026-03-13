# EventPulse API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected routes require `Authorization: Bearer <token>` header.

---

## Auth Endpoints

### POST /auth/register
Register a new user.

**Body:**
```json
{ "name": "John", "email": "john@example.com", "password": "pass123" }
```

**Response:**
```json
{ "success": true, "token": "jwt...", "user": { "id": "...", "name": "John", "email": "...", "role": "user" } }
```

---

### POST /auth/login
Login and receive JWT.

**Body:**
```json
{ "email": "john@example.com", "password": "pass123" }
```

---

### GET /auth/me *(protected)*
Get current user profile.

---

## Events Endpoints

### GET /events
List events with optional filters.

**Query params:** `category`, `city`, `search`, `page`, `limit`

### GET /events/:id
Get single event with full seat map.

### POST /events *(admin only)*
Create a new event.

**Body:**
```json
{
  "title": "Coldplay Tour",
  "description": "...",
  "category": "Music",
  "date": "2025-08-15T19:00:00Z",
  "venue": { "name": "DY Patil Stadium", "address": "...", "city": "Mumbai" },
  "price": 4999,
  "rows": 6,
  "cols": 12
}
```

---

## Bookings Endpoints

### POST /bookings *(protected)*
Create a booking (reserves seats).

**Body:**
```json
{ "eventId": "...", "seats": ["A1", "A2"] }
```

### GET /bookings/user/:userId *(protected)*
Get all bookings for a user.

### GET /bookings/:id *(protected)*
Get single booking.

### PUT /bookings/:id/cancel *(protected)*
Cancel a booking and release seats.

---

## Payment Endpoints

### POST /payment *(protected)*
Process payment and generate ticket.

**Body:**
```json
{ "bookingId": "...", "paymentMethod": "card" }
```

**Response:**
```json
{
  "success": true,
  "paymentId": "PAY-XXXXXXXXXXXX",
  "ticket": { ... },
  "booking": { ... }
}
```

---

## Tickets Endpoints

### GET /tickets/booking/:bookingId *(protected)*
Get ticket for a booking.

### GET /tickets/user/:userId *(protected)*
Get all tickets for a user.

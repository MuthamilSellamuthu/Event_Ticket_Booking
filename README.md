# 🎟️ EventPulse – Event Ticket Booking Platform

A full-stack event ticket booking platform built with React, Node.js/Express, and MongoDB.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, QRCode.react |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (JSON Web Tokens) |
| QR Code | qrcode (npm) |

## 📁 Project Structure

```
event-ticket-booking/
├── client/          # React Frontend
├── server/          # Node.js + Express Backend
├── database/        # DB seed scripts & schema docs
└── docs/            # API documentation
```

## ⚡ Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas URI)

### 1. Clone & Install

```bash
# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 2. Configure Environment

```bash
# In /server, create .env
cp .env.example .env
# Edit with your MongoDB URI and JWT secret
```

### 3. Seed Database (optional)

```bash
cd server
node utils/seed.js
```

### 4. Run Development Servers

```bash
# Terminal 1 – Backend (port 5000)
cd server && npm run dev

# Terminal 2 – Frontend (port 3000)
cd client && npm start
```

## 🔑 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT |

### Events
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings/user/:userId` | Get user's bookings |

### Payment
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/payment` | Process payment (simulation) |

## 🪑 Seat Selection

Seats are stored per event in a grid format (e.g., A1–E10). The backend marks selected seats as `booked` atomically to prevent double-booking.

## 🎫 QR Code Tickets

After successful payment, a QR code is generated containing:
```json
{
  "ticketId": "...",
  "userId": "...",
  "eventId": "...",
  "seats": ["A1", "A2"],
  "issuedAt": "2025-..."
}
```

## 🐳 Docker (Future)

```bash
docker-compose up --build
```

## 📄 License

MIT

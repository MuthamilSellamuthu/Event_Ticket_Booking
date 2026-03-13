# Database: event_ticket_db

## Collections

### users
```json
{
  "_id": "ObjectId",
  "name": "string (required, max 50)",
  "email": "string (required, unique, lowercase)",
  "password": "string (hashed, select:false)",
  "role": "enum['user','admin'] default:'user'",
  "avatar": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### events
```json
{
  "_id": "ObjectId",
  "title": "string (required, max 100)",
  "description": "string (required, max 2000)",
  "category": "enum['Music','Sports','Tech','Arts','Food','Comedy','Other']",
  "date": "Date (required)",
  "endDate": "Date",
  "venue": {
    "name": "string",
    "address": "string",
    "city": "string",
    "country": "string default:'India'"
  },
  "image": "string (URL)",
  "price": "number (required, min 0)",
  "totalSeats": "number",
  "availableSeats": "number",
  "seats": [{ "seatId": "string", "isBooked": "boolean", "bookedBy": "ObjectId|null" }],
  "rows": "number default:5",
  "cols": "number default:10",
  "isActive": "boolean default:true",
  "tags": ["string"],
  "createdBy": "ObjectId (ref User)",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### bookings
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (ref User, required)",
  "eventId": "ObjectId (ref Event, required)",
  "seats": ["string"],
  "totalPrice": "number (required)",
  "paymentStatus": "enum['pending','completed','failed','refunded'] default:'pending'",
  "paymentMethod": "enum['card','upi','netbanking','wallet'] default:'card'",
  "paymentId": "string|null",
  "status": "enum['active','cancelled'] default:'active'",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### tickets
```json
{
  "_id": "ObjectId",
  "bookingId": "ObjectId (ref Booking)",
  "userId": "ObjectId (ref User)",
  "eventId": "ObjectId (ref Event)",
  "ticketNumber": "string (unique)",
  "seats": ["string"],
  "qrCode": "string (base64 image)",
  "qrData": "string (raw QR JSON)",
  "isUsed": "boolean default:false",
  "issuedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## Indexes
- users: email (unique)
- events: date, category, isActive
- bookings: userId, eventId
- tickets: bookingId, ticketNumber (unique)

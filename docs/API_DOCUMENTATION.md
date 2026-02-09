# 📡 API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123",
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "role": "CUSTOMER" | "TRUCKER"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CUSTOMER"
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token"
}
```

### Trips

#### POST /trips
Create a new trip request (Customer only).

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "pickupLocation": "123 Main St, New York, NY",
  "pickupLat": 40.7128,
  "pickupLng": -74.0060,
  "dropoffLocation": "456 Oak Ave, Los Angeles, CA",
  "dropoffLat": 34.0522,
  "dropoffLng": -118.2437,
  "luggageDescription": "2 large suitcases",
  "luggageWeight": 50.5,
  "luggageDimensions": "24x18x12 inches"
}
```

**Response:**
```json
{
  "trip": {
    "id": "uuid",
    "status": "PENDING",
    ...
  },
  "potentialMatches": [
    {
      "route": { ... },
      "matchScore": 95.5,
      "pickupDistance": 2.3,
      "dropoffDistance": 1.7
    }
  ]
}
```

#### GET /trips
Get all trips for the authenticated user.

**Query Parameters:**
- `status` (optional): Filter by trip status

**Response:**
```json
[
  {
    "id": "uuid",
    "pickupLocation": "...",
    "dropoffLocation": "...",
    "status": "PENDING",
    "customer": { ... },
    "trucker": { ... },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /trips/:id
Get details of a specific trip.

**Response:**
```json
{
  "id": "uuid",
  "pickupLocation": "...",
  "dropoffLocation": "...",
  "status": "IN_TRANSIT",
  "customer": { ... },
  "trucker": { ... },
  "videos": [ ... ],
  "messages": [ ... ],
  "tracking": [ ... ]
}
```

#### POST /trips/:id/match
Match a trip with a route (Trucker only).

**Request Body:**
```json
{
  "routeId": "uuid"
}
```

**Response:**
```json
{
  "id": "uuid",
  "status": "MATCHED",
  ...
}
```

#### PATCH /trips/:id/status
Update trip status.

**Request Body:**
```json
{
  "status": "IN_TRANSIT" | "DELIVERED" | "CANCELLED"
}
```

### Routes

#### POST /routes
Create a new route (Trucker only).

**Request Body:**
```json
{
  "startLocation": "New York, NY",
  "startLat": 40.7128,
  "startLng": -74.0060,
  "endLocation": "Los Angeles, CA",
  "endLat": 34.0522,
  "endLng": -118.2437,
  "availableSpace": 500,
  "departureTime": "2024-01-15T10:00:00Z",
  "estimatedArrival": "2024-01-18T18:00:00Z"
}
```

**Response:**
```json
{
  "id": "uuid",
  "truckerId": "uuid",
  "startLocation": "...",
  "isActive": true,
  ...
}
```

#### GET /routes
Get all routes for the authenticated trucker.

**Response:**
```json
[
  {
    "id": "uuid",
    "startLocation": "...",
    "endLocation": "...",
    "availableSpace": 500,
    "departureTime": "...",
    "isActive": true
  }
]
```

### Videos

#### POST /videos/:tripId
Upload a verification video.

**Headers:** 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (Form Data):**
- `video`: Video file
- `type`: "PICKUP_TRUCKER" | "PICKUP_CUSTOMER" | "PICKUP_WITNESS" | "DROPOFF_TRUCKER" | "DROPOFF_RECEIVER" | "DROPOFF_WITNESS"

**Response:**
```json
{
  "id": "uuid",
  "tripId": "uuid",
  "type": "PICKUP_TRUCKER",
  "videoUrl": "https://...",
  "uploadedBy": "uuid",
  "createdAt": "..."
}
```

#### GET /videos/:tripId
Get all videos for a trip.

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "PICKUP_TRUCKER",
    "videoUrl": "https://...",
    "createdAt": "..."
  }
]
```

### Messages

#### GET /messages/:tripId
Get all messages for a trip.

**Response:**
```json
[
  {
    "id": "uuid",
    "tripId": "uuid",
    "senderId": "uuid",
    "sender": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "content": "Hello!",
    "mediaUrl": null,
    "isRead": false,
    "createdAt": "..."
  }
]
```

### Ratings

#### POST /ratings/:tripId
Rate a completed trip.

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Great service!"
}
```

**Response:**
```json
{
  "id": "uuid",
  "tripId": "uuid",
  "reviewerId": "uuid",
  "rating": 5,
  "comment": "Great service!",
  "createdAt": "..."
}
```

### User Profile

#### GET /users/profile
Get authenticated user's profile.

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER",
  "isVerified": true,
  "truckerProfile": { ... },
  "customerProfile": { ... }
}
```

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "phoneNumber": "+1234567890",
  "profileImage": "https://..."
}
```

#### PUT /users/trucker-profile
Update trucker profile (Trucker only).

**Request Body:**
```json
{
  "licenseNumber": "DL123456",
  "licenseExpiry": "2025-12-31",
  "vehicleType": "Semi-Truck",
  "vehiclePlate": "ABC123",
  "vehicleCapacity": 10000,
  "insuranceNumber": "INS789",
  "insuranceExpiry": "2025-12-31"
}
```

### Admin

#### GET /admin/users
Get all users (Admin only).

**Query Parameters:**
- `role` (optional): Filter by role
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

#### GET /admin/trips
Get all trips (Admin only).

**Query Parameters:**
- `status` (optional): Filter by status
- `page` (optional): Page number
- `limit` (optional): Items per page

#### GET /admin/statistics
Get platform statistics (Admin only).

**Response:**
```json
{
  "users": {
    "total": 1000,
    "truckers": 300,
    "customers": 700
  },
  "trips": {
    "total": 500,
    "pending": 50,
    "inTransit": 30,
    "delivered": 400,
    "disputed": 20
  },
  "revenue": {
    "total": 50000
  }
}
```

## WebSocket Events

Connect to: `ws://localhost:3000` with authentication token.

### Client -> Server

#### join-trip
```json
{
  "event": "join-trip",
  "data": "trip-id"
}
```

#### send-message
```json
{
  "event": "send-message",
  "data": {
    "tripId": "uuid",
    "content": "Hello!",
    "mediaUrl": null
  }
}
```

#### update-location
```json
{
  "event": "update-location",
  "data": {
    "tripId": "uuid",
    "latitude": 40.7128,
    "longitude": -74.0060
  }
}
```

### Server -> Client

#### new-message
```json
{
  "event": "new-message",
  "data": {
    "id": "uuid",
    "content": "Hello!",
    "sender": { ... }
  }
}
```

#### location-updated
```json
{
  "event": "location-updated",
  "data": {
    "latitude": 40.7128,
    "longitude": -74.0060,
    "timestamp": "..."
  }
}
```

## Error Responses

All endpoints may return these error formats:

```json
{
  "error": "Error message"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

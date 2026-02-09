# 🚀 Quick Start Guide

Get the Trucker Carriage Platform up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (or use Docker)
- Text editor

## Option 1: Docker (Easiest) 🐳

```bash
# Start everything with Docker
docker-compose up

# Access the apps:
# - Backend API: http://localhost:3000
# - Customer Web: http://localhost:3001
# - PostgreSQL: localhost:5432
```

That's it! Skip to "Using the Platform" section below.

## Option 2: Manual Setup 🔧

### Step 1: Install Dependencies

```bash
# From project root
npm install
```

### Step 2: Configure Backend

```bash
cd apps/backend

# Copy environment file
cp .env.example .env

# Edit .env and set:
# - DATABASE_URL (PostgreSQL connection string)
# - JWT_SECRET (any random string)
# - AWS credentials (or skip video uploads for now)
```

### Step 3: Setup Database

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Step 4: Install Frontend Dependencies

```bash
cd ../customer-web
npm install
```

### Step 5: Start Development Servers

```bash
# Terminal 1: Backend
cd apps/backend
npm run dev

# Terminal 2: Frontend
cd apps/customer-web
npm run dev
```

## Using the Platform

### 1. Register as a Customer

1. Open http://localhost:3001
2. Click "Register"
3. Fill in the form:
   - Email: test@example.com
   - Password: password123
   - First Name: John
   - Last Name: Doe
   - Role: CUSTOMER
4. Click "Register"

### 2. Create a Trip

1. Click "Create New Trip"
2. Fill in the form:
   - **Pickup Location**: "123 Main St, New York, NY"
   - **Pickup Coordinates**: Lat: 40.7128, Lng: -74.0060
   - **Dropoff Location**: "456 Oak Ave, Los Angeles, CA"
   - **Dropoff Coordinates**: Lat: 34.0522, Lng: -118.2437
   - **Luggage Description**: "2 large suitcases"
   - **Weight**: 50 lbs
   - **Dimensions**: "24x18x12 inches"
3. Click "Create Trip Request"
4. View potential matching truckers!

### 3. Register as a Trucker

1. Open a new incognito/private window
2. Go to http://localhost:3001/register
3. Register with role: TRUCKER
4. Update your trucker profile with:
   - License number
   - Vehicle information
   - Insurance details

### 4. Create a Route (as Trucker)

Using the API (use Postman or curl):

```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startLocation": "New York, NY",
    "startLat": 40.7128,
    "startLng": -74.0060,
    "endLocation": "Los Angeles, CA",
    "endLat": 34.0522,
    "endLng": -118.2437,
    "availableSpace": 500,
    "departureTime": "2024-02-15T10:00:00Z",
    "estimatedArrival": "2024-02-18T18:00:00Z"
  }'
```

## Testing the Features

### Test Video Upload

```bash
# Upload a pickup video (replace TRIP_ID and TOKEN)
curl -X POST http://localhost:3000/api/videos/TRIP_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "video=@/path/to/video.mp4" \
  -F "type=PICKUP_TRUCKER"
```

### Test Real-time Chat

Open browser console on the trip details page:
```javascript
// Messages will appear in real-time when sent
```

### Test Ratings

After a trip is delivered:
```bash
curl -X POST http://localhost:3000/api/ratings/TRIP_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great service!"
  }'
```

## Useful Commands

```bash
# View backend logs
cd apps/backend
npm run dev

# View database with Prisma Studio
cd apps/backend
npx prisma studio

# Run tests
npm test

# Build for production
npm run build

# Lint code
npm run lint
```

## API Testing with curl

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get Profile
```bash
curl http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get All Trips
```bash
curl http://localhost:3000/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000 | xargs kill -9

# Find process using port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Check credentials are correct

### Prisma Client Error
```bash
cd apps/backend
npx prisma generate
```

### Dependencies Not Installing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

1. **Read the docs**:
   - [API Documentation](./docs/API_DOCUMENTATION.md)
   - [Safety Guidelines](./docs/SAFETY_GUIDELINES.md)
   - [Deployment Guide](./docs/DEPLOYMENT.md)

2. **Explore the code**:
   - Backend controllers: `apps/backend/src/controllers/`
   - Frontend pages: `apps/customer-web/src/pages/`
   - Database schema: `apps/backend/prisma/schema.prisma`

3. **Add features**:
   - Build the trucker mobile app
   - Implement payment processing
   - Add identity verification
   - Create admin dashboard

4. **Deploy to production**:
   - See [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## Getting Help

- 📚 Full documentation in `/docs` folder
- 🐛 Found a bug? Check existing issues
- 💡 Have an idea? Open a discussion
- 📧 Email: support@truckercarriage.com

## Demo Credentials

For testing, you can use these sample coordinates:

**Major US Cities**:
- New York: 40.7128, -74.0060
- Los Angeles: 34.0522, -118.2437
- Chicago: 41.8781, -87.6298
- Houston: 29.7604, -95.3698
- Phoenix: 33.4484, -112.0740
- Philadelphia: 39.9526, -75.1652

**Pro Tip**: Use real coordinates from Google Maps for testing the matching algorithm!

---

Happy coding! 🚚✨

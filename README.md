# 🚚 Trucker Carriage Platform

A comprehensive platform connecting truckers with customers for luggage carriage during "deadhead" miles (empty return trips). Built with a focus on safety, transparency, and trust.

## 🌟 Features

### Three Main Interfaces

1. **Customer Web App** - Post luggage requests and track shipments
2. **Trucker Mobile App** - Find loads along routes and manage deliveries
3. **Admin Panel** - Monitor compliance, safety videos, and resolve disputes

### Core Capabilities

- **Route-Based Matching Algorithm** - Intelligent matching of customer requests with trucker routes
- **Real-Time GPS Tracking** - Live location updates with geofencing notifications
- **Video Verification System** - Digital chain of custody with mandatory videos at pickup/dropoff
- **In-App Communication** - Secure chat with media sharing between truckers and customers
- **Escrow Payments** - Funds held securely and released upon successful delivery
- **Two-Way Rating System** - Build trust through verified user ratings
- **Compliance Badges** - Display verified ID, insurance, and background checks

## 🏗️ Architecture

This is a monorepo built with:

- **Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL
- **Customer Web**: React + TypeScript + Vite + Tailwind CSS
- **Trucker Mobile**: React Native + Expo (to be added)
- **Admin Panel**: React + TypeScript (to be added)
- **Real-time**: Socket.IO for chat and live tracking
- **Storage**: AWS S3 for video storage
- **Maps**: Google Maps API integration

## 📦 Project Structure

```
trucker-carriage-platform/
├── apps/
│   ├── backend/              # Node.js API server
│   ├── customer-web/         # Customer web application
│   ├── trucker-mobile/       # Trucker mobile app (future)
│   └── admin-panel/          # Admin dashboard (future)
├── packages/                 # Shared packages (future)
├── docs/                     # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- AWS account (for S3 storage)
- Google Maps API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd trucker-carriage-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up the database**
   ```bash
   cd apps/backend
   cp .env.example .env
   # Edit .env with your database credentials
   npm run migrate
   ```

4. **Start development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend API on http://localhost:3000
   - Customer Web on http://localhost:3001

## 🔐 Environment Variables

### Backend (.env)

```env
DATABASE_URL="postgresql://user:password@localhost:5432/trucker_platform"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="trucker-platform-videos"

# Google Maps
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Stripe (payments)
STRIPE_SECRET_KEY="your-stripe-secret-key"

# Onfido (identity verification)
ONFIDO_API_TOKEN="your-onfido-api-token"
```

## 📱 Safety Protocol

### Video Verification Workflow

#### Pickup (Start of Trip)
1. **Trucker Video**: Film the product being loaded and its condition
2. **Customer Video**: Film trucker's ID/plate and product inside truck
3. **Witness Video** (Optional): Third-party confirmation

#### Drop-off (End of Trip)
1. **Trucker Video**: Film unloading and product condition
2. **Receiver Video**: Film receipt and confirm item is intact
3. **Witness Video** (Optional): Delivery confirmation

Videos are stored securely in AWS S3 and linked to trips for dispute resolution.

## 🔄 Trip Flow

1. **Customer** creates a trip request with pickup/dropoff locations
2. **System** matches request with available trucker routes
3. **Trucker** accepts the match
4. **Both parties** record pickup videos
5. **Status** changes to "In Transit" with live GPS tracking
6. **Trucker** delivers and both record dropoff videos
7. **Escrow** releases payment
8. **Both parties** rate each other

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run backend tests
cd apps/backend
npm run test
```

## 🏗️ Building for Production

```bash
# Build all apps
npm run build

# Start production server
cd apps/backend
npm start
```

## 📊 Database Schema

Key models:
- **User** - Base user authentication and profile
- **TruckerProfile** - License, vehicle, insurance details
- **CustomerProfile** - Customer-specific data
- **Route** - Trucker's planned routes with available space
- **Trip** - Luggage carriage requests and assignments
- **Video** - Safety verification videos
- **Message** - In-app chat messages
- **TrackingUpdate** - GPS location history
- **Rating** - Two-way feedback system

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- HTTPS only in production
- Video storage with private ACL
- Rate limiting on API endpoints
- Input validation on all routes
- SQL injection prevention via Prisma

## 📈 Future Enhancements

- [ ] React Native mobile app for truckers
- [ ] Admin dashboard for platform management
- [ ] Push notifications for trip updates
- [ ] Integration with Stripe for payments
- [ ] Integration with Onfido for identity verification
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
- [ ] Insurance integration
- [ ] Route optimization algorithms

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For questions or issues, please contact support@truckercarriage.com

---

Built with ❤️ to revolutionize the trucking industry and maximize asset utilization.

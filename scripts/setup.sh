#!/bin/bash

echo "🚚 Setting up Trucker Carriage Platform..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Setup backend
echo "🔧 Setting up backend..."
cd apps/backend

if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp .env.example .env
    echo "⚠️  Please edit apps/backend/.env with your configuration"
fi

npm install

echo "🗄️  Generating Prisma client..."
npx prisma generate

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit apps/backend/.env with your database and API keys"
echo "2. Set up PostgreSQL database"
echo "3. Run: npm run migrate (from apps/backend)"
echo "4. Run: npm run dev (from root directory)"
echo ""
echo "📚 For more information, see README.md"

# 🚀 Deployment Guide

This guide covers deploying the Trucker Carriage Platform to production.

## Prerequisites

- Domain name configured
- SSL certificate
- PostgreSQL database (managed service recommended)
- AWS account with S3 bucket configured
- Google Maps API key
- Stripe account (for payments)
- Onfido account (for identity verification)

## Production Environment Variables

### Backend (.env.production)

```env
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@db-host:5432/trucker_platform"

# Security
JWT_SECRET="generate-a-secure-random-string-min-32-chars"
CORS_ORIGIN="https://yourapp.com,https://admin.yourapp.com"

# AWS S3
AWS_ACCESS_KEY_ID="your-production-aws-key"
AWS_SECRET_ACCESS_KEY="your-production-aws-secret"
AWS_REGION="us-east-1"
S3_BUCKET_NAME="trucker-platform-videos-prod"

# Google Maps
GOOGLE_MAPS_API_KEY="your-production-google-maps-key"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Onfido
ONFIDO_API_TOKEN="live_..."
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### 1. Build Production Images

```bash
# Build backend
cd apps/backend
docker build -t trucker-platform-backend:latest -f Dockerfile.prod .

# Build customer web
cd ../customer-web
docker build -t trucker-platform-customer-web:latest -f Dockerfile.prod .
```

#### 2. Create docker-compose.prod.yml

```yaml
version: '3.8'

services:
  backend:
    image: trucker-platform-backend:latest
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "3000:3000"
    restart: always

  customer-web:
    image: trucker-platform-customer-web:latest
    ports:
      - "80:80"
    restart: always
    depends_on:
      - backend

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - /etc/letsencrypt:/etc/letsencrypt
    ports:
      - "443:443"
    restart: always
```

#### 3. Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Option 2: AWS Deployment

#### Backend on AWS Elastic Beanstalk

1. Install EB CLI:
```bash
pip install awsebcli
```

2. Initialize:
```bash
cd apps/backend
eb init -p node.js trucker-platform-backend
```

3. Create environment:
```bash
eb create trucker-platform-backend-prod
```

4. Deploy:
```bash
eb deploy
```

#### Frontend on AWS S3 + CloudFront

1. Build:
```bash
cd apps/customer-web
npm run build
```

2. Upload to S3:
```bash
aws s3 sync dist/ s3://your-bucket-name
```

3. Configure CloudFront distribution

### Option 3: Heroku Deployment

#### Backend

```bash
cd apps/backend
heroku create trucker-platform-backend
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

#### Frontend

```bash
cd apps/customer-web
heroku create trucker-platform-customer-web
heroku buildpacks:set heroku/nodejs
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - Backend: Node.js app
   - Frontend: Static site
3. Set environment variables
4. Deploy

## Database Migration

Run migrations on production:

```bash
cd apps/backend
npx prisma migrate deploy
```

## SSL/TLS Configuration

### Using Let's Encrypt

```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d yourapp.com -d api.yourapp.com

# Configure nginx
sudo nano /etc/nginx/sites-available/trucker-platform
```

Example nginx configuration:

```nginx
server {
    listen 443 ssl;
    server_name api.yourapp.com;

    ssl_certificate /etc/letsencrypt/live/yourapp.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourapp.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Set up PM2 for Process Management

```bash
npm install -g pm2

# Start backend
cd apps/backend
pm2 start npm --name "trucker-backend" -- start

# Save process list
pm2 save

# Setup startup script
pm2 startup
```

### Logging with PM2

```bash
# View logs
pm2 logs trucker-backend

# Monitor
pm2 monit
```

### Application Monitoring

Consider using:
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking
- **DataDog**: Infrastructure monitoring

## Backup Strategy

### Database Backups

```bash
# Automated daily backups
0 2 * * * pg_dump -h db-host -U user trucker_platform > /backups/db_$(date +\%Y\%m\%d).sql
```

### S3 Bucket Versioning

Enable versioning on your S3 bucket:
```bash
aws s3api put-bucket-versioning \
  --bucket trucker-platform-videos-prod \
  --versioning-configuration Status=Enabled
```

## Security Checklist

- [ ] Environment variables secured
- [ ] HTTPS/SSL enabled
- [ ] Database access restricted to backend only
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Security headers configured (helmet.js)
- [ ] Regular dependency updates
- [ ] Firewall rules configured
- [ ] Secrets rotated regularly
- [ ] Backup strategy implemented

## Performance Optimization

### Backend

1. **Enable compression**
```javascript
app.use(compression());
```

2. **Add caching**
```javascript
const redis = require('redis');
const client = redis.createClient();
```

3. **Database connection pooling**
```javascript
// Already configured in Prisma
```

### Frontend

1. **Enable CDN** (CloudFront, Cloudflare)
2. **Optimize images**
3. **Enable gzip compression**
4. **Lazy load components**

## Scaling

### Horizontal Scaling

```bash
# Using PM2 cluster mode
pm2 start app.js -i max
```

### Load Balancing

Configure AWS ALB or nginx load balancer:

```nginx
upstream backend {
    server backend1:3000;
    server backend2:3000;
    server backend3:3000;
}

server {
    location / {
        proxy_pass http://backend;
    }
}
```

### Database Scaling

- Enable read replicas
- Implement connection pooling
- Add Redis cache layer

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and test
        run: |
          npm install
          npm run build
          npm test
      
      - name: Deploy to production
        run: |
          # Your deployment script
```

## Health Checks

Add health check endpoint:

```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

## Rollback Strategy

```bash
# Using PM2
pm2 save
pm2 reload all

# Using Docker
docker-compose down
docker-compose up -d --force-recreate

# Using git tags
git tag v1.0.0
git push origin v1.0.0
```

## Post-Deployment Verification

1. Check health endpoints
2. Test user authentication
3. Create test trip
4. Verify video uploads
5. Test real-time chat
6. Check database connections
7. Monitor error logs
8. Verify SSL certificate

## Troubleshooting

### Common Issues

**Issue**: Database connection timeout
**Solution**: Check security groups, connection string, database status

**Issue**: Video uploads failing
**Solution**: Verify S3 bucket permissions, check AWS credentials

**Issue**: WebSocket connection fails
**Solution**: Ensure WebSocket support in load balancer/nginx

## Support

For production issues:
- Emergency: +1-800-TRUCKER
- Email: devops@truckercarriage.com
- Slack: #production-support

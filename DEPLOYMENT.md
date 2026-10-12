# Deployment Guide

## Quick Deploy to Production

### 1. MongoDB Atlas Setup
\`\`\`bash
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Network Access: Add 0.0.0.0/0
4. Database Access: Create user
5. Copy connection string
\`\`\`

### 2. Backend Deployment (Railway)
\`\`\`bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# In backend folder
cd backend
railway init
railway up

# Add environment variables in Railway dashboard
\`\`\`

### 3. Frontend Deployment (Vercel)
\`\`\`bash
# Install Vercel CLI
npm install -g vercel

# In frontend folder
cd frontend
npm run build
vercel --prod
\`\`\`

### 4. Environment Variables

#### Railway (Backend)
Add these in Railway dashboard:
- NODE_ENV=production
- MONGO_URI=your_atlas_connection_string
- JWT_SECRET=generate_strong_secret
- TWILIO_* (your credentials)
- EMAIL_* (your credentials)
- ALLOWED_COUNTRIES=IN

#### Vercel (Frontend)
- REACT_APP_API_URL=your_railway_backend_url/api

### 5. DNS & Domain (Optional)
- Point domain to Vercel (frontend)
- Point api.domain to Railway (backend)
- Enable HTTPS (automatic on both platforms)

### 6. Post-Deployment Checks
\`\`\`bash
# Test health endpoint
curl https://your-backend.railway.app/health

# Test OTP request
curl -X POST https://your-backend.railway.app/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber":"9876543210"}'
\`\`\`

## Alternative Platforms

### Backend
- Heroku: git push heroku main
- DigitalOcean App Platform
- AWS Elastic Beanstalk

### Frontend
- Netlify: netlify deploy --prod
- GitHub Pages (static only)
- Cloudflare Pages

### Database
- MongoDB Atlas (recommended)
- Self-hosted MongoDB on DigitalOcean
- AWS DocumentDB

## Monitoring & Logs
- Railway: Built-in logs dashboard
- Vercel: Analytics & logs dashboard
- MongoDB Atlas: Database monitoring

## Cost Estimates (Free Tier)
- MongoDB Atlas: 512MB Free
- Railway: $5/month (500 hours free)
- Vercel: Unlimited for personal projects

Deployment complete! 🚀

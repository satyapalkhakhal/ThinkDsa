# 🚀 Production Deployment Guide

Complete guide to deploy THINKSCOPE to production with MongoDB Atlas.

## 📋 Prerequisites

- MongoDB Atlas account (free tier available)
- GitHub account
- Hosting platform account (Render/Railway/Heroku)

## Part 1: MongoDB Atlas Setup (5 minutes)

### Quick Setup Steps:

1. **Create Account**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)

2. **Create Free Cluster**:
   - Click "Build a Database"
   - Select **M0 FREE** tier
   - Choose region closest to your users
   - Click "Create"

3. **Create Database User**:
   - Go to "Database Access"
   - Add user with username/password
   - Save credentials securely!

4. **Whitelist IP**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Select "Allow Access from Anywhere" (0.0.0.0/0)

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/thinkscope?retryWrites=true&w=majority
   ```

📖 **Detailed guide**: See [MONGODB_ATLAS_SETUP.md](./MONGODB_ATLAS_SETUP.md)

## Part 2: Backend Setup (Local Testing)

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env file
nano .env
```

Update with your MongoDB Atlas connection string:

```env
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/thinkscope?retryWrites=true&w=majority
JWT_SECRET=your_generated_secret_here
NODE_ENV=production
```

**Generate secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Test Connection

```bash
node test-connection.js
```

Expected output:
```
✅ MongoDB Connected Successfully!
📊 Database Name: thinkscope
🌐 Host: cluster0.xxxxx.mongodb.net
```

### 4. Seed Database

```bash
node seed.js
```

### 5. Start Server

```bash
npm run dev
```

Test: http://localhost:5000/health

## Part 3: Deploy Backend

### Option A: Render.com (Recommended - Free)

1. **Push to GitHub**:
   ```bash
   cd /path/to/ThinkDsa
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/thinkscope.git
   git push -u origin main
   ```

2. **Create Render Service**:
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: thinkscope-api
     - **Root Directory**: `backend`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

3. **Add Environment Variables**:
   - Click "Environment" tab
   - Add:
     - `MONGODB_URI` = your Atlas connection string
     - `JWT_SECRET` = your generated secret
     - `NODE_ENV` = production
     - `PORT` = 5000

4. **Deploy**: Click "Create Web Service"

5. **Get API URL**: `https://thinkscope-api.onrender.com`

### Option B: Railway.app

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add environment variables
railway variables set MONGODB_URI="your_connection_string"
railway variables set JWT_SECRET="your_secret"
railway variables set NODE_ENV="production"

# Deploy
railway up
```

### Option C: Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Login
heroku login

# Create app
cd backend
heroku create thinkscope-api

# Set environment variables
heroku config:set MONGODB_URI="your_connection_string"
heroku config:set JWT_SECRET="your_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main

# Open
heroku open
```

## Part 4: Deploy Frontend

### Update API URL

Edit `dsa-tracker/src/config/api.js` (create if doesn't exist):

```javascript
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://thinkscope-api.onrender.com/api'
  : 'http://localhost:5000/api';
```

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd dsa-tracker
vercel

# Follow prompts
# Production URL: https://thinkscope.vercel.app
```

### Deploy to Netlify

```bash
# Build
cd dsa-tracker
npm run build

# Deploy via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

## Part 5: Post-Deployment

### 1. Test API Endpoints

```bash
# Health check
curl https://thinkscope-api.onrender.com/health

# Register user
curl -X POST https://thinkscope-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 2. Update MongoDB Atlas Security

- Go to Network Access
- Remove "0.0.0.0/0" (allow all)
- Add specific IPs of your hosting platform

### 3. Monitor Application

**MongoDB Atlas**:
- Database → Metrics
- Monitor connections, operations, storage

**Render/Railway**:
- Check logs for errors
- Monitor resource usage

### 4. Set Up Custom Domain (Optional)

**Render**:
- Settings → Custom Domain
- Add your domain
- Update DNS records

## 🔒 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] MongoDB Atlas user has strong password
- [ ] `.env` file not committed to Git
- [ ] IP whitelist configured (not 0.0.0.0/0 in production)
- [ ] CORS configured for your frontend domain
- [ ] Environment variables set on hosting platform
- [ ] HTTPS enabled (automatic on Render/Vercel)

## 📊 Environment Variables Summary

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/thinkscope?retryWrites=true&w=majority
JWT_SECRET=<32+ character random string>
JWT_EXPIRE=7d
NODE_ENV=production
```

### Frontend
```env
VITE_API_URL=https://your-api-url.com/api
```

## 🆘 Troubleshooting

### Backend won't start
- Check logs on hosting platform
- Verify environment variables are set
- Test MongoDB connection string locally

### Frontend can't connect to API
- Check CORS settings in backend
- Verify API URL in frontend config
- Check browser console for errors

### Database connection fails
- Verify connection string format
- Check IP whitelist in Atlas
- Ensure database user exists

## 📈 Scaling Tips

### Free Tier Limits
- **MongoDB Atlas M0**: 512 MB storage
- **Render Free**: 750 hours/month, sleeps after 15 min inactivity
- **Vercel**: 100 GB bandwidth/month

### When to Upgrade
- Storage > 400 MB → Upgrade MongoDB to M10
- Frequent cold starts → Upgrade Render to paid tier
- High traffic → Consider dedicated hosting

## ✅ Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Database seeded with initial data
- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] API endpoints tested
- [ ] User registration/login working
- [ ] Problem tracking functional
- [ ] Environment variables secured
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up

## 🎉 Success!

Your THINKSCOPE app is now live!

**Backend**: https://thinkscope-api.onrender.com  
**Frontend**: https://thinkscope.vercel.app

---

**Need Help?**
- Backend issues: Check server logs
- Database issues: MongoDB Atlas support
- Deployment: Platform-specific documentation

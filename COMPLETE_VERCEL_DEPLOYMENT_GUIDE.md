# Complete Vercel Deployment Guide for THINKSCOPE

## Overview

This guide documents the complete solution for deploying a full-stack MERN application (MongoDB, Express, React, Node.js) to Vercel with a custom domain.

---

## Project Structure

```
ThinkDsa/
├── dsa-tracker/
│   ├── src/                    # React frontend
│   ├── backend/                # Express backend
│   ├── vercel.json            # Frontend Vercel config
│   └── package.json
└── vercel.json                 # Root config (optional)
```

---

## Part 1: Frontend Deployment

### 1.1 Create Frontend Vercel Configuration

**File**: `ThinkDsa/vercel.json`

```json
{
  "buildCommand": "cd dsa-tracker && npm install && npm run build",
  "outputDirectory": "dsa-tracker/dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**Purpose**:
- `buildCommand`: Navigates to frontend directory and builds the app
- `outputDirectory`: Points to Vite's output directory
- `rewrites`: Handles React Router by serving index.html for all routes (SPA routing)
- `headers`: Adds cache headers for static assets

### 1.2 Create API Configuration

**File**: `dsa-tracker/src/config/api.js`

```javascript
// API Configuration
export const API_BASE_URL = import.meta.env.PROD
    ? 'https://your-backend.vercel.app/api'  // Production backend URL
    : 'http://localhost:5000/api';            // Development URL

export default API_BASE_URL;
```

### 1.3 Update Components to Use API Config

Replace all hardcoded `localhost:5000` URLs with the config:

```javascript
// Before
const response = await fetch('http://localhost:5000/api/auth/login', {

// After
import { API_BASE_URL } from '../config/api';
const response = await fetch(`${API_BASE_URL}/auth/login`, {
```

**Files to update**:
- `src/pages/Login.jsx`
- `src/pages/Signup.jsx`
- `src/pages/Dashboard.jsx`

### 1.4 Deploy Frontend

```bash
cd dsa-tracker
vercel --prod
```

Or connect via Vercel Dashboard and it will auto-deploy from GitHub.

---

## Part 2: Backend Deployment

### 2.1 Create Backend Vercel Configuration

**File**: `dsa-tracker/backend/vercel.json`

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Purpose**:
- Configures Express app to run as serverless function
- Routes all requests to server.js
- Sets production environment

### 2.2 Configure CORS for Production

**File**: `dsa-tracker/backend/server.js`

```javascript
// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        console.log('🔍 CORS Request from origin:', origin);
        
        // Allow requests with no origin (mobile apps, curl)
        if (!origin) {
            console.log('✅ Allowing request with no origin');
            return callback(null, true);
        }
        
        const allowedOrigins = [
            'http://localhost:5173',           // Local development
            'http://localhost:3000',           // Alternative local port
            'https://thinkscope.in',           // Production custom domain
            'https://www.thinkscope.in',       // Production with www
            'https://thinkscope.vercel.app',   // Vercel domain
            /\.vercel\.app$/,                  // Any Vercel preview deployments
        ];
        
        // Check if origin is allowed
        const isAllowed = allowedOrigins.some(allowed => {
            if (typeof allowed === 'string') {
                return origin === allowed;
            }
            // For regex patterns
            return allowed.test(origin);
        });
        
        if (isAllowed) {
            console.log('✅ CORS allowed for origin:', origin);
            callback(null, true);
        } else {
            console.warn('❌ CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
```

### 2.3 Deploy Backend

```bash
cd dsa-tracker/backend
vercel login
vercel --prod
```

### 2.4 Add Environment Variables

After deployment, add environment variables via CLI or Dashboard:

**Via CLI**:
```bash
vercel env add MONGODB_URI production
# Enter value when prompted

vercel env add JWT_SECRET production
# Enter value when prompted

vercel env add JWT_EXPIRE production
# Enter: 7d

vercel env add NODE_ENV production
# Enter: production
```

**Via Dashboard**:
1. Go to project settings
2. Navigate to Environment Variables
3. Add each variable for Production environment

**Required Variables**:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_secure_secret_key_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=production
```

### 2.5 Redeploy to Apply Environment Variables

```bash
vercel --prod
```

---

## Part 3: Critical Configuration

### 3.1 Disable Vercel Deployment Protection

**IMPORTANT**: This is the most common issue causing "Network error"

1. Go to: `https://vercel.com/[your-username]/backend/settings/deployment-protection`
2. Find "Vercel Authentication" or "Deployment Protection"
3. **Disable it** or set to "Off"
4. Save changes

**Why**: Vercel's deployment protection blocks all API requests with an authentication page, preventing your frontend from accessing the backend.

### 3.2 Update Frontend with Backend URL

After backend deployment, get the production URL and update:

**File**: `dsa-tracker/src/config/api.js`

```javascript
export const API_BASE_URL = import.meta.env.PROD
    ? 'https://backend-xxxxx.vercel.app/api'  // Your actual backend URL
    : 'http://localhost:5000/api';
```

Commit and push:
```bash
git add src/config/api.js
git commit -m "Update backend URL"
git push origin main
```

Vercel will auto-deploy the frontend with the new URL.

---

## Part 4: Testing

### 4.1 Test Backend Health

```bash
curl https://your-backend.vercel.app/health
```

Expected response:
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-02-06T12:30:00.000Z"
}
```

### 4.2 Test Frontend

1. Visit your production URL: `https://thinkscope.in`
2. Open browser DevTools (F12)
3. Try to sign up or log in
4. Check Console and Network tabs for errors

---

## Common Issues & Solutions

### Issue 1: "Network error. Please check if backend is running"

**Cause**: Backend has Vercel deployment protection enabled

**Solution**: Disable deployment protection in Vercel dashboard

---

### Issue 2: CORS Error

**Cause**: Backend CORS not configured for your domain

**Solution**: Add your domain to `allowedOrigins` in `server.js`:
```javascript
const allowedOrigins = [
    'https://your-domain.com',
    // ... other origins
];
```

---

### Issue 3: 404 NOT_FOUND on Frontend

**Cause**: Vercel doesn't know where to find the app

**Solution**: Ensure `vercel.json` exists in root with correct `buildCommand` and `outputDirectory`

---

### Issue 4: Backend Environment Variables Not Working

**Cause**: Variables not set or backend not redeployed after adding them

**Solution**:
1. Verify variables exist in Vercel dashboard
2. Redeploy backend: `vercel --prod`

---

### Issue 5: MongoDB Connection Failed

**Cause**: Incorrect connection string or IP whitelist

**Solution**:
1. Verify `MONGODB_URI` is correct
2. In MongoDB Atlas, whitelist `0.0.0.0/0` (allow all IPs)
3. Check database user credentials

---

## Complete Deployment Checklist

### Frontend
- [ ] Created `vercel.json` in root
- [ ] Created `src/config/api.js`
- [ ] Replaced all hardcoded localhost URLs
- [ ] Deployed to Vercel
- [ ] Custom domain configured (optional)

### Backend
- [ ] Created `backend/vercel.json`
- [ ] Configured CORS for production domains
- [ ] Deployed to Vercel
- [ ] Added all environment variables
- [ ] Redeployed after adding env vars
- [ ] **Disabled deployment protection**
- [ ] Tested `/health` endpoint

### Integration
- [ ] Updated frontend with backend URL
- [ ] Pushed changes to GitHub
- [ ] Frontend auto-redeployed
- [ ] Tested signup/login on production
- [ ] No CORS or network errors

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│           User Browser                          │
│         https://thinkscope.in                   │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP Requests
                 ▼
┌─────────────────────────────────────────────────┐
│         Vercel Frontend (React)                 │
│         - Serves static files                   │
│         - SPA routing via rewrites              │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 │ (with CORS headers)
                 ▼
┌─────────────────────────────────────────────────┐
│      Vercel Backend (Express Serverless)        │
│         - Handles API requests                  │
│         - JWT authentication                    │
│         - CORS configured                       │
└────────────────┬────────────────────────────────┘
                 │
                 │ Database Queries
                 ▼
┌─────────────────────────────────────────────────┐
│           MongoDB Atlas                         │
│         - Cloud database                        │
│         - IP whitelist: 0.0.0.0/0              │
└─────────────────────────────────────────────────┘
```

---

## Environment-Specific Behavior

### Development (Local)
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API calls: `http://localhost:5000/api`
- CORS: Allows localhost origins

### Production (Vercel)
- Frontend: `https://thinkscope.in`
- Backend: `https://backend-xxxxx.vercel.app`
- API calls: `https://backend-xxxxx.vercel.app/api`
- CORS: Allows production domains

The `API_BASE_URL` automatically switches based on `import.meta.env.PROD`.

---

## Security Best Practices

1. **Generate Strong JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Never Commit `.env` Files**:
   - Add to `.gitignore`
   - Use environment variables in Vercel

3. **Restrict CORS Origins**:
   - Only allow specific domains
   - Remove wildcard patterns in production

4. **MongoDB Security**:
   - Use strong passwords
   - Restrict IP whitelist (not 0.0.0.0/0 in production)
   - Enable MongoDB Atlas encryption

5. **Environment Variables**:
   - Store sensitive data in Vercel env vars
   - Never hardcode secrets in code

---

## Maintenance

### Updating Backend
```bash
cd dsa-tracker/backend
git pull origin main
vercel --prod
```

### Updating Frontend
```bash
cd dsa-tracker
git pull origin main
# Vercel auto-deploys from GitHub
```

### Viewing Logs
```bash
# Backend logs
vercel logs https://your-backend.vercel.app

# Frontend logs
vercel logs https://thinkscope.in
```

---

## Support Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Express on Vercel**: https://vercel.com/guides/using-express-with-vercel
- **MongoDB Atlas**: https://www.mongodb.com/docs/atlas/
- **CORS Guide**: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS

---

## Summary

This deployment solution provides:
- ✅ Full-stack app on Vercel
- ✅ Serverless backend with Express
- ✅ React SPA with client-side routing
- ✅ MongoDB Atlas integration
- ✅ CORS configuration
- ✅ Environment-specific API URLs
- ✅ Custom domain support

**Key Success Factor**: Disabling Vercel deployment protection on the backend is critical for the frontend to access the API.

# MongoDB Atlas Setup Guide

## 🌐 Setting Up MongoDB Atlas (Cloud Database)

### Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create a Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier (512 MB storage, perfect for development)
3. Select your preferred **Cloud Provider** (AWS, Google Cloud, or Azure)
4. Choose a **Region** closest to your users (e.g., Mumbai for India)
5. Name your cluster (e.g., "ThinkScope-Cluster")
6. Click **"Create"**

### Step 3: Create Database User

1. Go to **Database Access** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `thinkscope-admin` (or your choice)
5. Password: Generate a strong password (save it!)
6. Database User Privileges: **"Read and write to any database"**
7. Click **"Add User"**

### Step 4: Whitelist IP Addresses

1. Go to **Network Access** (left sidebar)
2. Click **"Add IP Address"**
3. For development: Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ For production, add specific IP addresses of your servers
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **Database** (left sidebar)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. Copy the connection string:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Update Your .env File

Replace the connection string in your `.env` file:

```env
# Local MongoDB (comment out)
# MONGODB_URI=mongodb://localhost:27017/thinkscope

# MongoDB Atlas (production)
MONGODB_URI=mongodb+srv://thinkscope-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/thinkscope?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with your actual database user password
- Replace `cluster0.xxxxx` with your actual cluster address
- Add `/thinkscope` before the `?` to specify database name

### Step 7: Test Connection

```bash
cd backend
npm install
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected to MongoDB Atlas!')).catch(err => console.error('❌ Connection failed:', err));"
```

### Step 8: Seed Database

```bash
node seed.js
```

You should see:
```
✅ Connected to MongoDB
🗑️  Cleared existing data
👤 Created sample user
📚 Created topics
📝 Created problems for Arrays & Hashing
✅ Created sample progress
🎉 Database seeded successfully!
```

### Step 9: Start Server

```bash
npm run dev
```

Server should connect to MongoDB Atlas successfully!

## 🚀 Production Deployment Checklist

### Environment Variables

Create `.env` file on your production server:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/thinkscope?retryWrites=true&w=majority
JWT_SECRET=use_a_very_strong_random_secret_here_min_32_chars
JWT_EXPIRE=7d
NODE_ENV=production
```

**Generate secure JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Security Best Practices

1. **Never commit `.env` to Git**
   - Already in `.gitignore`
   - Use environment variables on hosting platform

2. **Whitelist specific IPs in MongoDB Atlas**
   - Remove "0.0.0.0/0" (allow all)
   - Add your server's IP address

3. **Use strong passwords**
   - Database user password: 16+ characters
   - JWT secret: 32+ characters

4. **Enable MongoDB Atlas Monitoring**
   - Set up alerts for unusual activity
   - Monitor connection limits

### Deployment Platforms

#### Option 1: Render.com (Recommended - Free Tier)

1. Push code to GitHub
2. Go to [Render.com](https://render.com)
3. Create **"New Web Service"**
4. Connect GitHub repository
5. Settings:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Environment:** Add all `.env` variables
6. Deploy!

#### Option 2: Railway.app

1. Go to [Railway.app](https://railway.app)
2. **"New Project"** → **"Deploy from GitHub"**
3. Select repository
4. Add environment variables
5. Deploy!

#### Option 3: Heroku

```bash
# Install Heroku CLI
heroku login
heroku create thinkscope-api

# Set environment variables
heroku config:set MONGODB_URI="your_atlas_uri"
heroku config:set JWT_SECRET="your_secret"
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## 📊 MongoDB Atlas Dashboard Features

### 1. Metrics
- Monitor database performance
- Track connection count
- View operation statistics

### 2. Collections
- Browse your data
- Run queries directly
- Export/import data

### 3. Indexes
- View all indexes
- Check index usage
- Optimize performance

### 4. Backups
- Automatic daily backups (M10+ clusters)
- Point-in-time recovery
- Download backups

### 5. Alerts
- Set up email alerts
- Monitor disk usage
- Connection limits

## 🔍 Verify Your Setup

### Check Database Connection

```javascript
// test-connection.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Atlas Connected!');
    console.log('📊 Database:', mongoose.connection.name);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name).join(', '));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    process.exit(1);
  }
};

testConnection();
```

Run: `node test-connection.js`

## 🆘 Troubleshooting

### Error: "Authentication failed"
- Check username and password in connection string
- Verify database user exists in Atlas
- Password should be URL-encoded (replace special chars)

### Error: "IP not whitelisted"
- Add your IP in Network Access
- Or use 0.0.0.0/0 for development

### Error: "Connection timeout"
- Check internet connection
- Verify firewall settings
- Try different region

### Error: "Database name not specified"
- Add `/thinkscope` in connection string before `?`
- Example: `...mongodb.net/thinkscope?retryWrites=true`

## 💰 Pricing Tiers

| Tier | Storage | RAM | Price |
|------|---------|-----|-------|
| M0 (Free) | 512 MB | Shared | $0/month |
| M10 | 10 GB | 2 GB | $57/month |
| M20 | 20 GB | 4 GB | $140/month |

**Free tier is perfect for:**
- Development
- Small projects
- Learning
- MVP/Prototypes

## 📝 Connection String Format

```
mongodb+srv://<username>:<password>@<cluster-url>/<database>?<options>
```

**Example:**
```
mongodb+srv://thinkscope-admin:MyP%40ssw0rd@cluster0.abc123.mongodb.net/thinkscope?retryWrites=true&w=majority
```

**URL Encoding Special Characters:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`

## ✅ Final Checklist

- [ ] MongoDB Atlas account created
- [ ] Free M0 cluster deployed
- [ ] Database user created with strong password
- [ ] IP address whitelisted
- [ ] Connection string copied
- [ ] `.env` file updated with Atlas URI
- [ ] Connection tested successfully
- [ ] Database seeded with sample data
- [ ] Server running and connected
- [ ] `.env` added to `.gitignore`
- [ ] Ready for production deployment!

## 🎯 Next Steps

1. Test all API endpoints with Atlas
2. Deploy backend to hosting platform
3. Update frontend API URL
4. Deploy frontend
5. Monitor Atlas dashboard for performance

---

**Need Help?**
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Connection String Guide](https://docs.mongodb.com/manual/reference/connection-string/)
- [Node.js Driver Docs](https://docs.mongodb.com/drivers/node/)

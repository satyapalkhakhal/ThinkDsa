# 🚀 Render.com Deployment Guide

## Step-by-Step Deployment Instructions

### ✅ Prerequisites Checklist
- [x] MongoDB Atlas connected and working
- [x] Backend running locally on port 5000
- [x] Sample data seeded
- [ ] GitHub account
- [ ] Code pushed to GitHub
- [ ] Render.com account

---

## Part 1: Push to GitHub (5 minutes)

### Step 1: Initialize Git Repository

```bash
cd /home/satyapal/Desktop/ThinkDsa
git init
git add .
git commit -m "Initial commit - THINKSCOPE DSA Tracker with MongoDB Atlas"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `thinkscope` (or your choice)
3. Description: "DSA Problem Tracker with React + Node.js + MongoDB"
4. **Keep it Public** (or Private if you prefer)
5. **DO NOT** initialize with README (we already have code)
6. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
# Copy the commands from GitHub's "push an existing repository" section
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/thinkscope.git
git push -u origin main
```

**Verify:** Refresh GitHub page - you should see all your code!

---

## Part 2: Deploy Backend to Render (10 minutes)

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with **GitHub** (easiest option)
4. Authorize Render to access your repositories

### Step 2: Create Web Service

1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Connect your `thinkscope` repository
   - If you don't see it, click "Configure account" and grant access
4. Click **"Connect"** next to your repository

### Step 3: Configure Service

Fill in these settings:

**Basic Settings:**
- **Name**: `thinkscope-api` (or your choice)
- **Region**: Choose closest to you (e.g., Singapore, Frankfurt)
- **Branch**: `main`
- **Root Directory**: `backend` ⚠️ **IMPORTANT!**
- **Runtime**: `Node`

**Build & Deploy:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (0$/month)

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section.

Click **"Add Environment Variable"** and add these **one by one**:

1. **Key**: `MONGODB_URI`  
   **Value**: `mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/thinkscope?retryWrites=true&w=majority`
   
   ⚠️ Copy from your `.env` file!

2. **Key**: `JWT_SECRET`  
   **Value**: Your JWT secret from `.env`

3. **Key**: `NODE_ENV`  
   **Value**: `production`

4. **Key**: `PORT`  
   **Value**: `5000`

### Step 5: Deploy!

1. Click **"Create Web Service"** (bottom of page)
2. Wait 2-3 minutes while Render builds and deploys
3. Watch the logs - you should see:
   ```
   ✅ MongoDB Connected
   🚀 Server running on port 5000
   ```

### Step 6: Get Your API URL

Once deployed, you'll see:
```
Your service is live at https://thinkscope-api.onrender.com
```

**Copy this URL!** You'll need it for the frontend.

### Step 7: Test Your Deployed API

```bash
# Health check
curl https://thinkscope-api.onrender.com/health

# Login test
curl -X POST https://thinkscope-api.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex@example.com","password":"password123"}'
```

You should get a JWT token back! ✅

---

## Part 3: Deploy Frontend to Vercel (5 minutes)

### Step 1: Update Frontend API URL

Create `dsa-tracker/src/config/api.js`:

```javascript
export const API_BASE_URL = import.meta.env.PROD 
  ? 'https://thinkscope-api.onrender.com/api'
  : 'http://localhost:5000/api';
```

Update your components to import and use this URL.

### Step 2: Commit Changes

```bash
git add .
git commit -m "Add production API URL"
git push
```

### Step 3: Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
cd dsa-tracker
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- Project name? `thinkscope`
- Directory? `./` (press Enter)
- Override settings? **N**

**Your app is live!** 🎉

URL: `https://thinkscope.vercel.app`

---

## 🔧 Troubleshooting

### Backend Issues

**"Application failed to respond"**
- Check Render logs for errors
- Verify MONGODB_URI is correct
- Ensure all environment variables are set

**"Cannot connect to MongoDB"**
- Check MongoDB Atlas IP whitelist (should include 0.0.0.0/0)
- Verify connection string format
- Check database user credentials

**"Module not found"**
- Ensure `package.json` is in `backend/` directory
- Check Build Command is `npm install`
- Verify Root Directory is set to `backend`

### Frontend Issues

**"Failed to fetch"**
- Check API URL in `api.js`
- Verify CORS is enabled in backend
- Check browser console for errors

**"Network Error"**
- Backend might be sleeping (free tier)
- Wait 30 seconds and try again
- Check if backend URL is correct

---

## 📊 Render Dashboard Features

### Logs
- View real-time server logs
- Debug errors
- Monitor requests

### Metrics
- CPU usage
- Memory usage
- Request count

### Settings
- Update environment variables
- Change instance type
- Configure custom domain

---

## 🎯 Post-Deployment Checklist

- [ ] Backend deployed successfully
- [ ] Health endpoint returns 200
- [ ] Login endpoint works
- [ ] MongoDB Atlas connected
- [ ] Frontend deployed
- [ ] Frontend can call backend API
- [ ] User can register/login
- [ ] Problems load correctly
- [ ] Progress tracking works

---

## 🔒 Security Recommendations

### For Production:

1. **Update MongoDB Atlas IP Whitelist**
   - Remove 0.0.0.0/0
   - Add Render's IP addresses
   - Go to Render → Settings → Get outbound IPs

2. **Update CORS**
   Edit `backend/server.js`:
   ```javascript
   app.use(cors({
     origin: 'https://thinkscope.vercel.app',
     credentials: true
   }));
   ```

3. **Environment Variables**
   - Never commit `.env` to Git ✅ (already in .gitignore)
   - Use strong JWT secret (32+ chars)
   - Rotate secrets periodically

---

## 💡 Tips

### Free Tier Limitations

**Render Free:**
- Sleeps after 15 min inactivity
- Wakes up in ~30 seconds on first request
- 750 hours/month (enough for 24/7)

**Solutions:**
- Use a cron job to ping every 14 minutes
- Upgrade to paid tier ($7/month) for no sleep

### Auto-Deploy

Render automatically redeploys when you push to GitHub!

```bash
# Make changes
git add .
git commit -m "Update feature"
git push

# Render will auto-deploy in 2-3 minutes
```

### Custom Domain

1. Render → Settings → Custom Domain
2. Add your domain (e.g., `api.thinkscope.com`)
3. Update DNS records as shown
4. SSL certificate auto-generated

---

## 🆘 Need Help?

**Render Issues:**
- Check logs in Render dashboard
- Render Discord: https://discord.gg/render

**MongoDB Issues:**
- MongoDB Atlas support
- Check connection string format

**General Issues:**
- Check GitHub repository
- Review deployment logs
- Test locally first

---

## ✅ Success Criteria

Your deployment is successful when:

1. ✅ Backend URL returns health check
2. ✅ Login returns JWT token
3. ✅ Frontend loads without errors
4. ✅ Can register new user
5. ✅ Can view problems
6. ✅ Can toggle problem completion
7. ✅ Progress persists after refresh

---

**🎉 Congratulations! Your THINKSCOPE app is live on the internet!**

**Backend**: https://thinkscope-api.onrender.com  
**Frontend**: https://thinkscope.vercel.app

Share your project with the world! 🚀

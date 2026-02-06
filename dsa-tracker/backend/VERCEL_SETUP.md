# Backend Vercel Configuration

## Important Notes

Your backend has been configured for Vercel serverless deployment with `vercel.json`.

## What You Need to Do

1. **Get your backend Vercel URL**
   - Go to your Vercel dashboard
   - Find your backend deployment
   - Copy the URL (e.g., `https://your-backend-name.vercel.app`)

2. **Update Frontend API Configuration**
   - Edit `dsa-tracker/src/config/api.js`
   - Replace `https://thinkscope-api.onrender.com/api` with your actual backend Vercel URL
   - Example: `https://thinkscope-backend.vercel.app/api`

3. **Set Environment Variables on Vercel**
   - Go to your backend project on Vercel
   - Settings → Environment Variables
   - Add these variables:
     ```
     MONGODB_URI=mongodb+srv://khakhalsatyapal:tKSmeJx6PyEUlIpt@cluster0.1y0c5dp.mongodb.net/?appName=Cluster0
     JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
     JWT_EXPIRE=7d
     NODE_ENV=production
     ```

4. **Redeploy Backend**
   - After adding environment variables
   - Trigger a new deployment

## Testing

Test your backend at: `https://your-backend-url.vercel.app/health`

You should see:
```json
{
  "success": true,
  "message": "Server is running"
}
```

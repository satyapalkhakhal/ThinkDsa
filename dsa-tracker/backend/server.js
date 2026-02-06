import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import problemRoutes from './routes/problemRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import topicRoutes from './routes/topicRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// CORS Configuration
const corsOptions = {
    origin: function (origin, callback) {
        console.log('🔍 CORS Request from origin:', origin);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            console.log('✅ Allowing request with no origin');
            return callback(null, true);
        }

        const allowedOrigins = [
            'http://localhost:5173',           // Local development
            'http://localhost:3000',           // Alternative local port
            'https://thinkscope.vercel.app',   // Production Vercel domain
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
            // TEMPORARY: Allow all origins for debugging
            console.log('⚠️  TEMPORARILY allowing blocked origin for debugging');
            callback(null, true);
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api', problemRoutes);
app.use('/api/progress', progressRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

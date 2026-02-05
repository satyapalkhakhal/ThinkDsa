# THINKSCOPE Backend API

Production-grade Node.js + Express + MongoDB backend for DSA problem tracking.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret

# Seed database with sample data
node seed.js

# Start development server
npm run dev

# Start production server
npm start
```

## 📋 Prerequisites

- Node.js 16+
- MongoDB 5.0+ (local or Atlas)

## 🗄️ Database Models

### User
```javascript
{
  name: String,
  email: String (unique, indexed),
  password: String (hashed with bcrypt),
  createdAt: Date
}
```

### Topic
```javascript
{
  title: String (unique),
  description: String,
  icon: String,
  order: Number (indexed),
  createdAt: Date
}
```

### Problem
```javascript
{
  topicId: ObjectId (ref: Topic, indexed),
  title: String,
  difficulty: Enum ['EASY', 'MEDIUM', 'HARD'] (indexed),
  links: {
    youtube: String,
    leetcode: String,
    article: String
  },
  description: String,
  order: Number,
  createdAt: Date
}
```

**Indexes:**
- `{ topicId: 1, difficulty: 1 }` - Compound index
- `{ topicId: 1, order: 1 }` - Compound index

### Progress
```javascript
{
  userId: ObjectId (ref: User, indexed),
  problemId: ObjectId (ref: Problem, indexed),
  isCompleted: Boolean,
  completedAt: Date,
  notes: String,
  createdAt: Date
}
```

**Critical Indexes:**
- `{ userId: 1, problemId: 1 }` - **UNIQUE** compound index (prevents duplicates)
- `{ userId: 1, isCompleted: 1 }` - For user stats queries

## 🔐 Authentication

All protected routes require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

Token is returned on login/register and contains `userId`.

## 📡 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** Same as register

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Problems

#### Get Problems by Topic (with solved status)
```http
GET /api/topics/:topicId/problems
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
      "topicId": "65f1a2b3c4d5e6f7g8h9i0j2",
      "title": "Two Sum",
      "difficulty": "EASY",
      "description": "Find two numbers that add up to target.",
      "links": {
        "leetcode": "https://leetcode.com/problems/two-sum/",
        "youtube": "https://www.youtube.com/watch?v=...",
        "article": "https://www.geeksforgeeks.org/two-sum/"
      },
      "order": 1,
      "isCompleted": true,
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "_id": "65f1a2b3c4d5e6f7g8h9i0j3",
      "title": "Contains Duplicate",
      "difficulty": "EASY",
      "isCompleted": false,
      ...
    }
  ]
}
```

**Key Feature:** Uses MongoDB aggregation to fetch all problems with `isCompleted` field based on logged-in user's progress. **No N+1 queries!**

#### Get Single Problem
```http
GET /api/problems/:problemId
Authorization: Bearer <token>
```

### Progress

#### Toggle Problem Completion
```http
POST /api/progress/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
  "problemId": "65f1a2b3c4d5e6f7g8h9i0j1"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "problemId": "65f1a2b3c4d5e6f7g8h9i0j1",
    "isCompleted": true,
    "completedAt": "2024-01-15T14:30:00.000Z"
  }
}
```

**Logic:**
- If progress exists → toggle `isCompleted`
- If not exists → create with `isCompleted = true`

#### Get User Statistics
```http
GET /api/progress/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "completed": 145,
    "attempted": 200,
    "percentage": 73
  }
}
```

#### Get Topic Progress
```http
GET /api/progress/topic/:topicId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "topicId": "65f1a2b3c4d5e6f7g8h9i0j2",
    "completed": 8,
    "total": 35,
    "percentage": 24
  }
}
```

## ⚡ Performance Optimizations

### 1. Compound Indexes
```javascript
// Progress model - prevents duplicates and speeds up queries
{ userId: 1, problemId: 1 } - UNIQUE

// Problem model - efficient filtering
{ topicId: 1, difficulty: 1 }
{ topicId: 1, order: 1 }
```

### 2. MongoDB Aggregation
The `GET /api/topics/:topicId/problems` endpoint uses aggregation pipeline:

```javascript
[
  { $match: { topicId } },
  { $sort: { order: 1 } },
  { $lookup: { /* join with progress */ } },
  { $addFields: { isCompleted } },
  { $project: { /* clean output */ } }
]
```

**Benefits:**
- Single database query
- No N+1 problem
- Efficient memory usage
- Scalable for large datasets

### 3. Password Hashing
- Uses bcrypt with salt rounds = 10
- Password never returned in queries (select: false)

## 🔒 Security Features

- JWT authentication with expiry
- Password hashing with bcrypt
- Input validation
- CORS enabled
- Environment variables for secrets
- Unique indexes prevent duplicate entries

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Register, login, getMe
│   ├── problemController.js # Get problems with solved status
│   └── progressController.js # Toggle, stats, topic progress
├── middleware/
│   └── auth.js              # JWT verification
├── models/
│   ├── User.js              # User schema
│   ├── Topic.js             # Topic schema
│   ├── Problem.js           # Problem schema
│   └── Progress.js          # Progress schema (critical!)
├── routes/
│   ├── authRoutes.js
│   ├── problemRoutes.js
│   └── progressRoutes.js
├── .env.example
├── package.json
├── seed.js                  # Database seeder
└── server.js                # Express app entry point
```

## 🧪 Testing with Sample Data

After running `node seed.js`, use these credentials:

**Email:** alex@example.com  
**Password:** password123

The seed script creates:
- 1 sample user
- 6 topics
- 7 problems for "Arrays & Hashing"
- 3 completed problems for the user

## 🎯 Interview-Ready Explanations

### Why compound index on userId + problemId?
"To ensure data integrity and query performance. The unique constraint prevents duplicate progress entries, and the compound index allows MongoDB to efficiently query user progress without scanning the entire collection."

### How do you avoid N+1 queries?
"I use MongoDB aggregation with $lookup to join problems with user progress in a single query. This returns all problems with their completion status in one database round-trip, avoiding the N+1 problem where we'd query progress for each problem individually."

### Why separate Progress collection?
"Normalization and scalability. Instead of embedding progress in User or Problem documents, a separate collection allows efficient querying, prevents document bloat, and scales better as users solve more problems."

## 🚨 Error Handling

All endpoints return consistent error format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error (dev only)"
}
```

## 📝 Environment Variables

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/thinkscope
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=development
```

## 🔄 Workflow

1. User registers/logs in → receives JWT token
2. Frontend stores token in localStorage
3. All API requests include token in Authorization header
4. Backend verifies token → sets `req.user.id`
5. Queries use `req.user.id` to fetch user-specific data
6. Progress is restored on login automatically

## 📊 Sample MongoDB Queries

```javascript
// Get user's completed problems count
db.progresses.countDocuments({ 
  userId: ObjectId("..."), 
  isCompleted: true 
})

// Get all problems with user progress (aggregation)
db.problems.aggregate([
  { $match: { topicId: ObjectId("...") } },
  { $lookup: { from: "progresses", ... } }
])
```

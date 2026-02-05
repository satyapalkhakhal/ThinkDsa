# THINKSCOPE

A modern React application for tracking Data Structures and Algorithms practice progress.

## Tech Stack

- **React.js** (v18.2.0) - Functional components
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool

## Project Structure

```
dsa-tracker/
├── src/
│   ├── components/
│   │   ├── Badge.jsx          # Reusable badge component
│   │   ├── BottomNav.jsx      # Bottom navigation bar
│   │   ├── Button.jsx         # Reusable button component
│   │   ├── Card.jsx           # Reusable card component
│   │   ├── ProblemCard.jsx    # Problem display card
│   │   ├── ProgressBar.jsx    # Progress indicator
│   │   └── TopicCard.jsx      # Topic display card
│   ├── data/
│   │   └── mockData.js        # Static mock data
│   ├── pages/
│   │   ├── Dashboard.jsx      # Main dashboard (/dashboard)
│   │   ├── Login.jsx          # Login page (/login)
│   │   └── TopicDetail.jsx    # Topic problems view (/topic/:id)
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # React entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.js
```

## Features

### Pages

1. **Login Page** (`/login`)
   - Email/password form
   - Remember me checkbox
   - Redirects to dashboard on submit

2. **Dashboard** (`/dashboard`)
   - User greeting and stats
   - Search functionality
   - Solved problems counter with daily increase
   - Streak tracker
   - Topics list with progress bars
   - Bottom navigation
   - Floating action button

3. **Topic Detail** (`/topic/:id`)
   - Topic overview with progress
   - Difficulty filters (All, Easy, Medium, Hard)
   - Problems grouped by category
   - Problem cards with checkbox toggles
   - Resource icons (Note, Solution, Video)

### Components

- **Button** - Variants: primary, secondary, outline
- **Badge** - Difficulty levels and status indicators
- **Card** - Container with optional hover effect
- **ProgressBar** - Customizable color and height
- **TopicCard** - Topic summary with navigation
- **ProblemCard** - Interactive problem display with completion toggle
- **BottomNav** - Fixed bottom navigation with active states

## Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Routes

- `/` - Redirects to `/login`
- `/login` - Login page
- `/dashboard` - Main dashboard
- `/topic/:id` - Topic detail page

## Behavior

- **Checkbox Toggle**: Click to mark problems as completed/incomplete
- **Progress Updates**: Visual progress bars update based on completion
- **Hover Effects**: Cards and buttons have smooth hover transitions
- **Responsive**: Mobile-first design

## Mock Data

All data is static and stored in `src/data/mockData.js`:
- 6 topics with varying progress
- 7 problems for Arrays & Hashing topic
- User profile with stats

## Customization

To add more topics or problems, edit `src/data/mockData.js`:

```javascript
export const topics = [
  {
    id: 1,
    name: "Topic Name",
    icon: "emoji or text",
    iconBg: "bg-color-50",
    iconColor: "text-color-600",
    totalProblems: 35,
    solvedProblems: 8,
    progress: 24,
    progressColor: "bg-color-600"
  }
];
```

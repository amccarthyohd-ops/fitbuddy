# FitBuddy - Fitness Tracker

A web app to track your weight loss journey with up to 15 accountability buddies. Built with Claude AI.

**Live App:** https://fitbuddy-1-thn8.onrender.com

---

## Features

### Tracking
- **Weight Tracking** - Log daily weight, see progress over time
- **Food Logging** - Search foods with auto-fill nutrition (calories, protein, carbs, fat)
- **Workout Logging** - Track workouts by type and duration

### Social
- **Up to 15 Buddies** - Connect with friends using buddy codes
- **Live Comparison** - See who's ahead in weight loss
- **View All Stats** - See everyone's weight, calories, and workouts at a glance

### Mobile
- **PWA (Progressive Web App)** - Install on phone like a real app
- **Works Offline** - Service worker caches the app
- **Mobile-First Design** - Looks great on phones

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS (Tailwind), JavaScript |
| Backend/Database | Firebase (Auth + Firestore) |
| Hosting | Render |
| PWA | Service Worker + Web Manifest |

---

## Project Structure

```
fitness-tracker/
├── index.html          # Dashboard/home page
├── login.html          # Login and signup
├── weight.html         # Weight tracking
├── food.html           # Food logging with search
├── workouts.html       # Workout logging
├── friend.html         # Buddies list and management
├── manifest.json       # PWA manifest
├── sw.js               # Service worker for offline
├── server.js           # Express server for Render
├── package.json        # Dependencies
├── css/
│   └── styles.css      # Custom styles
├── js/
│   ├── firebase-config.js  # Firebase credentials
│   ├── auth.js             # Auth helper functions
│   └── app.js              # Dashboard logic
└── icons/
    └── icon.svg        # App icon
```

---

## Setup (If Starting Fresh)

### 1. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "fitbuddy"
3. Click the web icon (`</>`) to add a web app
4. Copy the config values to `js/firebase-config.js`
5. Enable **Authentication** → Email/Password
6. Enable **Firestore Database** → Start in test mode

### 2. Run Locally

```bash
npm install
npm start
```

Open http://localhost:3000

### 3. Deploy to Render

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Click "Create Web Service"

---

## How to Use

1. **Sign Up** - Create account with starting weight and goal
2. **Share Your Code** - Find your buddy code on the Buddies page
3. **Add Friends** - Enter their buddy codes to connect (up to 15)
4. **Track Daily** - Log weight, food, and workouts
5. **Stay Accountable** - See everyone's progress on the Buddies page

---

## Install on Phone (PWA)

**iPhone (Safari):**
1. Open the app link in Safari
2. Tap Share button (square with arrow)
3. Tap "Add to Home Screen"

**Android (Chrome):**
1. Open the app link in Chrome
2. Tap the 3-dot menu
3. Tap "Install app" or "Add to Home Screen"

---

## Firebase Security Rules (For Production)

Go to Firestore → Rules and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      // Users can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Buddies can read each other's data
      allow read: if request.auth != null &&
        userId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.buddyIds;

      match /{subcollection}/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        allow read: if request.auth != null &&
          userId in get(/databases/$(database)/documents/users/$(request.auth.uid)).data.buddyIds;
      }
    }
  }
}
```

---

## Built With Claude AI

This entire app was built in a single conversation with Claude Code, demonstrating:
- Full-stack web app development
- Firebase integration
- PWA setup
- Deployment to production

Created by Arielle @ One Health Direct

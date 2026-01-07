# FitBuddy - Fitness Tracker

A simple web app to track your weight loss journey with an accountability buddy.

## Features

- Track weight over time
- Log food and calories
- Log workouts
- Connect with a friend to see each other's progress
- Mobile-friendly design

## Setup Instructions

### 1. Set up Firebase (required)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" (or use an existing one)
3. Name your project (e.g., "fitbuddy")
4. Once created, click the web icon (`</>`) to add a web app
5. Register your app and copy the config values
6. Open `js/firebase-config.js` and replace the placeholder values with your config

### 2. Enable Firebase Services

In your Firebase project:

**Authentication:**
1. Go to Authentication → Sign-in method
2. Enable "Email/Password"

**Firestore Database:**
1. Go to Firestore Database → Create database
2. Start in "test mode" (we'll add security rules later)
3. Choose a location close to you

**Firestore Security Rules (important for production):**
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null &&
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.buddyId == userId;

      match /{subcollection}/{document} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
        allow read: if request.auth != null &&
          get(/databases/$(database)/documents/users/$(request.auth.uid)).data.buddyId == userId;
      }
    }
  }
}
```

### 3. Run Locally

```bash
npm install
npm start
```

Then open http://localhost:3000 in your browser.

### 4. Deploy to Render

1. Push this code to a GitHub repository
2. Go to [Render](https://render.com) and create a new Web Service
3. Connect your GitHub repo
4. Settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Create Web Service"

Your app will be live at `https://your-app-name.onrender.com`!

## How to Use

1. **Sign up** - Create an account with your starting weight and goal
2. **Get your buddy code** - Share it with your friend
3. **Add your buddy** - Enter their code to connect
4. **Start tracking!** - Log weight, food, and workouts daily

## Tech Stack

- HTML, CSS (Tailwind), JavaScript
- Firebase (Auth + Firestore)
- Express.js (for serving on Render)

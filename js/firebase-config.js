// Firebase Configuration
// =====================
// IMPORTANT: Replace these values with your own Firebase project credentials!
//
// To get your Firebase config:
// 1. Go to https://console.firebase.google.com/
// 2. Create a new project (or use existing one)
// 3. Click the gear icon → Project Settings
// 4. Scroll down to "Your apps" → Click the </> (web) icon
// 5. Register your app and copy the config values below

const firebaseConfig = {
    apiKey: "AIzaSyAacaTuZooCjFAaoe-0WBXvW6-AkD0Qq9U",
    authDomain: "fitbuddy-7bdf2.firebaseapp.com",
    projectId: "fitbuddy-7bdf2",
    storageBucket: "fitbuddy-7bdf2.firebasestorage.app",
    messagingSenderId: "776739653524",
    appId: "1:776739653524:web:71dc70efeec685ac213181"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence (data works even without internet)
db.enablePersistence().catch((err) => {
    if (err.code === 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab
        console.log('Persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
        // Browser doesn't support persistence
        console.log('Persistence not supported by browser');
    }
});

console.log('Firebase initialized successfully!');

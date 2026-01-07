// Main App Logic for Dashboard
// =============================

let currentUser = null;
let userData = null;

// Initialize app when Firebase auth state changes
firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    currentUser = user;
    await loadDashboard();

    // Hide loading, show app
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
});

// Load all dashboard data
async function loadDashboard() {
    await loadUserData();
    await loadTodaySummary();
    await loadBuddyInfo();
    await loadStreak();
}

// Load user profile data
async function loadUserData() {
    const doc = await firebase.firestore()
        .collection('users')
        .doc(currentUser.uid)
        .get();

    userData = doc.data();

    // Update greeting
    const greeting = getGreeting();
    const name = userData.name.split(' ')[0]; // First name only
    document.getElementById('userGreeting').textContent = `${greeting}, ${name}!`;

    // Update progress card
    document.getElementById('startWeight').textContent = userData.startWeight + ' lbs';
    document.getElementById('currentWeight').textContent = userData.currentWeight + ' lbs';

    const weightLost = userData.startWeight - userData.currentWeight;
    document.getElementById('weightLost').textContent =
        (weightLost >= 0 ? '' : '+') + weightLost.toFixed(1) + ' lbs';
}

// Get time-appropriate greeting
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
}

// Load today's summary stats
async function loadTodaySummary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get today's weight (most recent)
    const weightSnapshot = await firebase.firestore()
        .collection('users').doc(currentUser.uid)
        .collection('weights')
        .orderBy('date', 'desc')
        .limit(1)
        .get();

    if (!weightSnapshot.empty) {
        const weight = weightSnapshot.docs[0].data().weight;
        document.getElementById('todayWeight').textContent = weight;
    }

    // Get today's calories
    const foodSnapshot = await firebase.firestore()
        .collection('users').doc(currentUser.uid)
        .collection('food')
        .where('date', '>=', today)
        .get();

    let totalCalories = 0;
    foodSnapshot.forEach(doc => {
        totalCalories += doc.data().calories || 0;
    });
    document.getElementById('todayCalories').textContent = totalCalories;

    // Get today's workouts
    const workoutSnapshot = await firebase.firestore()
        .collection('users').doc(currentUser.uid)
        .collection('workouts')
        .where('date', '>=', today)
        .get();

    document.getElementById('todayWorkouts').textContent = workoutSnapshot.size;
}

// Load buddy information
async function loadBuddyInfo() {
    if (!userData.buddyId) {
        document.getElementById('buddyName').textContent = 'No buddy yet';
        document.getElementById('buddyStatus').textContent = 'Add a friend to start!';
        return;
    }

    const buddyDoc = await firebase.firestore()
        .collection('users')
        .doc(userData.buddyId)
        .get();

    if (buddyDoc.exists) {
        const buddy = buddyDoc.data();

        // Update buddy card
        document.getElementById('buddyInfo').innerHTML = `
            <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                ${buddy.name.charAt(0).toUpperCase()}
            </div>
            <div class="flex-1">
                <p class="font-medium text-gray-800">${buddy.name}</p>
                <p class="text-sm text-gray-500">Lost ${(buddy.startWeight - buddy.currentWeight).toFixed(1)} lbs so far</p>
            </div>
        `;
    }
}

// Calculate and display logging streak
async function loadStreak() {
    const weights = await firebase.firestore()
        .collection('users').doc(currentUser.uid)
        .collection('weights')
        .orderBy('date', 'desc')
        .get();

    if (weights.empty) {
        document.getElementById('streakDays').textContent = '0';
        return;
    }

    // Calculate streak
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const logDates = new Set();
    weights.forEach(doc => {
        const date = doc.data().date?.toDate();
        if (date) {
            const dateStr = date.toDateString();
            logDates.add(dateStr);
        }
    });

    // Count consecutive days
    while (true) {
        if (logDates.has(currentDate.toDateString())) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            // Check if today hasn't been logged yet but yesterday was
            if (streak === 0) {
                currentDate.setDate(currentDate.getDate() - 1);
                if (logDates.has(currentDate.toDateString())) {
                    continue;
                }
            }
            break;
        }
    }

    document.getElementById('streakDays').textContent = streak;
}

// Refresh dashboard data
async function refreshDashboard() {
    await loadDashboard();
    showToast('Dashboard refreshed!');
}

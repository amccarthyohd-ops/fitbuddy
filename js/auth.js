// Authentication Helper Functions
// ================================

// Check if user is logged in and redirect if needed
function checkAuth(redirectToLogin = true) {
    return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                resolve(user);
            } else if (redirectToLogin) {
                window.location.href = 'login.html';
            } else {
                resolve(null);
            }
        });
    });
}

// Logout function
function logout() {
    firebase.auth().signOut().then(() => {
        window.location.href = 'login.html';
    }).catch((error) => {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    });
}

// Get current user data from Firestore
async function getCurrentUserData() {
    const user = firebase.auth().currentUser;
    if (!user) return null;

    const doc = await firebase.firestore()
        .collection('users')
        .doc(user.uid)
        .get();

    return doc.exists ? doc.data() : null;
}

// Update user profile
async function updateUserProfile(updates) {
    const user = firebase.auth().currentUser;
    if (!user) return false;

    try {
        await firebase.firestore()
            .collection('users')
            .doc(user.uid)
            .update(updates);
        return true;
    } catch (error) {
        console.error('Update profile error:', error);
        return false;
    }
}

// Format date helper
function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
}

// Format time helper
function formatTime(date) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

// Show toast notification
function showToast(message, duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create new toast
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
        toast.remove();
    }, duration);
}

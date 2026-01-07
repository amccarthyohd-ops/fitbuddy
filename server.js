// Simple Express Server for FitBuddy
// ==================================
// This serves our static files on Render

const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle all routes by serving the appropriate HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/weight', (req, res) => {
    res.sendFile(path.join(__dirname, 'weight.html'));
});

app.get('/food', (req, res) => {
    res.sendFile(path.join(__dirname, 'food.html'));
});

app.get('/workouts', (req, res) => {
    res.sendFile(path.join(__dirname, 'workouts.html'));
});

app.get('/friend', (req, res) => {
    res.sendFile(path.join(__dirname, 'friend.html'));
});

// Fallback to index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`FitBuddy server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

const express = require("express");
const path = require("path");
const app = express();
const port = 3243;
const contentService = require("./content-service");


// Serve static files from the 'public' directory
app.use(express.static('public'));

// Simple root route that sends a text response
app.get('/', (req, res) => {
    res.send('Welcome to the homepage! Everything is working fine.');
});

// Serve 'home.html' from the 'views' folder
app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

// Serve 'about.html' from the 'views' folder
app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

// Catch-all for any other requests, which aren't defined
app.get('*', (req, res) => {
    res.status(404).send('404 Not Found');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;  // Export the app for Vercel deployment
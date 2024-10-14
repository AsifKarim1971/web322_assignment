const express = require("express");
const path = require("path");
const app = express();
const port = 3243;
const contentService = require("./content-service");

app.use(express.static("public"));

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Root route that serves a simple text response
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

module.exports = app;  // Export the app for Vercel deployment


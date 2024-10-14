const express = require("express");
const path = require("path");
const app = express();
const contentService = require("./content-service");

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Initialize content service
contentService.initialize().then(() => {
    console.log("Content service initialized");

    // Root route that redirects to 'about'
    app.get("/", (req, res) => {
        res.redirect("/about");
    });

    // Serve 'home.html' from the 'views' folder
    app.get("/home", (req, res) => {
        res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    // Serve 'about.html' from the 'views' folder
    app.get("/about", (req, res) => {
        res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    // Route for serving articles
    app.get("/articles", (req, res) => {
        contentService.getPublishedArticles().then(articles => {
            res.json(articles);
        }).catch(err => {
            res.status(500).json({ message: "Error retrieving articles", error: err });
        });
    });

    // Route for serving categories
    app.get("/categories", (req, res) => {
        contentService.getCategories().then(categories => {
            res.json(categories);
        }).catch(err => {
            res.status(500).json({ message: "Error retrieving categories", error: err });
        });
    });

}).catch(err => {
    console.error("Failed to initialize content service:", err);
});

// Export the app for Vercel deployment, no listening here
module.exports = app;


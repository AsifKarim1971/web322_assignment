const express = require("express");
const path = require("path");
const app = express();
const port = 4000;
const contentService = require("./content-service");

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize content service
contentService
  .initialize()
  .then(() => {
    console.log("Content service initialized");

    // Serve 'about.html' from the root and '/about' routes
    app.get(["/", "/about"], (req, res) => {
      res.sendFile(path.join(__dirname, "views", "about.html"));
    });

    // Serve 'home.html' from the '/home' route
    app.get("/home", (req, res) => {
      res.sendFile(path.join(__dirname, "views", "home.html"));
    });

    // Route for fetching published articles
    app.get("/articles", (req, res) => {
      contentService
        .getPublishedArticles()
        .then((articles) => {
          res.json(articles);
        })
        .catch((err) => {
          console.error("Error fetching published articles:", err);
          res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
        });
    });

    // Route for fetching categories
    app.get("/categories", (req, res) => {
      contentService
        .getCategories()
        .then((categories) => {
          res.json(categories);
        })
        .catch((err) => {
          console.error("Error fetching categories:", err);
          res
            .status(500)
            .json({ message: "Internal Server Error", error: err.message });
        });
    });

    // Handler for favicon requests
    app.get("/favicon.ico", (req, res) => {
      res.status(204).end();
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize content service:", err.message);
  });

// Export the app for Vercel to handle as a serverless function if needed
module.exports = app;

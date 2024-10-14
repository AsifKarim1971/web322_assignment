const express = require("express");
const path = require("path");
const app = express();

// Assuming contentService is correctly set up and exported from 'content-service.js'
const contentService = require("./content-service");

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Initialize content service
contentService.initialize()
  .then(() => {
    console.log("Content service initialized");

    // Redirect root to '/about'
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

    // API endpoint for articles
    app.get("/articles", (req, res) => {
      contentService.getPublishedArticles()
        .then(articles => res.json(articles))
        .catch(err => res.status(500).json({ message: "Error retrieving articles", error: err }));
    });

    // API endpoint for categories
    app.get("/categories", (req, res) => {
      contentService.getCategories()
        .then(categories => res.json(categories))
        .catch(err => res.status(500).json({ message: "Error retrieving categories", error: err }));
    });

    // Only start listening on a port if not in production (Vercel will handle this automatically in production)
    if (process.env.NODE_ENV !== 'production') {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    }
  })
  .catch(err => {
    console.error("Failed to initialize content service:", err);
  });

module.exports = app;






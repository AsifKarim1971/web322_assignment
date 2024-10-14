const express = require("express");
const path = require("path");
const app = express();
const port = 3243;
const contentService = require("./content-service");

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

  // Dynamic route for serving articles
  app.get("/articles", (req, res) => {
      contentService.getPublishedArticles().then(articles => {
          res.json(articles);
      }).catch(err => {
          res.status(500).json({ message: "Error retrieving articles", error: err });
      });
  });

  // Dynamic route for serving categories
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

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;  // Export the app for Vercel deployment
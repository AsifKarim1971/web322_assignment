const express = require("express");
const app = express();
const port = 3243;

app.use(express.static("public"));

// Initialize content service
contentService
  .initialize()
  .then(() => {
    console.log("Content service initialized");

    app.get("/", (req, res) => {
      res.redirect("/about");
    });

    // Serve 'home.html' from the 'views' folder
    app.get("/home", (req, res) => {
      res.sendFile(__dirname + "/views/home.html");
    });

    // Serve 'about.html' from the 'views' folder
    app.get("/about", (req, res) => {
      res.sendFile(__dirname + "/views/about.html");
    });

    app.listen(port, () => {
      console.log(`Express http server listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

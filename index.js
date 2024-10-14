const express = require("express");
const path = require("path");
const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Root route
app.get("/", (req, res) => {
    res.send("Root route is working!");
});

// Serve 'home.html' from the 'views' folder
app.get("/home", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

// Serve 'about.html' from the 'views' folder
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "about.html"));
});

// Only start listening on a port if not in production (Vercel handles this automatically)
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });
}

module.exports = app;

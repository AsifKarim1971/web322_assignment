const express = require('express');
const path = require('path');
const app = express();

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});


app.get("/articles", (req, res) => {
    contentService.getPublishedArticles().then(articles => {
        res.json(articles);
    }).catch(err => {
        console.error("Failed to retrieve articles:", err);
        res.status(500).json({ message: "Error retrieving articles", error: err });
    });
});

module.exports = app;





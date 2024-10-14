const express = require('express');
const app = express();

app.use(express.static('public'));


const path = require('path');

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

module.exports = app;



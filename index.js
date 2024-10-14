const express = require('express');
const app = express();

app.use(express.static('public'));


const path = require('path');

app.get('/home', (req, res) => {
    console.log('Serving:', path.join(__dirname, 'views', 'home.html'));
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});

app.get('/about', (req, res) => {
    console.log('Serving:', path.join(__dirname, 'views', 'about.html'));
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
});

module.exports = app;



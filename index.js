const express = require('express');
const app = express();

app.use(express.static('public'));


const path = require('path');

app.get('/home', (req, res) => {
    res.type('html');
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
});


module.exports = app;



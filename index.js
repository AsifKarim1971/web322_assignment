const express = require('express');
const app = express();

app.use(express.static('public'));


const path = require('path');


app.use(express.static('views'));

module.exports = app;





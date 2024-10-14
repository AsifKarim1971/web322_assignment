const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('If you see this, the deployment is working!');
});

module.exports = app;



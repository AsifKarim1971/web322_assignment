// "require" the Express module
const express = require('express'); 

//instantiate the "app" object
const app = express(); 

// setup a port 
const HTTP_PORT = process.env.PORT || 3000; 

//GET Route for index 
app.get('/',(req,res) =>
{
    res.send("Md Asif Karim - 116316233");
});

// start the server on the port and output a confirmation to the console/
app.listen(HTTP_PORT, () => console.log(`server listening on: ${HTTP_PORT}`));
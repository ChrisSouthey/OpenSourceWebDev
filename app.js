const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = 3000;

//Servers static files
app.use(express.static(path.join(__dirname, 'public')));

//Basic get route
app.get("/", (req, res) => {
    res.send("This response worked!! The server is running.");
});

app.get("/index", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log("Reached Index");
});

app.get("/page2", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secondpage.html'));
    console.log("Reached Page 2");
});

//Route for data and data files
//JSON API data route
app.get("/api/data", (req, res) => {
    res.json({
        message: "Hello from the server!",
        timestamp: new Date(),
        items:["Node.js", "Express", "NPM"]
    });
});

app.get("/api/course", (req, res) => {
    fs.readFile("data.json", "utf-8", (err, data) => {
        //If failed
        if (err){
            res.status(500).json({error: "Failed to read data file"});
        };
        //If success
        res.json(JSON.parse(data));
    });
});

//route for running server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
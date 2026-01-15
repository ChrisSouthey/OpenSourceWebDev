const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const strict = require('assert/strict');
const app = express();
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error("Missing connection data");
    process.exit(1);
}

//Servers static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());


async function connectToMongo(){
    try{
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB");
    }
    catch(err){
        console.error("Failed to connect to MongoDB: ", err.message);
        process.exit(1);
    }
};

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

//Course route
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

app.get("/api/games/:game", async (req, res) => {
    console.log(req.params.game);
    const ginfo = req.params.game;
    const gameInfo = await Games.findOne({game:ginfo});
    console.log(gameInfo);
    res.json(gameInfo);
    
});


//Routes for database
const videogames = new mongoose.Schema({},{strict:false});
const Games = new mongoose.model("videogames", videogames);

app.get("/api/games", async (req, res) => {
    const data = await Games.find();
    console.log(data);
    res.json(data);
});
    



connectToMongo().then(() => {
    //route for running server
    app.listen(port, () => {
        console.log(`Server is running on port: ${port}`);
    });
});
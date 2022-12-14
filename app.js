/*************************************************************** 
*Title: Main app.js file for back-end
*Author: Thang Do
*Date: 30 December 2022
* Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv/config");

const app = express();
//Testing port
const PORT = process.env.PORT || 4000;

// var url = 'mongodb+srv://admin:admin@cluster0.tcmtgga.mongodb.net/?retryWrites=true&w=majority';
//create a connection to database
mongoose.connect(process.env.DB_STRING);
mongoose.connection.once("open", () => console.log("Connected!")).on("error", (err) => console.log("ERROR: " + err))

app.use(cors()); 
// app.use(express.json()); //Convert all the form data to json
app.use(bodyParser.json());

app.get("/", (req, res) => {
    return res.json("Hello world!");
});

// User authentication route
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

//Plylist route
const playlistRoute = require("./routes/playlist");
app.use("/api/playlists/", playlistRoute);

//Song route
const songRoute = require("./routes/song"); 
app.use("/api/songs/", songRoute);

//Album route
const albumRoute = require("./routes/album"); 
app.use("/api/albums/", albumRoute);

app.listen(PORT, () => console.log("Listening on port 4000"));
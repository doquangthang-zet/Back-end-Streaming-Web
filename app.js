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

//Artist route
const artistRoute = require("./routes/artist");
app.use("/api/artists/", artistRoute);

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
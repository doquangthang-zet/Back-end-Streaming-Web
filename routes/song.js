/*************************************************************** 
*Title: Main app.js file for back-end
*Author: Thang Do
*Date: 30 December 2022
* Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 

const router = require("express").Router();

//Our song model
const song = require("./../models/song");

//API to get all the songs in database
router.get("/getAll", async (req, res) => {
    const option = {
        sort: {
            createdAt: 1,
        },
    };

    const data = await song.find(option);

    if (data) {
        return res.status(200).send({success: true, song: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding all songs (not found)"});
    }
});

//API to save new song in database
router.post("/save", async (req, res) => {
    const newSong = song({
        name: req.body.name,
        imageURL: req.body.imageURL,
        songURL: req.body.songURL,
        likes: 0,
        album: req.body.album,
        artist: req.body.artist,
        language: req.body.language,
        category: req.body.category,
    })
 
    try {
        const savedSong = await newSong.save();
        return res.status(200).send({success: true, song: savedSong});
    } catch (error) {
        return res.status(400).send({success: false, message: "Error when saving new song"});
    }
});

//API to get the song in database
router.get("/getOne/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const data = await song.findOne(filter);

    if (data) {
        return res.status(200).send({success: true, song: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding a song (not found)"});
    }
});

//API to update the song in database
router.put("/update/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const options = {
        upsert: true,
        new: true
    };

    try {
        const result = await song.findOneAndUpdate(filter, {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songURL: req.body.songURL,
            likes: req.body.likes,
            album: req.body.album,
            artist: req.body.artist,
            language: req.body.language,
            category: req.body.category,
        }, options);

        return res.status(200).send({success: true, data: result});
    } catch (error) {
        return res.status(400).send({success: false, msg: error});
    }
});

//API to delete the song in database
router.delete("/delete/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const result = await song.deleteOne(filter);

    if (result) {
        return res.status(200).send({success: true, message: "Data deleted succesfully"});
    } else {
        return res.status(400).send({success: false, message: "Error when deleting a song (not found)"});
    }
})

// Update likes in a song
router.put("/gainLike/:songId", async (req, res) => {
    const filter = {_id: req.params.songId};

    try {
        const result = await song.findOneAndUpdate(filter, {$inc: {likes: 1}});
        res.status(200).send({success: true, song: result});
    } catch (error) {
        res.status(400).send({success: false, message: "Error when updating likes songs (not found)"});
    }
});

// Update likes in a song
router.put("/decreaseLike/:songId", async (req, res) => {
    const filter = {_id: req.params.songId};

    try {
        const result = await song.findOneAndUpdate(filter, {$inc: {likes: -1}});
        res.status(200).send({success: true, song: result});
    } catch (error) {
        res.status(400).send({success: false, message: "Error when updating likes songs (not found)"});
    }
});

// Get all song in chart order
router.get("/getChart", async (req, res) => {
    const option = {
        likes: -1,
        _id: 1,
    };

    const data = await song.find().sort(option);

    if (data) {
        return res.status(200).send({success: true, song: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding all songs chart (not found)"});
    }
});

module.exports = router
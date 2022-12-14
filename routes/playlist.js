/*************************************************************** 
*Title: Main app.js file for back-end
*Author: Thang Do
*Date: 30 December 2022
* Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 

const router = require("express").Router();

//Our playlist model
const playlist = require("./../models/playLists");


//API to get all the playlist in database
router.get("/getAll", async (req, res) => {
    const option = {
        sort: {
            createdAt: 1,
        },
    };

    const data = await playlist.find(option);

    if (data) {
        return res.status(200).send({success: true, playlist: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding all playlist (not found)"});
    }
});


//API to save new playlist in database
router.post("/save", async (req, res) => {
    const newPlaylist = playlist({
        name: req.body.name,
        imageURL: req.body.imageURL,
        description: req.body.description,
        user_id: req.body.user_id,
        songs: req.body.songs,
    })
 
    try {
        const savedPlaylist = await newPlaylist.save();
        return res.status(200).send({success: true, playlist: savedPlaylist});
    } catch (error) {
        return res.status(400).send({success: false, message: "Error when saving new playlist"});
    }
});

//API to get the album in database
router.get("/getOne/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const data = await playlist.findOne(filter);

    if (data) {
        return res.status(200).send({success: true, playlist: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding a playlist (not found)"});
    }
});

//API to update the album in database
router.put("/update/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const options = {
        upsert: true,
        new: true
    };

    try {
        const result = await playlist.findOneAndUpdate(filter, {
            name: req.body.name,
            imageURL: req.body.imageURL,
            description: req.body.description,
            user_id: req.body.user_id,
            songs: req.body.songs,
        }, options);

        return res.status(200).send({success: true, data: result});
    } catch (error) {
        return res.status(400).send({success: false, msg: error});
    }
});

//API to delete the album in database
router.delete("/delete/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const result = await playlist.deleteOne(filter);

    if (result) {
        return res.status(200).send({success: true, message: "Data deleted succesfully"});
    } else {
        return res.status(400).send({success: false, message: "Error when deleting a playlist (not found)"});
    }
})

//API to get all the playlist of a user in database
router.get("/getUserPlaylist/:user_id", async (req, res) => {
    const filter = {user_id: req.params.user_id};

    const data = await playlist.find(filter);

    if (data) {
        return res.status(200).send({success: true, playlists: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding some playlist (not found)"});
    }
});

// Update songs in playlist
router.put("/updateSongs/:playlistId/:songId", async (req, res) => {
    const filter = {_id: req.params.playlistId};

    try {
        const result = await playlist.findOneAndUpdate(filter, {$push: { songs: req.params.songId } });
        res.status(200).send({success: true, playlist: result});
    } catch (error) {
        res.status(400).send({success: false, message: "Error when updating playlist songs (not found)"});
    }
});

// Remove songs in playlist
router.put("/removeSongs/:playlistId/:songId", async (req, res) => {
    const filter = {_id: req.params.playlistId};

    try {
        const result = await playlist.findOneAndUpdate(filter, {$pull: { songs: req.params.songId } });
        res.status(200).send({success: true, playlist: result});
    } catch (error) {
        res.status(400).send({success: false, message: "Error when updating playlist songs (not found)"});
    }
});

module.exports = router
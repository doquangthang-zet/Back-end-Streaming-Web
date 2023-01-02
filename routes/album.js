/*************************************************************** 
*Title: Main app.js file for back-end
*Author: Thang Do
*Date: 30 December 2022
* Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 

const router = require("express").Router();

//Our album model
const album = require("./../models/albums");


//API to get all the album in database
router.get("/getAll", async (req, res) => {
    const option = {
        sort: {
            createdAt: 1,
        },
    };

    const data = await album.find(option);

    if (data) {
        return res.status(200).send({success: true, album: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding all albums (not found)"});
    }
});

//API to save the album in database
router.post("/save", async (req, res) => {
    const newAlbum = album({
        name: req.body.name,
        imageURL: req.body.imageURL,
        songs: req.body.songs,
        category: req.body.category,
    })
 
    try {
        const savedAlbum = await newAlbum.save();
        return res.status(200).send({success: true, album: savedAlbum});
    } catch (error) {
        return res.status(400).send({success: false, message: "Error when saving new album"});
    }
});

//API to get one album in database
router.get("/getOne/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const data = await album.findOne(filter);

    if (data) {
        return res.status(200).send({success: true, album: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding a album (not found)"});
    }
});

//API to updata one album in database
router.put("/update/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const options = {
        upsert: true,
        new: true
    };

    try {
        const result = await album.findOneAndUpdate(filter, {
            name: req.body.name,
            imageURL: req.body.imageURL,
            songs: req.body.songs,
            category: req.body.category,
        }, options);

        return res.status(200).send({success: true, data: result});
    } catch (error) {
        return res.status(400).send({success: false, msg: error});
    }
});

//API to delete the album in database
router.delete("/delete/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const result = await album.deleteOne(filter);

    if (result) {
        return res.status(200).send({success: true, message: "Data deleted succesfully"});
    } else {
        return res.status(400).send({success: false, message: "Error when deleting a album (not found)"});
    }
})

module.exports = router
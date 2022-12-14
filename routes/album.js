const router = require("express").Router();

//Our album model
const album = require("./../models/albums");

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

router.post("/save", async (req, res) => {
    const newAlbum = album({
        name: req.body.name,
        imageURL: req.body.imageURL,
    })
 
    try {
        const savedAlbum = await newAlbum.save();
        return res.status(200).send({success: true, album: savedAlbum});
    } catch (error) {
        return res.status(400).send({success: false, message: "Error when saving new album"});
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const data = await album.findOne(filter);

    if (data) {
        return res.status(200).send({success: true, album: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding a album (not found)"});
    }
});

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
        }, options);

        return res.status(200).send({success: true, data: result});
    } catch (error) {
        return res.status(400).send({success: false, msg: error});
    }
});

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
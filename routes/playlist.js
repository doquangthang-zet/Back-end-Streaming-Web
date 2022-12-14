const router = require("express").Router();

//Our playlist model
const playlist = require("./../models/playLists");

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

router.post("/save", async (req, res) => {
    const newPlaylist = playlist({
        name: req.body.name,
        imageURL: req.body.imageURL,
        description: req.body.description,
        user_id: req.body.user_id,
    })
 
    try {
        const savedPlaylist = await newPlaylist.save();
        return res.status(200).send({success: true, playlist: savedPlaylist});
    } catch (error) {
        return res.status(400).send({success: false, message: "Error when saving new playlist"});
    }
});

router.get("/getOne/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const data = await playlist.findOne(filter);

    if (data) {
        return res.status(200).send({success: true, playlist: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding a playlist (not found)"});
    }
});

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
        }, options);

        return res.status(200).send({success: true, data: result});
    } catch (error) {
        return res.status(400).send({success: false, msg: error});
    }
});

router.delete("/delete/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const result = await playlist.deleteOne(filter);

    if (result) {
        return res.status(200).send({success: true, message: "Data deleted succesfully"});
    } else {
        return res.status(400).send({success: false, message: "Error when deleting a playlist (not found)"});
    }
})

router.get("/getUserPlaylist/:user_id", async (req, res) => {
    const filter = {user_id: req.params.user_id};

    const data = await playlist.find(filter);

    if (data) {
        return res.status(200).send({success: true, playlists: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding some playlist (not found)"});
    }
});

module.exports = router
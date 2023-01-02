/*************************************************************** 
*Title: playlists
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 
const mongoose = require("mongoose");

//Model for playlist collection
const playListSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: true
    },
    songs: [
        {
            type: String,
            required: false,
        }
    ]
},
{timestamps: true}
);

module.exports = mongoose.model("playlist", playListSchema);
/*************************************************************** 
*Title: playlists
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Front-end-Streaming-Web/tree/main/muzikland 
****************************************************************/ 
const mongoose = require("mongoose");

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
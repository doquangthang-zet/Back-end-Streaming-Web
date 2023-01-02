/*************************************************************** 
*Title: Albums
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Front-end-Streaming-Web/tree/main/muzikland 
****************************************************************/ 
const mongoose = require("mongoose");

const albumSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    songs: [
        {
            type: String,
            required: false,
        }
    ],
    category: {
        type: String,
        required: false,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("albums", albumSchema);
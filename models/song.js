/*************************************************************** 
*Title: Songs
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 
const mongoose = require("mongoose");

//Model for song collection
const songSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: true
    },
    songURL: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        required: false
    },
    album: {
        type: String,
        required: false
    },
    artist: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true 
    },
},
{timestamps: true}
);

module.exports = mongoose.model("song", songSchema);
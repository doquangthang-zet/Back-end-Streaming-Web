const mongoose = require("mongoose");

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
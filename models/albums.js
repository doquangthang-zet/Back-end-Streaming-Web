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
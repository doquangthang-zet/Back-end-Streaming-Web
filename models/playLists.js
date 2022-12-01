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
},
{timestamps: true}
);

module.exports = mongoose.model("playlist", playListSchema);
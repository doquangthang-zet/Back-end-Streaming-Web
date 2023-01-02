/*************************************************************** 
*Title: Users
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Front-end-Streaming-Web/tree/main/muzikland 
****************************************************************/ 
const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    imageURL: {
        type: String,
        required: false
    },
    user_id: {
        type: String,
        required: false
    },
    email_verified: {
        type: Boolean,
        required: false
    },
    role: {
        type: String,
        required: false
    }, 
    auth_time: {
        type: String,
        required: false
    },
    password: String,
    likedSongs: [
        {
            type: String,
            required: false,
        }
    ],
},
{timestamps: true}
)

module.exports = mongoose.model("users", UserSchema);
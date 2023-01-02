/*************************************************************** 
*Title: User Verification
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Back-end-Streaming-Web (Accessed 2 January 2022) 
****************************************************************/ 
const mongoose = require("mongoose");

//Model for verification users collection
const UserVerificationSchema = mongoose.Schema({
    user_id: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
},
{timestamps: true}
)

module.exports = mongoose.model("userVerified", UserVerificationSchema);
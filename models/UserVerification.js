/*************************************************************** 
*Title: User Verification
*Author: Thang Do
*Date: 20 Dec 2022
*Code version: V1 
*Availability: https://github.com/doquangthang-zet/Front-end-Streaming-Web/tree/main/muzikland 
****************************************************************/ 
const mongoose = require("mongoose");

const UserVerificationSchema = mongoose.Schema({
    user_id: String,
    uniqueString: String,
    createdAt: Date,
    expireAt: Date
},
{timestamps: true}
)

module.exports = mongoose.model("userVerified", UserVerificationSchema);
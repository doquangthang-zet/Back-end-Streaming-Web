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
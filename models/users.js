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
},
{timestamps: true}
)

module.exports = mongoose.model("users", UserSchema);

const router = require("express").Router();
const user = require("../models/users");
const admin = require("../config/firebase.config");

//get api
router.get("/login", async(req, res) => {
    if (!req.headers.authorization) {
        return res.status(500).send({message : "Invalid token"});
    }
    const token = req.headers.authorization.split(" ")[1];
    
    try {
        const decodeValue = await admin.auth().verifyIdToken(token);
        if (!decodeValue) {
            return res.status(505).json({message: "Unauthorized"});
        } else {
            //Check user exists or not
            const userExist = await user.findOne({"user_id" : decodeValue.user_id});
            if(!userExist) {
                newUserData(decodeValue, req, res);
            } else {
                return res.send("Need to update")
            }
        }
    } catch (err) { 
        return res.status.json({message : err});
    }
})

const newUserData = async (decodeValue, req, res) => {
    const newUser = new user({
        name: decodeValue.name,
        email: decodeValue.email,
        imageURL: decodeValue.picture,
        user_id: decodeValue.uid,
        email_verified: decodeValue.email_verified,
        role: "member",
        auth_time: decodeValue.auth_time
    })

    try {
        const savedUser = await newUser.save();
        res.status(200).send({user: savedUser});
    } catch (err) {
        res.status(400).send({success: false, msg: err});
    }
}

//export the router
module.exports = router
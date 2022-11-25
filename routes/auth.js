
const router = require("express").Router();
const user = require("../models/users");
const admin = require("../config/firebase.config");

// Regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordTest = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
const usernameRegex = /^[A-Za-z0-9._-\s]{8,16}$/

//Password handler
const bcrypt = require("bcrypt");
// const User = require("../../ClubHub-Back-end/app/models/auth/user.model");

//login api
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


//Sign up api
router.post("/signup", (req, res) => {
    
    let {name, email, password} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();
    console.log(name.trim());

    if (name == "" || email == "" || password == "") {
        res.json({
            status: "Failed",
            message: "Empty input field!"
        });
    } else if (!usernameRegex.test(name)) {
        res.json({
            status: "Failed",
            message: "Invalid input username!"
        })
    } else if (!emailRegex.test(email)) {
        res.json({
            status: "Failed",
            message: "Invalid input email!"
        })
    } else if (!passwordTest.test(password)) {
        res.json({
            status: "Failed",
            message: "Invalid password!"
        })
    } else { 
        user.find({email}).then(result => {
            if(result.length) {
                res.json({
                    status: "Failed",
                    message: "User with this email is already exist!"
                });
            } else { 
                //Create new user

                //Password hashing
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword => {
                    const newUser = new user({
                        name: name,
                        email: email,
                        imageURL: "",
                        role: "member",
                        password: hashedPassword
                    });

                    newUser.save().then(result => {
                        res.json({
                            status: "Success",
                            message: "Signup successful!",
                            data: result
                        })
                    }).catch(err => {
                        res.json({
                            status: "Failed",
                            message: "Error when saving new user!"
                        });
                    })
                }).catch(err => {
                    res.json({
                        status: "Failed",
                        message: "Error when hashing password!"
                    });
                })

            }
        }).catch(err => {
            res.json({
                status: "Failed",
                message: "Error when check existing user!"
            })
        })
    }
})

//Sign in api
router.post("/login", (req, res) => {
    let {email, password} = req.body;
    
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "") {
        res.json({
            status: "Failed",
            message: "Empty input field!"
        });
    } else {
        user.find({email}).then(data => {
            if (data) {
                const hashedPassword = data[0].password;
                bcrypt.compare(password, hashedPassword).then(result => {
                    if (result) {
                        res.json({
                            status: "Success",
                            message: "Signin succesful!",
                            data: data
                        })
                    } else {
                        res.json({
                            status: "Failed",
                            message: "Invalid password entered!"
                        })
                    }
                }).catch(err => {
                    res.json({
                        status: "Failed",
                        message: "Error when login!"
                    })
                }) 
            } else {
                res.json({
                    status:"Failed",
                    message: "Invalid email or password!"
                })
            }
        }).catch(err => {
            res.json({
                status: "Failed",
                message: "Error when check existing users!"
            })
        }) 
    }
})

//export the router
module.exports = router
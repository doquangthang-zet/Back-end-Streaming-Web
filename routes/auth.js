const router = require("express").Router();

// User models
const user = require("../models/users");

// User verification model
const UserVerification = require("../models/UserVerification");

//Email handler
const nodemailer = require("nodemailer");

// Unique string
const {v4: uuidv4} = require("uuid");

// .env config
require("dotenv").config();

//firebase admin
const admin = require("../config/firebase.config");

// Static verified page
const path = require("path");

// Regex
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordTest = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
const usernameRegex = /^[A-Za-z0-9._-\s]{8,16}$/

//Password handler
const bcrypt = require("bcrypt");
// const User = require("../../ClubHub-Back-end/app/models/auth/user.model");


//Nodemailer stuff
let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD,
    }
})

// Testing success
transporter.verify((err, success) => {
    if(err) {
        console.log(err);
    } else {
        console.log("Ready for message!");
        console.log("Success");
    }
})

//login api using gg account
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
                updateUserData(decodeValue, req, res);
            }
        }
    } catch (err) { 
        return res.status.json({message : err});
    }
})

// Function to create new user
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

//Function to update user data
const updateUserData = async (decodeValue, req, res) => {
    const filter = {user_id : decodeValue.user_id};
    const options = {
        upsert : true,
        new : true
    }

    try{
        const result = await user.findOneAndUpdate(
            filter,
            {auth_time: decodeValue.auth_time},
            options
        );
        res.status(200).send({user : result})
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
                        imageURL: "https://firebasestorage.googleapis.com/v0/b/muzikland-project-music-web.appspot.com/o/images%2Fdefault_avatar.png?alt=media&token=0cf392ca-aed2-423b-858c-ce31dbad13e3",
                        email_verified: false,
                        role: "member",
                        password: hashedPassword
                    });

                    newUser.save().then(result => {
                        // Handle account verification
                        console.log(result);
                        sendVerificationEmail(result, res)

                        // res.json({
                        //     status: "Success",
                        //     message: "Signup successful!",
                        //     data: result
                        // })
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

// Send verification email function
const sendVerificationEmail = ({_id, email}, res) => {
    console.log(_id)
    console.log(email)
    // url to be used
    const currentURL = "http://localhost:4000/";
    const uniqueString = uuidv4() + _id;

    //mail options
    const mailOption = {
        from: process.env.AUTH_EMAIL,
        to: email,
        subject: "Verify your email!",
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link will be expired in <b>6 hours</b>.</p><p>Press <a href=${currentURL + "api/users/verify/" + _id + "/" + uniqueString}>here</a> to proceed.</p>`
    };

    // Hash the unique string
    const saltRounds = 10;
    
    bcrypt.hash(uniqueString, saltRounds)
    .then((hashedString) => {
        // Set values in the user verification collection
        const newVerify = new UserVerification({
            user_id: _id,
            uniqueString: hashedString,
            createdAt: Date.now(),
            expireAt: Date.now() + 21600000,
        })

        // console.log(newVerify)
        newVerify.save()
        .then(() => {
            transporter.sendMail(mailOption)
            .then(() => {
                // Email sent and verification record saved
                res.json({
                    status: "Pending",
                    message: "Verificaiton email sent!"
                })
            })
            .catch(err => {
                console.log(err);
                res.json({
                    status: "Failed",
                    message: "Error when send email!"
                })
            })
        })
        .catch(err => {
            res.json({
                status: "Failed",
                message: "Error when saving verified data!"
            })
        })
    })
    .catch(err => {
        res.json({
            status: "Failed",
            message: "Error when hashing email data!"
        })
    })
}

//Verify email
router.get("/verify/:userId/:uniqueString", (req,res) => {
    let {userId, uniqueString} = req.params;
    
    UserVerification.find({userId})
    .then(result => {
        console.log(result)
        if(result.length > 0) {
            //record exist then
            let {expireAt} = result[0];

            const hashedUniqueString = result[0].uniqueString;

            // Check expire time
            if(expireAt < Date.now()) {
                // Record has expired
                UserVerification.deleteOne({userId})
                .then(result => {
                    user.deleteOne({ _id: userId})
                    .then(() => {
                        let message = "Link has expired. Please sign up again!";
                        res.redirect(`/api/users/verified/error=true&message=${message}`);
                    })
                    .catch(err => {
                        let message = "Fail to clear user with unique string!";
                        res.redirect(`/api/users/verified/error=true&message=${message}`);
                    })
                })
                .catch(err => {
                    let message = "Error when checking expire time of verification record!";
                    res.redirect(`/api/users/verified/error=true&message=${message}`);
                })
            } else {
                // validate user data
                //First compare the hashed uniqueString
                bcrypt.compare(uniqueString, hashedUniqueString)
                .then((result) => {
                    if(result) {
                        //string match
                        user.updateOne({_id: userId}, {email_verified: true})
                        .then(() => {
                            UserVerification.deleteOne({userId})
                            .then(() => {
                                res.sendFile(path.join(__dirname, "./../view/verified.html"));
                            })
                            .catch(err => {
                                let message = "Error when deleting user record in verify collection!";
                                res.redirect(`/api/users/verified/error=true&message=${message}`);
                            })
                        })
                        .catch(err => {
                            let message = "Error when updating user record!";
                            res.redirect(`/api/users/verified/error=true&message=${message}`);
                        })
                    } else {
                        //existing record but incorrect verification details passed.
                        let message = "Invalid verification details. Please check your inbox!";
                        res.redirect(`/api/users/verified/error=true&message=${message}`);
                    }
                })
                .catch(err => {
                    let message = "Error when compare unique string!";
                    res.redirect(`/api/users/verified/error=true&message=${message}`);
                })
            }
        } else {
            //record does not exist
            let message = "Account record does not exist or has been verified already. Please signup or login!";
            res.redirect(`/api/users/verified/error=true&message=${message}`);
        }
    })
    .catch(err => {
        console.log("err");
        let message = "Error when checking existing verification record!";
        res.redirect(`/api/users/verified/error=true&message=${message}`);
    })
})

//Verified page route
router.get("/verified", (req, res) => {
    res.sendFile(path.join(__dirname, "./../view/verified.html"));
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
                //Users exists

                //Check if user is verified
                if(!data[0].email_verified) {
                    res.json({
                        status: "Failed",
                        message: "The user is not verified yet!"
                    })
                } else {
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
                }
                
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

// find all users
router.get("/getUsers", async (req, res) => {
    const option = {
        sort: {
            createdAt: 1,
        },
    };

    const data = await user.find(option);

    if (data) {
        return res.status(200).send({success: true, users: data});
    } else {
        return res.status(400).send({success: false, message: "Error when finding all users (not found)"});
    }
});

// Update users api
router.put("/updateRole/:userId", async (req, res) => {
    const filter = {_id: req.params.userId};
    const role = req.body.data.role;
    const option = {
        sort: {
            createdAt: 1,
        },
    };

    try {
        const result = await user.findOneAndUpdate(filter, {role: role}, option);
        res.status(200).send({success: true, user: result});
    } catch (error) {
        res.status(400).send({success: false, message: "Error when updating users (not found)"});
    }
});

//Delete an user
router.delete("/delete/:id", async (req, res) => {
    const filter = {_id: req.params.id};

    const result = await user.deleteOne(filter);

    if (result) {
        return res.status(200).send({success: true, message: "Data deleted succesfully"});
    } else {
        return res.status(400).send({success: false, message: "Error when deleting an user (not found)"});
    }
})

//export the router
module.exports = router
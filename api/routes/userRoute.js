const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const { findUser, postUser } = require('../../db/db');

router.post('/signup', async (req, res) => {
    // Grab user input password / email
    const password = req.body.password;
    const userEmail = req.body.email;
    // find User by email address
    const userExists = await findUser({email: userEmail})
    // if user exists return 409 message user exist
    if ( userExists) {
        res.status(409).json({ message: 'A user with that email already exists' });
    } 
    else {
        // encrypt password
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                res.status(500).json({ message: err.message });
            } else {
                // create new user object
                const user = new User({
                    _id: mongoose.Types.ObjectId(),
                    firstName: req.body.firstName,
                    email: req.body.email,
                    password: hash,
                })
                // save user
                postUser(user);
                res.status(200).json({ message: 'Signup - POST', user: user })
            }
        })
    } 
});

router.post('/login', async (req, res) => {
    // user email
    const userEmail = req.body.email;
    // find User by email address
    const userExists = await findUser({ email: userEmail }) 
    // if user not found then return 401 message Authorization failed
    if ( userExists ) {
        // compare passwords
        const password = req.body.password;
        bcrypt.compare( password, userExists.password, (err, result)=>{
            // test for error
            if (err) return res.status(501).json({message: err.message});
        
            // test result    
            if (result){
                // message  authorization was successful
                res.status(200).json({
                    message: "Login - POST, Authorization Successful",
                    result: result,
                    name: req.body.firstName,
                });
            } else {
                res.status(409).json({
                    message: "Authorization Failed",
                    result: result
                });
            }
        });   
    }
    else{
        res.status(401).json({ message: "No account with that email was found" });
    }
});

router.get('/profile', (req, res) => {
    res.json({
        message: 'User Profile - GET',
        hostname: req.hostname,
    })
});

module.exports = router;
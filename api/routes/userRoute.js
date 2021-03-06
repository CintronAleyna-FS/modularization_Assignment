const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const mongoose = require('mongoose');
const { findUser, postUser } = require('../../db/db');
const jwt = require("jsonwebtoken");
const checkAuth = require('../../auth/checkAuth');
require('dotenv').config();

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
                    lastName: req.body.lastName,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.states,
                    zip: req.body.zip,
                    email: req.body.email,
                    password: hash,
                })
                // save user
                postUser(user);
                res.status(201).json({ message: 'User created!', user: user })
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
                // jwt after successful login
                const token = jwt.sign({ email: userExists.email, id: userExists._id, name: userExists.firstName}, process.env.jwt_key);
                res.status(201).json({
                    result: result,
                    name: userExists.firstName,
                    message: 'Secrured', 
                    token:token 
                    })
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

router.get('/profile', checkAuth, (req, res, next) => {
    res.status(201).json({ message: req.userData });
});

module.exports = router;
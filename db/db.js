const mongoose = require('mongoose');
const User = require("../api/models/user");
require('dotenv').config();

const connect = async() => {
    console.log('Connecting');
    await mongoose.connect(process.env.mongoDBURL)
}

const postUser = async (newUser) => {
    console.log('Real User');
    return await newUser.save();
}

const findUser = async (email) => {
    const user = await User.findOne(email).exec()
    return user;
};

const disconnect = async() => {
    console.log('Disconnecting');
    await mongoose.connection.close();
}

module.exports = { connect, postUser, findUser, disconnect}
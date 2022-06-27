const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoute = require('../api/routes/userRoute');
require('dotenv').config();
const swaggerDocs = require("../config/swaggerOptions");
const swaggerUI = require("swagger-ui-express");

app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Acess-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'POST, PUT, PATCH, GET, DELETE');
    }
    next();
});

app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Service is up',
        method: req.method,
    });
});

app.use('/users', userRoute);
console.log(swaggerDocs);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use((req, res, next) => {
    const error = new Error('NOT FOUND!!!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({
        error: {
            message: error.message,
            status: error.status,
        },
    });
});

// connect to mongodb
mongoose.connect(process.env.mongoDBURL, (err) => {
    if(err){
        console.log("Error ", err.message);
    }
    else{
        console.log('MongoDB connection was successful')
    }
})

module.exports = app;
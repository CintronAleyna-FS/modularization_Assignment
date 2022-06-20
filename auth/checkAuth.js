const jwt = require("jsonwebtoken");
require('dotenv').config();

module.exports = (req, res, next) => {
    try{
        const [bearer, token] = req.headers.authorization.split(' ');
        const payload = jwt.verify(token, process.env.jwt_key);
        req.userData = payload;
        next();
    } catch(error){
        res.status(401).json({ message: 'Authorization Failed'})
    }
}
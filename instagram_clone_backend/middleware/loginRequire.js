const jwt = require('jsonwebtoken');
const mongoose  = require('mongoose');
const { findUser } = require('../models/user');
const user = mongoose.model('user');
require('dotenv').config();

module.exports = (request, response, next) => {
    const { authorization } = request.headers;
    if(authorization){
        const token = authorization.replace("Bearer ", "");
        jwt.verify(token, process.env.AUTH_TOKEN, (error, payload) => {
            if(error){
                return response.status(401).json({'status': false, 'message': 'must be logged in'})
            }
            else{
                findUser(user, payload, (result) => {
                    if(result){
                        request.user = result;
                        next();
                    }
                    else{
                        return response.status(401).json({'status': false, 'message': 'user not found'});
                    }
                });
            }
        })
    }
    else{
        return response.status(401).json({'status': false, 'message': 'must be logged in'})
    }
}

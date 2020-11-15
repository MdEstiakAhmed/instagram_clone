const express = require('express');
const mongoose  = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const loginRequire = require('../middleware/loginRequire');
const router = express.Router();
const { findUser, storeUser } = require('../models/user');
const { request, response } = require('express');
const user = mongoose.model('user');
require('dotenv').config();

router.get('/protected', loginRequire, (request, response) => {
    response.send("hello");
});

router.post('/signup', (request, response) => {
    const { name, email, password, photo } = request.body;
    if(name && email && password){
        findUser(user, request.body, (result) => {
            if(result){
                return response.json({'status': false, 'message': 'already exist'});
            }
            else{
                bcrypt.hash(password, 10)
                .then(hashedPassword => {
                    const data = new user({
                        name: name,
                        email: email,
                        password: hashedPassword,
                        photo: photo
                    });
                    storeUser(data, (result) => {
                        if(result){
                            return response.json({'status': true, 'message': 'successfully inserted'});
                        }
                        else{
                            return response.json({'status': false, 'message': 'error in insert'});
                        }
                    });
                })
                .catch(error => {
                    return response.json({'status': false, 'message': 'error in hashing'});
                })
            }
        });
    }
    else{
        return response.status(422).json({'status': false, 'message': 'all the field does not filled'});
    }
});

router.post('/login', (request, response) => {
    const { email, password } = request.body;
    if(email && password){
        findUser(user, request.body, (result) => {
            if(result){
                bcrypt.compare(password, result.password)
                .then(status => {
                    if(status){
                        const token = jwt.sign({email: result.email}, process.env.AUTH_TOKEN);
                        return response.json({'status': true, 'token': token, 'user': result, 'message': 'successfully login'});
                    }
                    else{
                        return response.json({'status': false, 'message': 'password does not match'});
                    }
                })
                .catch(error => {
                    return response.json({'status': false, 'message': 'bcrypt error'});
                })
            }
            else{
                return response.status(422).json({'status': false, 'message': 'email does not match'});
            }
        });
    }
    else{
        return response.status(422).json({'status': false, 'message': 'all the field does not filled'});
    }
});

module.exports = router;
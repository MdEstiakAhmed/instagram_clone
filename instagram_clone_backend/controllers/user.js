const express = require('express');
const mongoose  = require('mongoose');
const loginRequire = require('../middleware/loginRequire');
const { getUser } = require('../models/user');
const { request, response } = require('express');
const router = express.Router();
const user = mongoose.model('user');

router.get('/getAllUser', loginRequire, (request, response) => {
    data = {
        makeFalse: {
            email: 0,
            password: 0
        }
    }
    getUser(user, data, (results) => {
        if(results){
            return response.json(results);
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read user data'});
        }
    });
});

router.get('/getMyUser', loginRequire, (request, response) => {
    data = {
        find: {
            _id: request.user._id
        },
        makeFalse: {
            email: 0,
            password: 0
        }
    }
    getUser(user, data, (results) => {
        if(results){
            return response.json(results);
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read user data'});
        }
    });
});

module.exports = router;
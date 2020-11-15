const express = require('express');
const mongoose  = require('mongoose');
const loginRequire = require('../middleware/loginRequire');
const { getUser, findAndUpdate } = require('../models/user');
const bcrypt = require('bcryptjs');
const { request, response } = require('express');
const router = express.Router();
const user = mongoose.model('user');

router.get('/getSuggestedUser', loginRequire, (request, response) => {
    data = {
        find: {
            _id: { $nin: request.user.followings.concat(request.user._id) }
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

router.get('/getFollowingUser', loginRequire, (request, response) => {
    data = {
        find: {
            _id: request.user.followings
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

router.get('/getFollowerUser', loginRequire, (request, response) => {
    data = {
        find: {
            _id: request.user.followers
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

router.post('/passwordCheck', loginRequire, (request, response) => {
    const { password } = request.body;
    data = {
        find: {
            _id: request.user._id
        }
    }
    getUser(user, data, (results) => {
        if(results){
            bcrypt.compare(password, results[0].password)
            .then(status => {
                if(status){
                    return response.json({'status': true, 'message': "password match"});
                }
                else{
                    return response.status(422).json({'status': false, 'message': 'password did not match'});
                }
            })
            .catch(error => {
                return response.json({'status': false, 'message': 'error in hashing'});
            })
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read user data'});
        }
    });
    
});

router.get('/getUser/:id', loginRequire, (request, response) => {
    data = {
        find: {
            _id: request.params.id
        },
        makeFalse: {
            email: 0,
            password: 0
        }
    }
    getUser(user, data, (results) => {
        if(results){
            return response.json({'status': true, 'data': results});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read user data'});
        }
    });
});

router.put('/follow', loginRequire, (request, response) => {
    data = {
        searchId: request.body.followingId,
        follower: request.user._id,
        action: "following"
    }
    findAndUpdate(user, data, (result) => {
        if(result){
            data = {
                searchId: request.user._id,
                following: request.body.followingId,
                action: "follower"
            }
            findAndUpdate(user, data, (result) => {
                if(result){
                    return response.json({'status': true, 'data': result});
                }
                else{
                    return response.status(422).json({'status': false, 'message': 'update error'});
                }
            });
        }
        else{
            return response.status(422).json({'status': false, 'message': 'update error'});
        }
    });
});

router.put('/unFollow', loginRequire, (request, response) => {
    data = {
        searchId: request.body.followingId,
        follower: request.user._id,
        action: "unFollowing"
    }
    findAndUpdate(user, data, (result) => {
        if(result){
            data = {
                searchId: request.user._id,
                following: request.body.followingId,
                action: "unFollower"
            }
            findAndUpdate(user, data, (result) => {
                if(result){
                    return response.json({'status': true, 'data': result});
                }
                else{
                    return response.status(422).json({'status': false, 'message': 'update error'});
                }
            });
        }
        else{
            return response.status(422).json({'status': false, 'message': 'update error'});
        }
    });
});

module.exports = router;
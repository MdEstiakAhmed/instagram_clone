const express = require('express');
const mongoose  = require('mongoose');
const loginRequire = require('../middleware/loginRequire');
const { findUser, storePost, getAllPost, findAndUpdate, findAndDelete } = require('../models/post');
const { request, response } = require('express');
const router = express.Router();
const post = mongoose.model('post');

router.post('/createPost', loginRequire, (request, response) => {
    const { photo, body } = request.body;
    if(photo){
        const data = new post({
            photo: photo,
            body: body,
            postCreator: request.user._id
        });
        storePost(data, (result) => {
            if(result){
                return response.json({'status': true, 'message': 'successfully post created'});
            }
            else{
                return response.json({'status': false, 'message': 'error in creating post'});
            }
        });
    }
    else{
        return response.status(422).json({'status': false, 'message': 'photo must be required'});
    }
});

router.get('/getAllPost', loginRequire, (request, response) => {
    data = {
        populateColumn: 'postCreator',
        displayColumn: '_id name'
    }
    getAllPost(post, data, (results) => {
        if(results){
            return response.json({'status': true, 'data': results});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read post data'});
        }
    })
});

router.get('/getMyFollowingPost', loginRequire, (request, response) => {
    data = {
        find: {
            postCreator: request.user.followings
        },
        populateColumn: 'postCreator',
        displayColumn: '_id name  followings followers'
    }
    getAllPost(post, data, (results) => {
        if(results){
            return response.json({'status': true, 'data': results});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read post data'});
        }
    })
});

router.get('/getMyPost', loginRequire, (request, response) => {
    data = {
        find: {
            postCreator: request.user
        },
        populateColumn: 'postCreator',
        displayColumn: '_id name  followings followers'
    }
    getAllPost(post, data, (results) => {
        if(results){
            return response.json({'status': true, 'data': results});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read post data'});
        }
    })
});

router.get('/getUserPost/:id', loginRequire, (request, response) => {
    data = {
        find: {
            postCreator: request.params.id
        },
        populateColumn: 'postCreator',
        displayColumn: '_id name followings followers'
    }
    getAllPost(post, data, (results) => {
        if(results){
            return response.json({'status': true, 'data': results});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'can not read post data'});
        }
    })
});

router.put('/like', loginRequire, (request, response) => {
    data = {
        searchId: request.body.postId,
        userIdWhoLiked: request.user._id,
        action: "like"
    }
    findAndUpdate(post, data, (result) => {
        if(result){
            return response.json({'status': true, 'data': result});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'update error'});
        }
    });
});

router.put('/dislike', loginRequire, (request, response) => {
    data = {
        searchId: request.body.postId,
        userIdWhoLiked: request.user._id,
        action: "dislike"
    }
    findAndUpdate(post, data, (result) => {
        if(result){
            return response.json({'status': true, 'data': result});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'update error'});
        }
    });
});

router.put('/comment', loginRequire, (request, response) => {
    data = {
        comment: {
            text: request.body.text,
            commentUserId: request.user._id,
            commentUserName: request.user.name,
        },
        searchId: request.body.postId,
        action: "comment"
    }
    findAndUpdate(post, data, (result) => {
        if(result){
            return response.json({'status': true, 'data': result});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'update error'});
        }
    });
});

router.put('/deletePost', loginRequire, (request, response) => {
    data = {
        searchId: request.body.postId,
    }
    findAndDelete(post, data, (result) => {
        if(result){
            return response.json({'status': true, 'data': result});
        }
        else{
            return response.status(422).json({'status': false, 'message': 'delete error'});
        }
    });
});

module.exports = router;
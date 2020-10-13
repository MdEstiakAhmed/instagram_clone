const mongoose = require('mongoose');
const database = require('./database');
const {ObjectId} = mongoose.Schema.Types;

const postSchema = new mongoose.Schema({
    photo: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: false
    },
    likes: [{
        type: ObjectId,
        ref: "user"
    }],
    comments: [{
        text: String,
        commentUserId: String,
        commentUserName: String 
    }],
    postCreator: {
        type: ObjectId,
        ref: "user"
    }
});

module.exports = {
    storePost: (data, callback) => {
        database.insert(data, (result) => {
            callback(result);
        })
    },
    findUser: (model, data, callback) => {
        const obj = {
            email: data.email
        }
        database.findOne(model, obj, (result) => {
            callback(result);
        })
    },
    getAllPost: (model, data, callback) => {
        database.getDataWithPopulate(model, data, (result) => {
            callback(result);
        })
    },
    findAndUpdate: (model, data, callback) => {
        database.getIdAndUpdate(model, data, (result) => {
            callback(result);
        });
    }
}

mongoose.model('post', postSchema, 'post');
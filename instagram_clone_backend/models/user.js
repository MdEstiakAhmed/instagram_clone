const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;
const database = require('./database');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    followers: [
        {
            type: ObjectId,
            ref: 'user'
        }
    ],
    followings: [
        {
            type: ObjectId,
            ref: 'user'
        }
    ]
});

module.exports = {
    storeUser: (data, callback) => {
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
    getUser: (model, data, callback) => {
        database.getDataWithoutPopulate(model, data, (result) => {
            callback(result);
        })
    },
    findAndUpdate: (model, data, callback) => {
        database.getIdAndUpdate(model, data, (result) => {
            callback(result);
        });
    }
}

mongoose.model('user', userSchema, 'user');
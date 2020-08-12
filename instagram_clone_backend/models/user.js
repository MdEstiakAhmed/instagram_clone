const mongoose = require('mongoose');
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
    }
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
    }
}

mongoose.model('user', userSchema, 'user');
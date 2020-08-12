const mongoose = require('mongoose');

const getConnection = () => {
    mongoose.connect(process.env.DB_PATH, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })

    mongoose.connection.on('connected', (message) => {
        console.log("connected");
        return true;
    })
    mongoose.connection.on('error', (message) => {
        console.log("error");
        return false;
    });
}
getConnection();

module.exports = {
    findOne: (model, obj, callback) => {
        model.findOne(obj)
        .then((status) => {
            callback(status);
        })
        .catch(error => {
            callback(error);
        })
    },
    insert: (data, callback) => {
        data.save()
        .then(data => {
            callback(true);
        })
        .catch(error => {
            callback(false);
        })
    }
}
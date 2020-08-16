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
    },
    getDataWithPopulate: (model, data, callback) => {
        model.find(data.find)
        .populate(data.populateColumn, data.displayColumn)
        .then((results) => {
            callback(results)
        })
        .catch((error) => {
            callback(error);
        })
    },
    getDataWithoutPopulate: (model, data, callback) => {
        model.find(data.find, data.makeFalse)
        .then((results) => {
            callback(results)
        })
        .catch((error) => {
            callback(error);
        })
    }
}
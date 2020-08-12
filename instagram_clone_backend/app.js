const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(bodyParser.json());

app.use('/', require('./controllers/auth'));

// server setup start
app.listen(process.env.PORT || 5000, function(){
    console.log("project server started at: ", process.env.PORT);
});
// server setup end
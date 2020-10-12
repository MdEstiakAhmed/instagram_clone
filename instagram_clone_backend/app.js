const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());

app.use('/', require('./controllers/auth'));
app.use('/post', require('./controllers/post'));
app.use('/user', require('./controllers/user'));

// server setup start
app.listen(process.env.PORT || 5000, function(){
    console.log("project server started at: ", process.env.PORT);
});
// server setup end
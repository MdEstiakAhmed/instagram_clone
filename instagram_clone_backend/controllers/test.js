const express = require('express');
const { response } = require('express');
const router = express.Router();

router.get('/new', (request, response) => {
    response.send("test new");
})

router.get('/', (request, response) => {
    response.send("test empty");
})

module.exports = router;
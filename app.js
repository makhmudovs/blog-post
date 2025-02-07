const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose');
const config = require('./utils/config');
const logger = require('./utils/logger');
require('dotenv').config();


mongoose.connect(config.MONGODB_URL).then(() => {
    logger.info('connected to MongoDB');
})
    .catch(err => {
        logger.error('could not connect to MongoDB ', err);
    })

app.use(cors())
app.use(express.json())
app.use(express.static('dist'));


module.exports = app;

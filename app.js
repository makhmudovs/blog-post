const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
require('express-async-errors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const blogsRoutes = require('./controller/blog');
const userRoutes = require('./controller/user');
const loginRoutes = require('./controller/login');
const middleware = require('./middleware/middleware');
require('dotenv').config();


mongoose.connect(config.MONGODB_URL).then(() => {
    logger.info('connected to MongoDB');
})
    .catch(err => {
        logger.error('could not connect to MongoDB ', err);
    });

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));
app.use(middleware.requestLogger);

app.use(middleware.tokenExtractor);

app.use('/api/blogs', blogsRoutes);
app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

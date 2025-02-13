const logger = require('../utils/logger');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
    logger.info('Method: ', req.method);
    logger.info('Path: ', req.path);
    logger.info('Body: ', req.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({
        error: 'unknown endpoint'
    });
};

const errorHandler = (err, req, res, next) => {
    logger.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({
            error: 'malformed id'
        });
    } else if (err.name === 'ValidationError') {
        return res.status(400).send({
            error: err.message
        });
    } else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
        return res.status(400).json({
            error: 'expected `username` to be unique'
        });
    } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'token invalid'
        });
    } else if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'token expired'
        });
    }

    next(err);
};


const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
        const token = authorization.replace('Bearer ', '');
        req.token = token;
    } else {
        req.token = null;
    }
    next();
};

const userExtractor = async (req, res, next) => {

    const token = req.token;

    if (!token) {
        return res.status(401).json({
            error: 'Token invalid'
        });
    }
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if (!decodedToken.id) {
        return res.status(401).json({
            error: 'Token invalid'
        });
    }

    // Find the user and blog
    const user = await User.findById(decodedToken.id);

    if (user) {
        req.user = user;
    } else {
        req.user = null;
    }
    next();
};

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
};
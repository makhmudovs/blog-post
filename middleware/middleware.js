const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
    logger.info('Method: ', req.method);
    logger.info('Path: ', req.path);
    logger.info('Body: ', req.body);
    logger.info('---');
    next();
};

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
    logger.error(err.message);

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformed id' });
    } else if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message });
    }

    next(err);
};


module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
};
/**
 * @error handling
 * @operational error handling
 */
const AppError = require('../utils/app-errors');

const handleCastError = (err) => {
    const message = `Tour of id ${err.value} was not found!`;

    return new AppError(message, 404);
}

const handleDuplicates = (err) => {
    const message = `Tour name '${err.keyValue.name}' already exists!`;

    return new AppError(message, 400);
}

const handleValidation = (err) => {
    const fileds = Object.keys(err.errors);
    const message = `Invalid data for ${fileds.length >= 2 ? 'fields' : 'field'} ${fileds.join(', ')}.`;

    return new AppError(message, 400);
}

const sendToClient = (err, res) => {
    if(err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    }else {
        console.error(err)
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
}

const sentToDeveloper = (err, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sentToDeveloper(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        if (err.name === 'CastError') error = handleCastError(err);
        if (err.code === 11000) error = handleDuplicates(err);
        if (err.name === 'ValidationError') error = handleValidation(err);

        sendToClient(error, res);
    }
}

module.exports = errorHandler;
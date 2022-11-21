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

const handleTokenExpiredError = () => new AppError('Invalid token! Please login or signup.', 401);

const handleJsonWebTokenError = () => new AppError('Invalid token! Please login or signup.', 401);

const sendToClient = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')) {
        if(err.isOperational) {
          return  res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        console.error(err);
        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }

    return res.status(err.statusCode).render('error', {
        title: 'Page not found!',
        msg: err.message
    });
}

const sentToDeveloper = (err, req, res) => {
    if(req.originalUrl.startsWith('/api')) {
       return  res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }

    return res.status(err.statusCode).render('error', {
        title: 'Page not found!',
        msg: err.message
    });
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development') {
        sentToDeveloper(err, req, res);
    } else if (process.env.NODE_ENV === 'production') {
        let error = {...err};
        if (error.name === 'CastError') error = handleCastError(err);
        if (error.code === 11000) error = handleDuplicates(err);
        if (error.name === 'ValidationError') error = handleValidation(err);
        if (error.name === 'TokenExpiredError') error = handleTokenExpiredError();
        if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError();

        sendToClient(error, res);
    }
}

module.exports = errorHandler;
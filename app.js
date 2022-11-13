const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const errorHandler = require('./controllers/error-handler');
const AppError = require('./utils/app-errors');

const app = express();
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(express.json({limit: '10kb'}));
app.use(mongoSanitize());
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'price', 'maxGroupSize', 'difficulty']
}));

const rateLimiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too much request from this IP',
    standardHeaders: true
});

process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : '';

/**
 * @mounting routes
 */
app.use('/api', rateLimiter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.use('*', (req, res, next) => {
    next(new AppError('Route not implemented', 500));
});
app.use(errorHandler);

module.exports = app;
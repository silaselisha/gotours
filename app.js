const path = require('path');

const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const reviewsRouter = require('./routes/reviews');
const routesRouter = require('./routes/routes');
const bookingRouter = require('./routes/booking');
const errorHandler = require('./controllers/error-handler');
const AppError = require('./utils/app-errors');
const bookingHandler = require('./controllers/booking-handler');
const app = express();

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(cors());
app.use(xss());
app.use(express.json({limit: '10kb'}));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(hpp({
    whitelist: ['duration', 'ratingsAverage', 'ratingsQuantity', 'price', 'maxGroupSize', 'difficulty']
}));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

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
app.use('/', routesRouter);

app.use('/api', rateLimiter);
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use('*', (req, res, next) => {
    next(new AppError('Route not implemented', 500));
});
app.use(errorHandler);

module.exports = app;
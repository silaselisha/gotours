const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const toursRouter = require('./routes/tours');
const usersRouter = require('./routes/users');
const errorHandler = require('./controllers/error-handler');
const AppError = require('./utils/app-errors');

const app = express();

app.use(cors());
app.use(express.json());

process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : '';

/**
 * @mounting routes
 */
app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.use('*', (req, res, next) => {
    next(new AppError('Route not implemented', 500));
});
app.use(errorHandler);

module.exports = app;
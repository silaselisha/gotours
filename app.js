const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const toursRouter = require('./routes/tours');

const app = express();

app.use(cors());
app.use(express.json());

process.env.NODE_ENV === 'development' ? app.use(morgan('dev')) : '';

/**
 * @mounting routes
 */
app.use('/api/v1/tours', toursRouter);

module.exports = app;
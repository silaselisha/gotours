const express = require('express');
const {protect} = require('../controllers/authenticate');
const {bookingHandler} = require('../controllers/booking-handler');

const router = express.Router();

router.route('/checkout-session/:tourId')
    .get(protect, bookingHandler);

module.exports = router;
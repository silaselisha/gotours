const express = require('express');
const {tourHandler, overviewHandler, loginHandler, signupHandler, myAccountHandler, myBookedTours} = require('../controllers/routes-handler');
const {protect, isLoggedIn} = require('../controllers/authenticate');
const {bookingTour} = require('../controllers/booking-handler');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', bookingTour, overviewHandler);
router.get('/tour/:slug', protect, tourHandler);
router.get('/login', loginHandler);
router.get('/signup', signupHandler);
router.get('/me', protect, myAccountHandler);
router.get('/my-booked-tours', protect, myBookedTours)

module.exports = router
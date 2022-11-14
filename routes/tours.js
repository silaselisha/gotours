const express = require('express');
const authenticate = require('../controllers/authenticate');
const {createReview} = require('../controllers/reviews-handler');

const {protect, restrict} = authenticate;

const toursHandlers = require('../controllers/tours-handler');
const {createTour, cheapTopFiveTours,deleteTour, getAllTours, getTour, getStats, getToursMonthlyPlan,updateTour, } = toursHandlers;
const router = express.Router();

router.route('/top-five-cheap-tours')
    .get(protect, cheapTopFiveTours, getAllTours);

router.route('/tours-stats')
    .get(protect, getStats)

router.route('/tours-monthly-plan/:year')
    .get(protect, getToursMonthlyPlan)

router.route('/')
    .get(getAllTours)
    .post(protect, restrict('admin'), createTour)

router.route('/:tourId')
    .get(getTour)
    .patch(protect, restrict('admin'), updateTour)
    .delete(protect, restrict('admin'), deleteTour)

router.route('/:tourId/reviews')
    .post(protect, restrict('user'), createReview)

module.exports = router;
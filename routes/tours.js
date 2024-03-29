const express = require('express');
const authenticate = require('../controllers/authenticate');
const reviewsRouter = require('./reviews');

const {protect, restrict} = authenticate;

const toursHandlers = require('../controllers/tours-handler');
const {createTour, cheapTopFiveTours,deleteTour, getAllTours, getTour, getStats, getToursMonthlyPlan,updateTour, getToursWithin, getToursNearMe, upload, imageResize} = toursHandlers;

const router = express.Router();

router.use('/:tourId/reviews', reviewsRouter);

router.route('/top-five-cheap-tours')
    .get(protect, cheapTopFiveTours, getAllTours);

router.route('/tours-stats')
    .get(protect, getStats)

router.route('/tours-within/:distance/center/:lnglat/unit/:unit')
    .get(getToursWithin)

router.route('/tours-near-me/:lnglat').get(getToursNearMe)

router.route('/tours-monthly-plan/:year')
    .get(protect, getToursMonthlyPlan)

router.route('/')
    .get(getAllTours)
    .post(protect, restrict('admin', 'lead-guide'), createTour)

router.route('/:tourId')
    .get(getTour)
    .patch(protect, restrict('admin', 'lead-guide'), upload, imageResize, updateTour)
    .delete(protect, restrict('admin', 'lead-guide'), deleteTour)

module.exports = router;
const express = require('express');
const authenticate = require('../controllers/authenticate');

const {protect} = authenticate;

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
    .post(protect, createTour)

router.route('/:tourId')
    .get(getTour)
    .patch(protect, updateTour)
    .delete(protect, deleteTour)

module.exports = router;
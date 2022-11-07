const express = require('express');

const toursHandlers = require('../controllers/tours-handler');
const {createTour, cheapTopFiveTours,deleteTour, getAllTours, getTour, getStats, getToursMonthlyPlan,updateTour, } = toursHandlers;
const router = express.Router();

router.route('/top-five-cheap-tours')
    .get(cheapTopFiveTours, getAllTours);

router.route('/tours-stats')
    .get(getStats)

router.route('/tours-monthly-plan/:year')
    .get(getToursMonthlyPlan)

router.route('/')
    .get(getAllTours)
    .post(createTour)

router.route('/:tourId')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour)

module.exports = router;
const Tour = require('../models/tour-model');
const catchAsync = require("../utils/catch-async");

const overviewHandler = catchAsync(async (req, res, next) => {
    const tours = await Tour.find({});

    res.status(200).render('overview', {
        title: 'All Tours',
        tours
    });
});

const tourHandler = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({slug: req.params.slug}).populate('reviews');

    res.status(200).render('tour', {
        title: `${tour.name} Tour`,
        tour
    });
});

const loginHandler = catchAsync(async (req, res, next) => {

    res.status(200).render('login', {
        title: 'Login into your account'
    });
});

const signupHandler = catchAsync(async (req, res, next) => {

    res.status(200).render('signup', {
        title: 'Create your account'
    });
});

module.exports = {
    overviewHandler,
    tourHandler,
    loginHandler,
    signupHandler
}
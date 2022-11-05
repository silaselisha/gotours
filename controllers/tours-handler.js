const Tour = require('../models/tour-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-errors');
const ApiFeatures = require('../utils/api-features');

const cheapTopFiveTours = ((req, res, next) => {
    const limit = 5;

    req.query.limit = limit.toString();
    req.query.sort = '-ratingsAverage,price';
    req.query.limits = 'name,price,ratingsAverage,duration,difficulty,summary';

    next();
});

const getAllTours = (catchAsync(async (req, res, next) => {
    const apiFeatures = new ApiFeatures(Tour.find(), req.query);

    const features = apiFeatures.filtering().sorting().limitFields().pagination();
 
    const tours = await features.query;
    
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours
    });
}));

const getTour = catchAsync(async (req, res, next) => {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);

    if (!tour) {
        console.log(tour);
        return next(new AppError('Tour was not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: tour
    });
});

const createTour = catchAsync(async (req, res, next) => {
    const data = req.body;
    const tour = await Tour.create(data);

    if (!tour) {
        return next(new AppError('The tour was not created successfully', 400));
    }

    res.status(201).json({
        status: 'success',
        data: tour
    });
});

const updateTour = catchAsync(async (req, res, next) => {
    const { tourId } = req.params;
    const tour = await Tour.findById(tourId);

    if (!tour) {
        console.log(tour);
        return next(new AppError('Tour was not found!', 404));
    }

    res.status(200).json({
        status: 'success',
        data: tour
    });
});

const deleteTour = catchAsync(async (req, res, next) => {
    const { tourId } = req.params;
    const tour = await Tour.findByIdAndDelete(tourId);

    if (!tour) {
        return next(new AppError('Tour could not be found', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
});

const toursHandlers = {
    getAllTours,
    getTour,
    updateTour,
    deleteTour,
    createTour,
    cheapTopFiveTours
}

module.exports = toursHandlers;
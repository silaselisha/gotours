const Tour = require('../models/tour-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-errors');

const getAllTours = (catchAsync(async (req, res, next) => {
    const queryObject = {...req.query};
    const excludedItems = ['limits', 'fields', 'sort', 'page'];

    excludedItems.forEach((item) => delete queryObject[item]);

    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (item) => `$${item}`);

    let query = Tour.find(JSON.parse(queryString));

    /**
     * @sorting
     */
    if(req.query.sort) {
        const querySortBy = req.query.sort.split(',').join(' ');
        query = query.sort(querySortBy);
    }else{
        query = query.sort('-createdAt');
    }

    /**
     * @limiting
     */
    if(req.query.limits) {
        const queryLimiter = req.query.limits.split(',').join(' ');
        query = query.select(queryLimiter);
    }else {
        query = query.select('-__v');
    }

    /**
     * @pagination
     */
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
   
    const skip = (page - 1) * limit;
    
    query = query.skip(skip).limit(limit);
    
    const tours = await query;

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
    createTour
}

module.exports = toursHandlers;
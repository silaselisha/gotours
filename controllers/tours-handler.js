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
    const tour = await Tour.findById(tourId).populate('reviews');

    if (!tour) {
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
    const tour = await Tour.findByIdAndUpdate(tourId, req.body, {
        new: true,
        runValidators: true
    });
    
    if (!tour) {
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

const getStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {$match: {ratingsAverage: {$gte: 4.5}}},
        {$group: {
            _id: {$toUpper: '$difficulty'},
            averageRatings: {$avg: '$ratingsAverage'},
            averagePrice: {$avg: '$price'},
            minimumPrice: {$min: '$price'},
            maximumPrice: {$max: '$price'},
            totalTours: {$sum: 1}
        }},
        {$sort: {averageRatings: 1}}
    ]);

    res.status(200).json({
        status: 'success',
        data: stats
    })
});

const getToursMonthlyPlan = catchAsync(async(req, res, next) => {
    const year = parseInt(req.params.year);

    const monthlyPlan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`)}}
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                totalTours: {$sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $addFields: {month: '$_id'}
        },
        {
            $project: {_id: 0}
        },
        {
            $sort: {month: 1}
        }
    ]);

    res.status(200).json({
        status: 'success',
        data: monthlyPlan
    });
});

const getToursWithin = catchAsync(async (req, res, next) => {
    const {distance, lnglat, unit} = req.params;
    const [lat, lng] = lnglat.split(',');
    const radius = unit === 'mi' ? distance / 3958.8 : distance / 6371;
  
    if(!lng || !lat) {
        return next(new AppError('Longitude or Latitude are missing!', 400));
    }

    const tours = await Tour.find({startLocation: {$geoWithin: {$center: [[lng, lat], radius]}}});

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours
    });
});

const getToursNearMe = catchAsync(async (req, res, next) => {
    const [lat, lng] = req.params.lnglat.split(',');
    const unit = req.query.unit;

    if(!lng || !lat) {
        return next(new AppError('Longitude or Latitude are missing!', 400));
    }

    const multiplier = unit === 'mil' ? 0.000621371 : 0.001; 
    const tours = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        }, 
        {
            $project: {
                distance: 1,
                name: 1
            }
        }
    ]);

    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: tours
    });
});

const toursHandlers = {
    getAllTours,
    getToursWithin,
    getToursNearMe,
    getTour,
    getStats,
    getToursMonthlyPlan,
    updateTour,
    deleteTour,
    createTour,
    cheapTopFiveTours
}

module.exports = toursHandlers;
const Review = require('../models/review-model');
const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-errors');
const ApiFeatures = require('../utils/api-features');


const createReview = catchAsync(async (req, res, next) => {
    const newReview = await Review.create(req.body);

    if(!newReview) {
        return next(new AppError('Could not create this review!', 400));
    }

    res.status(201).json({
        status: 'success',
        data: newReview
    });
});

const getAllReviews = catchAsync(async (req, res, next) => {
    const features = new ApiFeatures(Review.find(), req.query)
                        .filtering()
                        .limitFields()
                        .sorting()
                        .pagination();

    const reviews = await features.query;

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: reviews
    });
});

const getReview = catchAsync(async (req, res, next) => {
    const {id} = req.params;
    const review = await Review.findById(id);

    if(!review) {
        return next(new AppError('The review was not found!', 404));
    }
    res.status(200).json({
        status: 'success',
        data: review
    });
});

const updateReview = catchAsync(async (req, res, next) => {  
    const { id } = req.params;

    const review = await Review.findByIdAndUpdate(id , req.body, {
        new: true,
        runValidators: true
    });

    if (!review) {
        return next(new AppError('The review was not found!', 404));
    }
    res.status(200).json({
        status: 'success',
        data: review
    });
});

const deleteReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
        return next(new AppError('The review was not found!', 404));
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});

module.exports = {
    createReview,
    getAllReviews,
    getReview,
    updateReview,
    deleteReview
}
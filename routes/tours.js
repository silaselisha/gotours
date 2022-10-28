const express = require('express');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');
const Tour = require('../models/tour-model');

const router = express.Router();

router.route('/')
    .get(catchAsync(async (req, res, next) => {
        const tours = await Tour.find({});

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: tours
        }); 
    }))
    .post(catchAsync(async(req, res, next) => {
        const data = req.body;
        const tour = await Tour.create(data);

        if(!tour) {
            return next(new AppError('The tour was not created successfully', 400));
        }

        res.status(201).json({
            status: 'success',
            data: tour
        });
    }))

router.route('/:tourId')
    .get(catchAsync(async (req, res, next) => {
        const {tourId} = req.params;
        const tour = await Tour.findById(tourId);

        if(!tour) {
            return next(new AppError('Tour was not found!', 404));
        }

        res.status(200).json({
            status: 'success',
            data: tour
        });
    }))
    .patch(catchAsync(async(req, res, next) => {
        const {tourId} = req.params;
        const data = req.body;
        const tour = await Tour.findByIdAndUpdate(tourId, data, {
            runValidators: true,
            new: true
        });

        if (!tour) {
            return next(new AppError('Tour was not found!', 404));
        }

        res.status(200).json({
            status: 'success',
            data: tour
        });
    }))
    .delete(catchAsync(async (req, res, next) => {
        const {tourId} = req.params;
        const tour = await Tour.findByIdAndDelete(tourId);

        if(!tour) {
            return next(new AppError('Tour could not be found', 404));
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    }))

module.exports = router;
const fs = require('fs');
const path = require('path');

const express = require('express');

const AppError = require('../utils/app-errors');
const catchAsync = require('../utils/catch-async');

const router = express.Router();

const tours = JSON.parse(fs.readFileSync(path.join('dev-data', 'tours.json'), 'utf-8'));


router.route('/')
    .get(catchAsync(async (req, res, next) => {

        res.status(200).json({
            status: 'success',
            data: tours
        }); 
    }))

module.exports = router;
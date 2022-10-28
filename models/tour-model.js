const mongoose = require('mongoose');

const TourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'tour name should be provided'],
        trim: true,
        unique: [true, 'tours should have a unique name'],
        minLength: 8,
        maxLength: 40,
    },
    duration: {
        type: Number,
        required: [true, 'tour should have a duration'],
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'tour shoul have a maximin number of tourist to accomodate'],
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: '{VALUE} is not supported',
        },
        required: [true, 'tour should have it difficulty level'],
    },
    ratingsAverage: {
        type: Number,
        min: [1, 'ratings avearge should be equal to 1 or greater than 1'],
        max: [5, 'ratings avearge should be equal to 5 or less than 5'],
    },
    ratingsQuantity: {
        type: Number,
    },
    price: {
        type: Number,
        required: [true, 'tour should have a price'],
    },
    summary: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'tour should have a detailed description'],
    },
    imageCover: {
        type: String,
        required: [true, 'tour should have an image cover']
    },
    images: [String],
    startDates: [Date],
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
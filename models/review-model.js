const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'provide your review, based on your experience.']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'review must belong to a specific user'],
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'review must belong to a specific tour'],
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
const mongoose = require('mongoose');
const Tour = require('../models/tour-model');

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

/**
 * @calculate reviews
 * @ratingsAverage
 * @ratingsQuantity
 * @static methods
 */
ReviewSchema.statics.calculateReviews = async function(toursId) {
    const reviewsData = await this.aggregate([
        {
            $match: {tour: toursId}
        },
        {
            $group: {
                _id: '$tour',
                ratingsAverage: {$avg: '$rating'},
                ratingsQuantity: {$sum: 1}
            }
        }, 
        {
            $project: { 
                ratingsAverage: {$round: ['$ratingsAverage', 2]},
                ratingsQuantity: {$round: ['$ratingsQuantity', 1]}
            }
        }
    ]);

    await Tour.findByIdAndUpdate(toursId, {
        ratingsAverage: reviewsData[0].ratingsAverage,
        ratingsQuantity: reviewsData[0].ratingsQuantity
    }, {
        new: true,
        runValidator: true
    });
}

ReviewSchema.post('save', function(docs, next) {
    this.constructor.calculateReviews(docs.tour);

    next();
});

ReviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'user',
        select: 'name photo'
    });
    
    next();
});


const Review = mongoose.model('Review', ReviewSchema);

module.exports = Review;
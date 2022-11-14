const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./user-modle');

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
        default: 4.5,
    },
    ratingsQuantity: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: [true, 'tour should have a price'],
    },
    priceDiscount: {
        type: Number
    },
    summary: {
        type: String,
        trim: true,
        required: [true, 'tour should have a detailed description'],
    },
    description: {
        type: String,
        trim: true,
    },
    imageCover: {
        type: String,
        required: [true, 'tour should have an image cover']
    },
    images: [String],
    startDates: [Date],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    slug: String,
    secrete: {
        type: Boolean,
        default: false
    },
    discount: {
        type: Number,
        validate: {
            validator: function() {
                return this.discount < this.price;
            },
            message: 'discount should be less than the price'
        }
    },
    startDates: [Date],
    startLocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point',
        },
        coordinates: [Number],
        address: String,
        description: String,
    },
    locations: [{
        type: {
            type: String,
            enum: ['Point'],
            default: 'point',
        },
        coordinates: [Number],
        day: Number,
        description: String
    }],
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }],
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

/**
 * @Hooks
 * @PreHooks
 * @PostHooks
 * @Vitrual properties
 */
TourSchema.virtual('weeks').get(function() {
    return parseFloat(this.duration / 7).toPrecision(2) * 1;
});

TourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

TourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {
        lower: true
    });

    next();
});

TourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt'
    });

    next();
});

TourSchema.pre(/^find/, function(next) {
    this.find({secrete: {$ne: true}});

    next();
});

TourSchema.pre('aggregate', function(next) {
    this.pipeline().unshift({$match: {secrete: {$ne: true}}});

    next();
});

const Tour = mongoose.model('Tour', TourSchema);

module.exports = Tour;
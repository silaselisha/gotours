const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking should be tour specific']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking should be user specific']
    },
    price: {
        type: Number,
        required: [true, 'price should be provided']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    }
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

/**
 *@query_middleware hooks (pre|post)
 */
bookingSchema.post(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name, price'
    });

    next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
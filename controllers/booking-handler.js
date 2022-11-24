const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const catchAsync = require('../utils/catch-async');
const AppError = require('../utils/app-errors');
const Tour = require('../models/tour-model');

const bookingHandler = catchAsync(async (req, res, next) => {
    /**
     * @create stripe checkout session
     * @configure stripe checkout session
     * @send session checkout as a server response
     */
    const tour = await Tour.findById(req.params.tourId);
    console.log(`${req.protocol}://${req.get('host')}/`)
    console.log(`${req.protocol}://${req.get('host')}/tours/${tour.slug}`)

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}/`,
        cancel_url: `${req.protocol}://${req.get('host')}/tours/${tour.slug}`,
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,
        line_items: [
            {
                price_data: {
                    currency: 'usd', 
                    unit_amount: tour.price,
                    product_data: {
                        name: tour.name,
                        description: tour.summary,
                        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
                    }
                },
                quantity: 1,
            }
        ],
        mode: 'payment'
    });

    res.status(200).json({
        status: 'success',
        data: session
    });
});

module.exports = bookingHandler;
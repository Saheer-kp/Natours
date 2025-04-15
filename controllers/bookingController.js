// const jwt = require('jsonwebtoken');
// const { promisify } = require('util')
// const User = require('../models/userModal');

// const { verify } = require('crypto');
// const Email = require('../utils/email');
// const crypto = require('crypto');

const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./../controllers/factoryHandler');
const Booking = require('../models/bookingModel');

const stripe = require('stripe')(process.env.STRIPE_SECRET);

exports.checkoutSession = catchAsync(async(req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        success_url: `${req.protocol}://${req.get('host')}?tour=${tour.id}&user=${req.user.id}&price=${tour.price}`,
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
        customer_email: req.user.email,
        shipping_address_collection: {
            allowed_countries: ['IN'], // Add the countries you want to allow
        },
        billing_address_collection: 'required', // This will require the billing address
        mode: 'payment',
        client_reference_id: tour.id,
        line_items: [
            {
                price_data: {
                    currency: 'inr',
                    unit_amount: tour.price * 100,
                    product_data: {
                      name: `${tour.name} tour`,
                      description: tour.description
                    },
                  },
                quantity: 1
            }
        ],
    });

    res.status(200).json({
        status: "success",
        session
    });
});

exports.booking = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;

    if(!tour || !user || !price)
        return next();

    await Booking.create({ tour, user, price });

    res.redirect('/');
});

exports.allBookings = factory.getAll(Booking);
exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.upadateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);



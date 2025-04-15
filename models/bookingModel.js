const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'A tour must belongs to booking']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'A user must belongs to booking']
    },
    price: {
        type: Number,
        required: [true, 'A tour must have price']
    },
    paid: {
        type: Boolean,
        default: true
    }
},
{
    timestamps: true, // Automatically add createdAt and updatedAt fields
});

bookingSchema.pre(/^find/, function(next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name'
    });

    next();
})

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
const mongoose = require('mongoose');



const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'The review is required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'The rating is required']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'The review must belongs to a tour']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'The review must belongs to a user']
    }
},
// this is needed to set virtual properties
{
    toJSON: { virtuals: true },
    toObject: { virtuals : true}
})

reviewSchema.pre(/^find/, function(next) {
    // this.populate({
    //     path:'tour',
    //     select: "name price startLocation"
    // }).populate({
    //     path:'user',
    //     select: "name email"
    // })

    // /removed tour populate as this is listing with tour
    this.populate({
        path:'user',
        select: "name email"
    });

    next();
})

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
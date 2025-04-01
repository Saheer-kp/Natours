const mongoose = require('mongoose');
const Tour = require('./tourModel');



const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'The review is required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'The rating is required'],
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
});

reviewSchema.index({ user:1, tour: 1 }, { unique: true });

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
        select: "name email photo"
    });

    next();
});

///////////   CALCULATING TOUR REVIEW COUNT AND AVG OF RATINGS     /////////////////

reviewSchema.statics.calculateRating = async function (tourId) {
    const stats = await this.aggregate([
        {
            $match: { tour: tourId }
        },
        {
            $group: {
                _id: "$tour",
                nRating: { $sum: 1 },
                avgRating: { $avg: '$rating' }
            }
        }
    ]);

    await Tour.findByIdAndUpdate(tourId, {
        ratingsAverage: stats.length ? stats[0].avgRating : 4.5,
        ratingsQuantity: stats.length ? stats[0].nRating : 0,
    })

    console.log(stats);
    
};

reviewSchema.post('save', function(){
    this.constructor.calculateRating(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next){
    this.rv = await this.findOne();
    next();
});

reviewSchema.post(/^findOneAnd/, async function(){
    // this.find will not be work as it is already executed
    await this.rv.constructor.calculateRating(this.rv.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
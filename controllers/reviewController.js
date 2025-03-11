const Review = require("../models/reviewModel");
const factory = require('./../controllers/factoryHandler');


exports.setReviewTourUserIds = (req, res, next) => {
    if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    next();
}

////////////////////// GET TOUR REVIEWS  ////////////////
// exports.reviews = catchAsync(async (req, res, next) => {
//     let filter = {};

//     if(req.params.tourId) filter = { tour: req.params.tourId };
//     const reviews = await Review.find(filter);

//     res.status(200).json({
//         success: true,
//         results: reviews.length,
//         data: {reviews}
//     })
// });

exports.reviews = factory.getAll(Review);

exports.review = factory.getOne(Review);

// exports.store = catchAsync(async (req, res, next) => {

//     // if(!req.body.tour) req.body.tour = req.params.tourId;
//     // if(!req.body.user) req.body.user = req.user.id;       ///  moved to middleware at the top
//     const review = await Review.create(req.body);

//     res.status(201).json({
//         success: true,
//         data: {review}
//     })
// });


exports.store = factory.createOne(Review);

exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);

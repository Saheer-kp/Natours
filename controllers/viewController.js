const Tour = require('../models/tourModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.overView = catchAsync(async (req, res, next) => {

    const tours = await Tour.find()
    res.status(200).render('overview', {
     title: 'All Tours',
     tours
    });
});

exports.tour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findOne({ slug: req.params.slug }).populate('reviews');
    // return res.status(200).json(tour);

    if(!tour)
        return next(new AppError('Oops, The tour data is not found..', 404))
    res.status(200).render('tour', {
     title: tour.name,
     tour
    });
 });
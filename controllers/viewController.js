const Tour = require('../models/tourModel');
const User = require('../models/userModal');
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

 exports.profile = catchAsync(async (req, res, next) => {
    res.status(200).render('account', {
        title: 'Profile',
    });
 });
 
 exports.updateProfile = catchAsync(async (req, res, next) => {
    console.log(req.body);
    const updateUser = await User.findByIdAndUpdate(req.user.id, {
        name: req.body.name,
        email: req.body.email,
    }, {
        new: true,  //get the updated document as new refreshed data
        runValidators: true
    });

    res.locals.user = updateUser;
    res.status(200).redirect('/profile');
    // res.status(200).render('account', {
    //     title: 'Profile',
    //     user: updateUser 
    // });
 });
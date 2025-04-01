const catchAsync = require('../utils/catchAsync');


exports.login = catchAsync(async (req, res, next) => {
    res.status(200).render('login', {
     title: 'Login',
    });
});
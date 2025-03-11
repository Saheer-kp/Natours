const jwt = require('jsonwebtoken');
const { promisify } = require('util')
const User = require('../models/userModal');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { verify } = require('crypto');
const sendEmail = require('../utils/email');
const crypto = require('crypto');


const sendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
    };

    if(process.env.NODE_ENV == 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
}

const signToken = id => {
   return jwt.sign({id: id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}


exports.signup = catchAsync(async (req, res, next) => {
    // const user = await User.create(req.body) // this is security issue
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        role: req.body.role
    })

    sendToken(user, 201, res);

    // const token = signToken(user._id);

    // res.status(200).json({
    //     status: 'success',
    //     token,
    //     data: {
    //         user
    //     }
    // });
});

exports.login = async (req, res, next) => {
    
    const {email, password} = req.body;

    //checking input data
    if(!email || !password) 
        return next(new AppError('Please provide email and password', 400));

    //checking user existing in db
    const user = await User.findOne({email}).select('+password');  // selecting password as explicitly as it is hidden by default in model.
    
    if(!user || !user.correctPassword(password, user.password)) 
        return next(new AppError('Incorrect email or password'), 401);

    res.status(200).json({
        status: 'success',
        token: signToken(user._id)
    });
};

exports.protect = catchAsync(async (req, res, next) => {
    //getting token and verification
    let token;
    
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer ')){
        token = req.headers.authorization.split(' ')[1];
    }
  
    if(!token)
        return next(new AppError('Unauthenticated', 401));

    //verify token with jwt
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // verify the user is stille exists;
    const authUser = await User.findById(decoded.id);
    if(!authUser)
        return next(new AppError('Unauthenticated, User not exist', 401));

    
    // verify the user password is changed after token was issued
    console.log(authUser.changedPasswordAfter(decoded.iat));
    
    if(authUser.changedPasswordAfter(decoded.iat)) {
     return next(new AppError('Unauthenticated, password changed, session expired', 401));
    }
        
    //gerant access
    req.user = authUser;
    next();
    
});

exports.restrictedTo = (...roles) => {
    
    return (req, res, next) => {
        if(!roles.includes(req.user.role)) 
            return next(new AppError('Unauthorized to access', 403));

        next();
    }
    
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email});

    if(!user) return next(new AppError('User not found', 404));

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send email
    const resetUrl= `${req.protocol}://${req.get('host')}/api/v1/users/reset-password/${resetToken}`;

    const message = `Your password reset link \n ${resetUrl}`; 

   try {
    await sendEmail(
        {
            email: user.email,
            subject: 'Your password reset link',
            message
        }
    );

    res.status(200).json({
        status: 'success',
        message: "password reset link send successfully."
    });
   } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('mail sending failed', 500));
   }
    
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    const token = crypto.createHash('sha256').update(req.params.token).digest('hex');
    console.log(token);
    
    const user = await User.findOne({ passwordResetToken: token, passwordResetExpires: {$gt: Date.now()} });

    if(!user) return next(new AppError('Invalid token or token has expired', 400));

    user.password = req.body.password,
    user.passwordConfirm  = req.body.passwordConfirm
    user.passwordResetToken = undefined,
    user.passwordResetExpires = undefined
    await user.save();

    // const signTokenn = signToken(user._id);
    // res.status(200).json({
    //     status: 'success',
    //     token: signTokenn
    // });
    sendToken(user, 200, res);

});

exports.changePassword = catchAsync(async(req, res, next) => {

    // get user 

    const user = await User.findById(req.user.id).select('+password');

    // const currentPassword = crypto.createHash('sha256').update(req.body.current_password).digest('hex');

    if(!user.correctPassword(req.body.currentPassword, user.password)) {
        return next(new AppError('The current password is incorrect', 400));
    }

    user.password = req.body.password;
        user.passwordConfirm  = req.body.passwordConfirm
        await user.save();
        sendToken(user, 200, res);
});


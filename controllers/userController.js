const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModal");

const filterObj = (obj, ...fields) => {
    const data = {};
    Object.keys(obj).forEach(el => {
        if(fields.includes(el)) data[el] = obj[el];
    });

    return data;
};

exports.getUsers =  catchAsync(async (req, res, next) => {

    const users = await User.find();

        res.status(200).json({
            success: true,
            results: users.length,
            data: {
                users,
            }
        });
});
exports.getUser =  (req, res) => {}
exports.createUser =  (req, res) => {}
exports.updateUser =  (req, res) => {}
exports.deleteUser =  (req, res) => {}

exports.updateMyData =  catchAsync(async (req, res, next) => {

    if(req.body.password || req.body.passwordConfirm)
        return next(new AppError('Cannot update password', 400));

    const filteredData = filterObj(req.body, 'name', 'email');
    const user = await User.findByIdAndUpdate(req.user.id, filteredData, {
        isNew: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });

});

exports.deleteMe =  catchAsync(async (req, res, next) => {
     await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        success: true,
        message: 'User deleted successfully'
    });

});
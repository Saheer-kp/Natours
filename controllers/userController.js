const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModal");

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
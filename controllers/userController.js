const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("./../models/userModal");
const factory = require('./../controllers/factoryHandler');

const multer = require('multer');
// const sharp = require("sharp");

//this is for normal file upload without resize
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {  //cd means callback
        cb(null, 'public/img/users')
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `user-${req.user.id}-${Date.now()}.${ext}`)
    }
});

// const multerStorage = multer.memoryStorage();  //this way the image is stored on the memory to resize, then upload

const multerFilter = (req, file, cb) => {  //cd means callback
    if(!file.mimetype.startsWith('image'))
        cb(new AppError('File must be image', 400), false)
    cb(null, true);
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserImage = upload.single('image');

// exports.resizeImage = (req, res, next) => {
//     if(!req.file) return next();
//     req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`  //this is needed to upload, in memery storage ther is no filename property
//     sharp(req.file.buffer).resize(500, 500).toFormat('jpeg').jpeg({ quality: 90 }).toFile(req.file.filename );
//     next();
// }

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

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};
exports.getUser = factory.getOne(User);
exports.createUser =  (req, res) => {}
exports.updateUser =  (req, res) => {}
exports.deleteUser =  (req, res) => {}

exports.updateMyData =  catchAsync(async (req, res, next) => {

    console.log(req.file, req.body);
    
    if(req.body.password || req.body.passwordConfirm)
        return next(new AppError('Cannot update password', 400));

    const filteredData = filterObj(req.body, 'name', 'email');
    if(req.file) filteredData.photo = req.file.filename;

    console.log(filteredData);
    
    const user = await User.findByIdAndUpdate(req.user.id, filteredData, {
        isNew: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        status: 'success',
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
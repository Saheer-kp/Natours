const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    
    if(!doc)
        return next(new AppError('The document is not found', 404));

    res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
    });

});

exports.updateOne = Model => catchAsync( async (req, res, next) => 
{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if(!doc)
        return next(new AppError('The Document is not found', 404));

    res.status(200).json({
        message: 'success',
        data: {
            data: doc
        }
    });
});

exports.createOne = Model => catchAsync(async (req, res) => {
    const doc = await Model.create(req.body);
    res.status(200).json({
        message: 'success',
        data: {
            data: doc
        }
    });
});

exports.getOne = (Model, populateOptions) => catchAsync(async (req, res, next) => {
    
    let query = Model.findById(req.params.id);
    if(populateOptions) query.populate(populateOptions);

    const doc = await query;

    if(!doc)
        return next(new AppError('The tour is not found', 404));
    
     res.status(200).json({
        succss: true,
        data: {
            data: doc
        }
    });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {

    // this actually a hack for timebeign accoring to the course, need to find a goood solution
    let filter = {};
    if(req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().paginate();
    const docs = await features.query;

    res.status(200).json({
        success: true,
        results: docs.length,
        data: {
            data: docs,
        }
    });     
});

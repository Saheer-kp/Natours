const fs = require('fs');
const Tour = require('../models/tourModel');
const { match } = require('assert');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');




// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'));

// route param middleware
// exports.checkId = (req, res, next, val) => {
//     id = Number(val);    
//     const tour = tours.find(tour => tour.id === id);

//     if(!tour)
//     return res.status(404).json({
//         status: false,
//         message: 'Tour not found',
//     }); 
//     next();
// };

//customer middleware
// exports.validateRequest = (req, res, next) => {
//     if(!req.body.name)
//         return res.status(400).json({
//             status: false,
//             'message': 'Invalid request body'
//         });

//     next();
        
// }


exports.topFiveCheap = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-price,ratingsAverage';
    req.query.fields = 'name,price,ratingsAverage,duration';
    next();
};

exports.getTours = async (req, res) => {

    try {

        /****  making an hard copy of the request query  ******/
        // const queryObj = req.query   => this will not copy, it storing same reference to the queryObj, so need to use destructuring
        // const queryObj = {...req.query} // creating a new query object
        // const excludedFields = ['page', 'limit', 'sort', 'fields'];
        // excludedFields.forEach(field => delete queryObj[field]);


        // //Advanced filtering
        // let queryStr = JSON.stringify(queryObj);
        // queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //replacing gt to $gt and so on
        
        
        // let query = Tour.find(JSON.parse(queryStr));

        /************ query using moongoss methods **************/
         
            // const tours = await Tour.find()
            // .where('duration').equals(req.query.duration)
            // .where('difficulty').equals(req.query.difficulty);
        // console.log(req.query.sort);
        

        // //sorting
        // if(req.query.sort){
        //     const sortBy = req.query.sort.split(',').join(' ');
        //     query = query.sort(sortBy); //mongoose accept mutiple columns as sort and '-' is used to desc
        // }else {
        //     query = query.sort('-createdAt');
        // }

        
        //selecting/ignoring specific fields
        // if(req.query.fields){
        //     const fields = req.query.fields.split(',').join(' ');
        //     query = query.select(fields); //mongoose accept mutiple columns as sort and '-' is used to desc
        // }else {
        //     query = query.select('-__v');  //ignore __v field
        // }

        //pagination
        // const page = req.query.page * 1 || 1;  //*1 means casting to number
        // const limit = req.query.limit * 1 || 10;
        // const skip = (page - 1) * limit;
        // console.log(skip, 'skip');
        
        // query = query.skip(skip).limit(limit);

        // if(req.query.page) {
        //     const totalTours = await Tour.countDocuments();
        //     if(skip >= totalTours) throw new Error('Page not available');
        // }
           
        
        // const tours = await query; 

        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().paginate();
        const tours = await features.query;

        res.status(200).json({
            success: true,
            results: tours.length,
            data: {
                tours,
            }
        });
    } catch (error) {
        res.status(500).json({
            succss: false,
            message: 'Something went wrong',
            error: error
        });
    }

    
}

/****************** GET TOUR ***************/
// exports.getTour = async (req, res) => {
//     // id = Number(req.params.id);    
//     // const tour = tours.find(tour => tour.id === id);

//     try {

//         const tour = await Tour.findById(req.params.id);
//         //findById is a mongo function for findOne({_id: tour.id})
        
//         if(tour)
//             return res.status(200).json({
//                 succss: true,
//                 data: {
//                     tour
//                 }
//             });
//         res.status(404).json({
//             succss: false,
//             message: 'Not found',
//         });    
//     } catch (error) {
//         res.status(500).json({
//              succss: false,
//              message: 'Something went wrong',
//              error: error
//         }); 
//     }    
// }

exports.getTour = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.id);
    //findById is a mongo function for findOne({_id: tour.id})
    
    if(!tour)
        return next(new AppError('The tour is not found', 404));
    
     res.status(200).json({
        succss: true,
        data: {
            tour
        }
    });
});



// before catchAsync()
// exports.createTour = async (req, res) => {
//     // id = tours.length + 1;
    
//     // const tour = Object.assign({id: id}, req.body);
//     // tours.push(tour);
//     // //using this because in callback event, writeFileSync is a syncronous
//     // fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>  {
//     //     if(!err){
//     //         res.status(200).json({
//     //             message: 'success',
//     //             data: {
//     //                 tour
//     //             }
//     //         });
//     //     }
//     // });  

//     try {
//         const tour = await Tour.create(req.body);
//         res.status(200).json({
//             message: 'success',
//             data: {
//                 tour
//             }
//         });
//     } catch (error) {
//         res.status(422).json({
//             message: 'success',
//             error: error
//         });
//     }
    
    
    
// }

// after catchAsync()
exports.createTour = catchAsync(async (req, res) => {
    const tour = await Tour.create(req.body);
    res.status(200).json({
        message: 'success',
        data: {
            tour
        }
    });
});


/***************** UPDATE TOUR *****************/
// exports.updateTour =  async (req, res) => 
// {
//     try {
//         const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//             new: true,
//             runValidators: true
//         });
//         res.status(200).json({
//             message: 'success',
//             data: {
//                 tour
//             }
//         });
//     } catch (error) {
//         res.status(422).json({
//             staus: false,
//             error: error
//         });
//     }
// }

exports.updateTour = catchAsync( async (req, res) => 
    {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if(!tour)
            return next(new AppError('The tour is not found', 404));

        res.status(200).json({
            message: 'success',
            data: {
                tour
            }
        });
    });

/******************  DELETE TOUR **********/    
// exports.deleteTour = async (req, res) => 
// {
//     try {
//         const tour = await Tour.findByIdAndDelete(req.params.id);
//         res.status(200).json({
//             success: true,
//             message: 'Tour deleted successfully',
//         });
//     } catch (error) {
//         res.status(500).json({
//             staus: false,
//             message: 'Something went wrong',
//             error: error
//         });
//     }

// }

exports.deleteTour = catchAsync(async (req, res) => 
{
    const tour = await Tour.findByIdAndDelete(req.params.id);
    
    if(!tour)
        return next(new AppError('The tour is not found', 404));

    res.status(200).json({
        success: true,
        message: 'Tour deleted successfully',
    });

});

exports.tourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: null, // null means not group by speacific fields
                    // _id: '$difficulty',
                    _id: { $toUpper: '$difficulty'},
                    // _id: '$ratingsAverage',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                }
            },
            {
                $sort: { avgPrice: 1 } //1 asc, 
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } } // ne = not equal
            // }
        ]);
        res.status(200).json({
            message: 'success',
            data: {
                stats
            }
        });

    } catch (error) {
        res.status(500).json({
            staus: false,
            message: 'Something went wrong',
            error: error
        });
    }
}

exports.toursPlan = async (req, res) => {
    try {

        const year = req.params.year * 1;
        const stats = await Tour.aggregate([
            {
                $unwind: "$startDates"
            },
            {
                $match: { 
                    startDates: { $gte: new Date(`${year}-01-01`) },
                    startDates: { $lte: new Date(`${year}-12-31`) },
                 }
            },
            {
                $group: {
                    _id: { $month: '$startDates'},
                    numTours: { $sum: 1 },
                    tours: { $push: "$name"}
                }
            },
            {
                $addFields: {
                    month: "$_id"
                }
            },
            {
                $project: {_id: 0}
            },
            {
                $sort: {
                    numTours: -1
                }
            },
            {
                $limit: 2
            }
             
        ]);
        res.status(200).json({
            message: 'success',
            data: {
                stats
            }
        });

    } catch (error) {
        res.status(500).json({
            staus: false,
            message: 'Something went wrong',
            error: error
        });
    }
}
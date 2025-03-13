const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const User = require('./userModal');

const tourSchema = mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Tour must have a name'],
        unique: true,
        trim: true,
        maxlength: [20, 'Tour name must not be exceed 20 characters'],
        minlength: [10, 'Tour name must be at least 10 characters'],
        // validate: [validator.isAlpha, 'Name must be only contains letters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, 'Tour must have a duration'],
    },
        maxGroupSize: {
        type: Number,
        required: [true, 'Tour must have a group size'],
    },
    difficulty: {
        type: String,
        required: [true, 'Tour must have a difficulty'],
        enum: {
            values: ['easy', 'medium', 'difficult'], // Allowed values
            message: 'Difficulty must be either: easy, medium, or difficult' // Custom error message
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1.0, 'Rating must be alteast 1.0'],
        max: [5.0, 'Rating must not be exceed 5.0'],
        set: val => Math.round(val * 10) / 10  
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price:{
        type: Number,
        required: [true, 'Tour must have a price'],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return this.price > val;
            },
            message: 'Price discount ({VALUE}) must be less than actual price'
        }
    },
    summary: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'Tour must have a description']
    },
    imageCover: {
        type: String,
        required: [true, 'Tour must have a cover image']
    },
    images: [String], // array of strings
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false // hides the field permanently -- usefull for password
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [{
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
    }],
    // guides: Array // THIS IS USED FOR EMBEDED REFERENCING
    guides: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
}, 
// this is needed to set virtual properties
{
    toJSON: { virtuals: true },
    toObject: { virtuals : true}
});

// tourSchema.index({ price: 1 });  // single index, indexing one by one, it will not be deleted after add in db, need to delete manually.
tourSchema.index({ price: 1, ratingsAverage: -1 });  // compound index (indexing mutiple fields);
tourSchema.index({ slug: 1 });

//this is geo spatial value field, so need to use 2d if fictional point or 2dsphere if the data is real points index
tourSchema.index({ startLocation: '2dsphere' })

//virtual properties - like laravel accessor
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});


// VIRTUAL POPULATE
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
})

/***************** MONGOOS MIDDLEWARES ***************/
// just like as laravel observer

// 1. DOCUMENT MIDDLEWARES

// 1. Pre MIDDLEWARE  - runs when create() || save(), not runs in insert many
tourSchema.pre('save', function (next) {    
    this.slug = slugify(this.name, {lower: true});
    next();
});

// can use same middlware twice.
// tourSchema.pre('save', function (next) {
//     console.log('called second time');
// });

// 2. Post MIDDLEWARE
// tourSchema.post('save', function (next) {
//     console.log(this);

// });


/**************  THIS IS USED FOR EMBEDED USER REFERENCING - NOT RECOMMENTED AT ALL  */
// tourSchema.pre('save', async function (next) {
//     const guidePromises = this.guides.map(async id => await User.findById(id));
    
//     this.guides = await Promise.all(guidePromises);
//     next();
// });


// 2. QUERY MIDDLEWARE

// 1.  pre

// tourSchema.pre('find', function (next) {  // this is only works for find() but there many method starting find keyword
//     this.find({ secretTour: { $ne: true }});
//     next();
// });

// to address the issue to give all the find method need regular expression
tourSchema.pre(/^find/, function (next) {  // this is only works for find() but there many method starting find keyword
    this.find({ secretTour: { $ne: true }});
    next();
});
tourSchema.pre(/^find/, function (next) {  // this is only works for find() but there many method starting find keyword
    this.populate({
        path: 'guides',
        select: "-__v -passwordChangedAt"
    }); 
    next();
});

// 2. post
tourSchema.post(/^find/, function (docs, next) { 
    // console.log(docs);
    next();
});

// 3. AGGREGATION MIDDLEWARE - RUNS FOR AGGRATION PIPELINE
// tourSchema.pre('aggregate', function (next) { // if we want add some stage to the aggregation pipeline
//     this.pipeline().unshift({ $match: { secretTour: { $ne: true } }});
//     next();
// });


const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
// const testTour = new Tour({
//     name: 'The adventure mountain',
//     rating: 4.7,
//     price: 500
// });

// testTour.save().then(doc => {
//     console.log(doc);
    
// }).catch(err => console.log(err));
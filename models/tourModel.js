const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

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
    }
}, 
// this is needed to set virtual properties
{
    toJSON: { virtuals: true },
    toObject: { virtuals : true}
});


//virtual properties - like laravel accessor
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

/***************** MONGOOS MIDDLEWARES ***************/
// just like as laravel observer

// 1. DOCUMENT MIDDLEWARES

// 1. Pre MIDDLEWARE  - runs when create() || save(), not runs in insert many
tourSchema.pre('save', function (next) {
    console.log(this);
    
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

// 2. post
tourSchema.post(/^find/, function (docs, next) { 
    console.log(docs);
    next();
});

// 3. AGGREGATION MIDDLEWARE - RUNS FOR AGGRATION PIPELINE
tourSchema.pre('aggregate', function (next) { // if we want add some stage to the aggregation pipeline
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } }});
    next();
});


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
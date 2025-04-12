const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const viewRouter = require('./routes/viewRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xssClean = require('xss-clean');
const path = require('path');
const hpp = require('hpp'); 
const cookieParser = require('cookie-parser');
const app = express(); 


//setting up pug template as view engine - (another one is ejs)
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));



//*****  GLOBAL MIDDLEWARE STACK   *****/

//express middlware to access files from folder, this will allows to show the file in browser like html and media
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, 'public'))); // using path module - recommented to avoid issues with path

//security middleware
app.use(helmet());

app.use(cookieParser());

//rate limit middleware
const limiter = rateLimit({
  max:100,
  windowMs: 60 * 60 * 1000,
  message: "too many requests",
});

app.use('/api', limiter);

//this is a middleware provided by express to inspect the POST request body, without this cant get rquest data
app.use(express.json()); 

//middleware to inspect form data. required when dealing with forms
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

//middleware to sanitize noSql injection eg: { $gt: ""}
app.use(mongoSanitize());

//middleware to clean malicious html code in the req body ; commonly know xss attack (cross site scripting)
app.use(xssClean());

//middleware to avoid parameter pollution - eg: query string ?sort=quantity&sort=price
app.use(hpp({
  //whitlisting properties to allow duplicates
  whitelist: ['duration', 'ratingsQuantity']
}));


//middleware to logging
if(process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));



// custom middlewares //- it is important to define middleware at the beginning..
app.use((req, res, next) => {
    // console.log('middleware');
    console.log(req.cookies, 'cookie');
    
    next();
});
app.use((req, res, next) => { 
    req.date = new Date().toDateString();
    // console.log(req.date);
    next();
});

// app.get('/api/v1/tours', getTours);
// app.post('/api/v1/tours', getTour);
// app.get('/api/v1/tours/:id', createTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);
// route chaining
// app.route('/api/v1/tours').get(getTours).post(createTour);
// app.route('/api/v1/tours/:id').get(getTour).patch(updateTour).delete(deleteTour);
// //route mouting - assing the route to the router
// const userRouter = express.Router();


// view routes
app.use('/', viewRouter);


//api routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/reviews', reviewRouter);

// route handler
app.all('*', (req, res, next) => {
  // res.status(404).json({   
  //   staus: false,
  //   message: `The requested url ${req.originalUrl} does not exist`,
  // });

  // const err = new Error(`The requested url ${req.originalUrl} does not exist`);
  // err.status = 'Failed';
  // err.statusCode = 404;
  // next(err);

  next(new AppError(`The requested url ${req.originalUrl} does not exist`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;


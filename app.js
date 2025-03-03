const express = require('express');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const morgan = require('morgan');
const app = express();

//this is a middleware provided by express to inspect the POST request body, without this cant get rquest data
app.use(express.json()); 

if(process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));

//express middlware to access files from folder, this will allows to show the file in browser like html and media
app.use(express.static(`${__dirname}/public`));

// custom middlewares //- it is important to define middleware at the beginning..
app.use((req, res, next) => {
    // console.log('middleware');
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


app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

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


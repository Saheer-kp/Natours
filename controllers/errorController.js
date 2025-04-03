const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  return new AppError(`invalid ${err.path} : ${err.value}`, 400);
}

const handleDuplicateErrorDB = (err) => {
  return new AppError(`The name "${err.keyValue.name}" is already been taken`, 400);
}

const handleValidationErrorDB = (err) => {
  errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`Invalid input data. ${errors.join('. ')}`, 401);
}

const handleJWTError = () => 
   new AppError(`Unauthenticated`, 401); 

const handleJWTExpiredError = () => 
   new AppError(`Unauthenticated`, 401);


const errorDev = (err, req, res) => {
  
  if(req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({   
      staus: err.status,
      message: err.message,
      stack: err.stack,
      error: err
    });
  }

  return res.status(err.statusCode).render('error', {
    'title': 'Error',
    'errorMsg': err.message
  });
 
}

const errorProd = (err, req, res) => {
  if(req.originalUrl.startsWith('/api')) {
      if(err.operational){
      
      return res.status(err.statusCode).json({   
          staus: err.status,
          message: err.message,
        });
      }
      
      // dont leak the error details to the client
      console.error('Error', err);
      return res.status(err.statusCode).json({   
        staus: 'error',
        message: 'Something went wrong',
      });
  }
  

    if(err.operational){
      return res.status(err.statusCode).render('error', {
        'title': 'Error',
        'errorMsg': err.message,
      });
    }
    else{
      // dont leak the error details to the client
      console.error('Error', err);
      return res.status(err.statusCode).render('error', {
        'title': 'Error',
        'errorMsg': "Something went wrong"
      });
    }
}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
      errorDev(err, req, res);
    }
    if(process.env.NODE_ENV === 'production'){     
      let error = { ...err };
      error.message = err.message;
      if(err.name === 'CastError') error = handleCastErrorDB(error);
      if(err.code === 11000) error = handleDuplicateErrorDB(error);
      if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
      if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
      if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
      
      errorProd(error, req, res);
    }
  
};
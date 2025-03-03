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


const errorDev = (err, res) => {
  console.log(err.name);
  
  res.status(err.statusCode).json({   
    staus: err.status,
    message: err.message,
    stack: err.stack,
    error: err
  });
}

const errorProd = (err, res) => {
  if(err.operational){
    console.log(111);
    
    res.status(err.statusCode).json({   
      staus: err.status,
      message: err.message,
    });
  }
  else{
    console.log(222);
    
// dont leak the error details to the client
    // console.error('Error', err);
    res.status(err.statusCode).json({   
      staus: 'error',
      message: 'Something went wrong',
    });
  }
    

}

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
      errorDev(err, res);
    }
    if(process.env.NODE_ENV === 'production'){     
      let error = { ...err };
      if(err.name === 'CastError') error = handleCastErrorDB(error);
      if(err.code === 11000) error = handleDuplicateErrorDB(error);
      if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
      if(err.name === 'JsonWebTokenError') error = handleJWTError(error);
      if(err.name === 'TokenExpiredError') error = handleJWTExpiredError(error);
      
      errorProd(error, res);
    }
  
};
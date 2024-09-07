import CustomError from "../utils/CustomError.js"

function devErrors(err, res){
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
    })
}

function prodErrors(err, res) {
    if(err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message
        })
    } else {
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong. Please try again later.'
        })
    }
}

function validationErrorHandler(err) {
    const errors = Object.values(err.errors).map(val => val.message)
    const errorMessages = errors.join('. ')
    const msg = `Invalid data type: ${errorMessages}`

    return new CustomError(msg, 400)
}

function tokenExpiredErrorHandler(err) {
    return new CustomError('Your session has expired. Please log in again.', 404)
}

function handleJWTerror(err) {
    return new CustomError('Invalid JSON or JWT has provided. Please try again.', 404)
}

export default (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'error'
    
    if(process.env.NODE_ENV === 'development') {
        devErrors(err, res);
    } else if(process.env.NODE_ENV === 'production') {
        if(err.name === 'ValidationError') err = validationErrorHandler(err)
        if(err.name === 'TokenExpiredError') err = tokenExpiredErrorHandler(err)
        if(err.name === 'JsonWebTokenError') err = handleJWTerror(err)

        prodErrors(err, res)
    }
}
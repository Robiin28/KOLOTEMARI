const CustomErr = require('./../utils/CustomErr');

module.exports = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    const devErr = (res, error) => {
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message,
            stack: error.stack,
            error: error
        });
    };

    const prodErr = (res, error) => {
        if (error.isOperational) {
            res.status(error.statusCode).json({
                status: error.status,
                message: error.message
            });
        } else {
            res.status(500).json({
                status: 'error',
                message: "Something went wrong, please try again"
            });
        }
    };

    const castErrorHandler = (err) => {
        const msg = `Invalid value ${err.value} for field ${err.path}`;
        return new CustomErr(msg, 400);
    };

    const duplicateErrorHandler = (err) => {
        const name = err.keyValue ? err.keyValue.name : '';
        const msg = `This name is already taken: ${name}. Please use another name.`;
        return new CustomErr(msg, 400);
    };

    const validationErrorHandler = (err) => {
        const errors = Object.values(err.errors).map(val => val.message);
        const message = errors.join('. ');
        return new CustomErr(`Invalid input data: ${message}`, 400);
    };

    const tokenExpiredErrorHandler = () => new CustomErr("JWT has expired, please log in again", 401);

    const jsonWebTokenErrorHandler = () => new CustomErr("Invalid JWT, please log in again", 401);

    if (process.env.NODE_ENV === 'development') {
        devErr(res, error);
    } else {
        if (error.name === 'ValidationError') error = validationErrorHandler(error);
        if (error.name === 'CastError') error = castErrorHandler(error);
        if (error.code === 11000) error = duplicateErrorHandler(error);
        if (error.name === 'TokenExpiredError') error = tokenExpiredErrorHandler();
        if (error.name === 'JsonWebTokenError') error = jsonWebTokenErrorHandler();
        
        prodErr(res, error);
    }
};

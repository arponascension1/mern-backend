const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "An error occurred";
    err.statusCode = err.statusCode || 500;

    if (err.name === 'ValidationError') {
        const error = {};
        Object.keys(err.errors).forEach(key => {
            error[key] = err.errors[key].message;
        });
        res.status(403).json({
            success: false,
            validationErrors: error,
        });
    }
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
}
export default errorMiddleware;
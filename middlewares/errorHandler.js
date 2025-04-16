function errorHandler(err, req, res, next) {
    console.error(err.stack);

    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error, Something went wrong.',
    });
}

module.exports = errorHandler;
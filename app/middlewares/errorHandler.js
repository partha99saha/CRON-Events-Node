const multer = require('multer');
const logger = require('../config/logger')

/**
 * Custom error handler middleware.
 * Handles 400, 401, 500 errors, and file upload errors.
 */
const errorHandler = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        logger.error(`File upload Error: ${err.stack}`);
        return res.status(400).json({
            status: 400,
            message: 'File upload error',
            errors: err.message
        });
    }

    if (err.name === 'ValidationError') {
        // Handle validation errors
        return res.status(400).json({
            status: 400,
            message: 'Invalid request data',
            errors: err.errors
        });
    }

    if (err.status === 401) {
        // Handle unauthorized errors
        return res.status(401).json({
            status: 401,
            message: 'Unauthorized access'
        });
    }

    if (err.status === 400) {
        // Handle bad request errors
        return res.status(400).json({
            status: 400,
            message: 'Bad request',
            errors: err.errors || err.message
        });
    }

    // Handle other errors
    logger.error(`Internal Server Error: ${err.stack}`);
    console.error('Internal server error:', err);
    res.status(500).json({
        status: 500,
        message: 'Internal server error'
    });
};

module.exports = errorHandler;

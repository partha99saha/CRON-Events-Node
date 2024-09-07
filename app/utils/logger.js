// config/logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

// Define custom format for logging
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the logger
const logger = createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        customFormat
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/app.log' })
    ]
});

module.exports = logger;

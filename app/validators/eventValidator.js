const { body } = require('express-validator');

// Validation rules for adding and editing an event
exports.eventValidationRules = () => {
    return [
        body('title').notEmpty().withMessage('Title is required'),
        body('eventImage').optional().isString().withMessage('Event image URL should be a string'),
        body('description').optional().isString().withMessage('Description should be a string'),
        body('email').optional().isEmail().withMessage('Invalid email format'),
        body('phone').optional().isString().withMessage('Phone should be a string'),
        body('address').optional().isString().withMessage('Address should be a string'),
        body('city').optional().isString().withMessage('City should be a string'),
        body('organizerDetails').optional().isString().withMessage('Organizer details should be a string'),
        body('paidStatus').optional().isBoolean().withMessage('Paid status should be a boolean'),
        body('displayStatus').optional().isBoolean().withMessage('Display status should be a boolean'),
    ];
};

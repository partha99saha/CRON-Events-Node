const { body, validationResult } = require('express-validator');

/**
 * Validation rules for user registration
 */
exports.validateRegistration = () => [
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
];

/**
 * Validation rules for user login
 */
exports.validateLogin = () => [
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long')
];

/**
 * Validation rules for admin login with OTP
 */
exports.validateAdminLogin = () => [
    body('email')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
    body('otp')
        .isLength({ min: 6, max: 6 }).withMessage('OTP must be exactly 6 characters long')
];

/**
 * Validation rules for forgot password
 */
exports.validateForgotPassword = () => [
    body('email')
        .isEmail().withMessage('Invalid email format')
];

/**
 * Validation rules for reset password
 */
exports.validateResetPassword = () => [
    body('resetToken')
        .notEmpty().withMessage('Reset token is required'),
    body('newPassword')
        .isLength({ min: 5 }).withMessage('New password must be at least 5 characters long')
];

/**
 * Validation rules for update password
 */
exports.validateUpdatePassword = () => [
    body('oldPassword')
        .isLength({ min: 5 }).withMessage('Old password must be at least 5 characters long'),
    body('newPassword')
        .isLength({ min: 5 }).withMessage('New password must be at least 5 characters long')
];


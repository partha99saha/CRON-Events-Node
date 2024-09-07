const bcrypt = require('bcryptjs');
const User = require('../models').User;
const speakeasy = require('speakeasy');
const crypto = require('crypto');
const { createToken } = require('../middlewares/authorization');
const { validationResult } = require('express-validator');
const { sendEmail } = require('../services/mailService');
const logger = require('../config/logger')

/**
 * Register User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, isAdmin } = req.body;
    try {
        if (isAdmin) {
            const existingAdmin = await User.findOne({ where: { isAdmin: true } });
            if (existingAdmin) {
                return res.status(400).json({ message: 'Admin already exists' });
            }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });
        const token = createToken(user);
        res.json({ token });
    } catch (error) {
        logger.error('Error registering user:', error);
        next(error);
    }
};

/**
 *  Login User
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.login = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = createToken(user);
        res.json({ token });
    } catch (error) {
        logger.error('Error logging in user:', error);
        next(error);
    }
};

/**
 * Admin Login with OTP
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.adminLogin = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, otp } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user || !await bcrypt.compare(password, user.password)) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        // Check OTP
        if (!otp || !speakeasy.totp.verify({ secret: user.otpSecret, encoding: 'base32', token: otp })) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        const token = createToken(user);
        res.json({ token });
    } catch (error) {
        logger.error('Error logging in admin:', error);
        next(error);
    }
};

/**
 * User Forgot Password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.forgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        await User.update({ resetToken }, { where: { email } });
        await sendEmail(email, 'Password Reset', `Use this token to reset your password: ${resetToken}`);
        res.status(200).send('Password reset token sent');
    } catch (error) {
        logger.error('Error sending password reset token:', error);
        next(error);
    }
};

/**
 * User Reset Password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.resetPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { resetToken, newPassword } = req.body;
    try {
        const user = await User.findOne({ where: { resetToken } });
        if (!user) {
            return res.status(404).json({ message: 'Invalid reset token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword, resetToken: null }, { where: { resetToken } });

        res.status(200).send('Password reset successfully');
    } catch (error) {
        logger.error('Error resetting password:', error);
        next(error);
    }
};

/**
 * User Update Password
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.updatePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // Assumes you have middleware to set req.user

    try {
        const user = await User.findByPk(userId);
        if (!user || !await bcrypt.compare(oldPassword, user.password)) {
            return res.status(400).json({ message: 'Invalid current password' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ password: hashedPassword }, { where: { id: userId } });

        res.status(200).send('Password updated successfully');
    } catch (error) {
        logger.error('Error updating password:', error);
        next(error);
    }
};


// services/mailService.js
const nodemailer = require('nodemailer');
const config = require('../../config/envConfig')

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: config.email,
        pass: config.password
    }
});

/**
 * Send an email
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Email body
 * @returns {Promise} - Promise indicating the email sending status
 */
exports.sendEmail = (to, subject, text) => {
    return transporter.sendMail({
        from: config.email,
        to,
        subject,
        text
    });
};

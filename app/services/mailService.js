// services/mailService.js
const nodemailer = require('nodemailer');

// Configure nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: 'partha@gmail.com',
        pass: 'email@12345'
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
        from: 'partha@gmail.com',
        to,
        subject,
        text
    });
};

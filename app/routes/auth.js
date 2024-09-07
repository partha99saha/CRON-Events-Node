const express = require('express');
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/authorization');
const {
  validateRegistration,
  validateLogin,
  validateAdminLogin,
  validateForgotPassword,
  validateResetPassword,
  validateUpdatePassword
} = require('../validators/userValidation');
const router = express.Router();

/**
 * Register user route
 */
router.post('/register', validateRegistration(), authController.register);

/**
 * Login user route
 */
router.post('/login', validateLogin(), authController.login);

/**
 * Admin login with OTP
 */
router.post('/adminLogin', validateAdminLogin(), authController.adminLogin);

/**
 * Forgot password route
 */
router.post('/forgotPassword', validateForgotPassword(), authController.forgotPassword);

/**
 * Reset password route
 */
router.post('/resetPassword', validateResetPassword(), authController.resetPassword);

/**
 * Update password route
 */
router.post('/updatePassword', verifyToken, validateUpdatePassword(), authController.updatePassword);

/**
 * Logout route
 */
router.post('/logout', verifyToken, (req, res) => {
  res.status(200).send('Logged out successfully');
});

module.exports = router;

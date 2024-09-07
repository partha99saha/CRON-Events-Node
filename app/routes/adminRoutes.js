const express = require('express');
const { verifyToken, isAdmin } = require('../middlewares/authorization');
const adminController = require('../controllers/adminController');
const router = express.Router();

// Apply token verification and admin check to all admin routes
router.use(verifyToken, isAdmin);

// List all events with pagination
router.get('/listEvents', adminController.listEvents);

// Change event status
router.patch('/events/:id/status', adminController.changeEventStatus);

// Generate reports for paid and unpaid events
router.get('/reports', adminController.generateReports);

module.exports = router;

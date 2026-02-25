const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/DashboardController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Admin dashboard
router.get('/admin', authMiddleware, adminOnly, DashboardController.getAdminDashboard);

// Student dashboard
router.get('/student', authMiddleware, DashboardController.getStudentDashboard);

module.exports = router;

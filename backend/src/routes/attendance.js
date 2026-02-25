const express = require('express');
const router = express.Router();
const AttendanceController = require('../controllers/AttendanceController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Mark attendance
router.post('/students/:studentId', authMiddleware, adminOnly, validate(schemas.markAttendance), AttendanceController.markAttendance);

// Get student attendance
router.get('/students/:studentId', authMiddleware, AttendanceController.getStudentAttendance);

// Get attendance percentage
router.get('/students/:studentId/percentage', authMiddleware, AttendanceController.getAttendancePercentage);

// Get attendance report
router.get('/students/:studentId/report', authMiddleware, AttendanceController.getAttendanceReport);

// Get daily attendance summary
router.get('/daily', authMiddleware, adminOnly, AttendanceController.getDailyAttendanceSummary);

module.exports = router;

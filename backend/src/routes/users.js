const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Protected routes
router.get('/profile', authMiddleware, UserController.getProfile);

// Admin routes
router.get('/students', authMiddleware, adminOnly, UserController.getAllStudents);
router.get('/students/at-risk', authMiddleware, adminOnly, UserController.getAtRiskStudents);
router.get('/students/stats', authMiddleware, adminOnly, UserController.getStudentStats);
router.get('/students/:id', authMiddleware, adminOnly, UserController.getStudentById);
router.post('/students', authMiddleware, adminOnly, validate(schemas.registerStudent), UserController.createStudent);
router.put('/students/:id', authMiddleware, adminOnly, validate(schemas.updateStudent), UserController.updateStudent);
router.delete('/students/:id', authMiddleware, adminOnly, UserController.deleteStudent);

module.exports = router;

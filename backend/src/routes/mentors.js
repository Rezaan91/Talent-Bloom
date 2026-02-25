const express = require('express');
const router = express.Router();
const MentorController = require('../controllers/MentorController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all mentors
router.get('/', authMiddleware, MentorController.getAllMentors);

// Create mentor (admin)
router.post('/', authMiddleware, adminOnly, MentorController.createMentor);

// Get mentor by ID
router.get('/:mentorId', authMiddleware, MentorController.getMentorById);

// Update mentor (admin)
router.put('/:mentorId', authMiddleware, adminOnly, MentorController.updateMentor);

// Delete mentor (admin)
router.delete('/:mentorId', authMiddleware, adminOnly, MentorController.deleteMentor);

// Get mentor's students
router.get('/:mentorId/students', authMiddleware, MentorController.getMentorStudents);

module.exports = router;

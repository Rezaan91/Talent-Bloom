const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// Submit project
router.post('/students/:studentId', authMiddleware, validate(schemas.submitProject), ProjectController.submitProject);

// Get student projects
router.get('/students/:studentId', authMiddleware, ProjectController.getStudentProjects);

// Get project by ID
router.get('/:projectId', authMiddleware, ProjectController.getProjectById);

// Update project (admin)
router.put('/:projectId', authMiddleware, adminOnly, validate(schemas.updateProject), ProjectController.updateProject);

// Delete project (admin)
router.delete('/:projectId', authMiddleware, adminOnly, ProjectController.deleteProject);

// Get all projects (admin)
router.get('/', authMiddleware, adminOnly, ProjectController.getAllProjects);

// Get recent submissions (admin)
router.get('/admin/recent', authMiddleware, adminOnly, ProjectController.getRecentSubmissions);

// Get project stats (admin)
router.get('/admin/stats', authMiddleware, adminOnly, ProjectController.getProjectStats);

module.exports = router;

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { validate, schemas } = require('../middleware/validation');

// Public routes
router.post('/login', validate(schemas.login), AuthController.login);
router.post('/register', validate(schemas.registerStudent), AuthController.registerStudent);
router.post('/refresh-token', AuthController.refreshToken);

module.exports = router;

const express = require('express');
const router = express.Router();
const TrackController = require('../controllers/TrackController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// Get all tracks
router.get('/', authMiddleware, TrackController.getAllTracks);

// Create track (admin)
router.post('/', authMiddleware, adminOnly, TrackController.createTrack);

// Get track by ID
router.get('/:trackId', authMiddleware, TrackController.getTrackById);

module.exports = router;

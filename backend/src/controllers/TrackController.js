const Track = require('../models/Track');

class TrackController {
  static async getAllTracks(req, res) {
    try {
      const tracks = await Track.getAll();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getTrackById(req, res) {
    try {
      const { trackId } = req.params;

      const track = await Track.getById(trackId);
      if (!track) {
        return res.status(404).json({ error: 'Track not found' });
      }

      res.json(track);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createTrack(req, res) {
    try {
      const { name } = req.body;

      const track = await Track.create(name);
      res.status(201).json({
        message: 'Track created successfully',
        track
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TrackController;

const Mentor = require('../models/Mentor');

class MentorController {
  static async createMentor(req, res) {
    try {
      const { name } = req.body;

      const mentor = await Mentor.create(name);
      res.status(201).json({
        message: 'Mentor created successfully',
        mentor
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllMentors(req, res) {
    try {
      const mentors = await Mentor.getAll();
      res.json(mentors);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMentorById(req, res) {
    try {
      const { mentorId } = req.params;

      const mentor = await Mentor.getById(mentorId);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }

      res.json(mentor);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateMentor(req, res) {
    try {
      const { mentorId } = req.params;
      const { name } = req.body;

      const mentor = await Mentor.getById(mentorId);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }

      const updated = await Mentor.update(mentorId, name);
      res.json({
        message: 'Mentor updated successfully',
        mentor: updated
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteMentor(req, res) {
    try {
      const { mentorId } = req.params;

      const mentor = await Mentor.getById(mentorId);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }

      await Mentor.delete(mentorId);
      res.json({ message: 'Mentor deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getMentorStudents(req, res) {
    try {
      const { mentorId } = req.params;

      const mentor = await Mentor.getById(mentorId);
      if (!mentor) {
        return res.status(404).json({ error: 'Mentor not found' });
      }

      const students = await Mentor.getMentorStudents(mentorId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = MentorController;

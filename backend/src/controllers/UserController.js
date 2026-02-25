const User = require('../models/User');

class UserController {
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllStudents(req, res) {
    try {
      const students = await User.getAllStudents();
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentById(req, res) {
    try {
      const { id } = req.params;
      const student = await User.findById(id);
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      res.json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createStudent(req, res) {
    try {
      const { name, email, password, track, programme } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists' });
      }

      const student = await User.create({
        name,
        email,
        password,
        role: 'student',
        track,
        programme
      });

      res.status(201).json({
        message: 'Student created successfully',
        student
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateStudent(req, res) {
    try {
      const { id } = req.params;
      
      const student = await User.findById(id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const updated = await User.update(id, req.body);
      res.json({
        message: 'Student updated successfully',
        student: updated
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteStudent(req, res) {
    try {
      const { id } = req.params;
      
      const student = await User.findById(id);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      await User.delete(id);
      res.json({ message: 'Student deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAtRiskStudents(req, res) {
    try {
      const atRiskStudents = await User.getAtRiskStudents();
      res.json(atRiskStudents);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentStats(req, res) {
    try {
      const stats = await User.getStudentStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;

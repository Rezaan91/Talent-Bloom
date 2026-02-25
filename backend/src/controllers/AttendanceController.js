const Attendance = require('../models/Attendance');
const User = require('../models/User');

class AttendanceController {
  static async markAttendance(req, res) {
    try {
      const { studentId } = req.params;
      const { date, status } = req.body;

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const attendance = await Attendance.markAttendance(studentId, date, status);
      res.json({
        message: 'Attendance marked successfully',
        attendance
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentAttendance(req, res) {
    try {
      const { studentId } = req.params;
      const { limit = 100, offset = 0 } = req.query;

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const attendance = await Attendance.getStudentAttendance(
        studentId,
        parseInt(limit),
        parseInt(offset)
      );
      
      res.json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAttendancePercentage(req, res) {
    try {
      const { studentId } = req.params;

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const stats = await Attendance.getStudentAttendancePercentage(studentId);
      res.json(stats || { total_days: 0, present_days: 0, percentage: 0 });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getDailyAttendanceSummary(req, res) {
    try {
      const { date } = req.query;

      if (!date) {
        return res.status(400).json({ error: 'Date parameter required' });
      }

      const summary = await Attendance.getDailyAttendanceSummary(date);
      res.json(summary);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAttendanceReport(req, res) {
    try {
      const { studentId } = req.params;

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const report = await Attendance.getAttendanceReport(studentId);
      res.json(report || {
        total_days: 0,
        present_days: 0,
        absent_days: 0,
        percentage: 0
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AttendanceController;

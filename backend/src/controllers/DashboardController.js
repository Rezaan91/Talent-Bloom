const User = require('../models/User');
const Project = require('../models/Project');

class DashboardController {
  static async getAdminDashboard(req, res) {
    try {
      const studentStats = await User.getStudentStats();
      const projectStats = await Project.getProjectStats();
      const recentProjects = await Project.getRecentSubmissions(5);
      const atRiskStudents = await User.getAtRiskStudents();

      res.json({
        studentStats,
        projectStats,
        recentProjects,
        atRiskStudents
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentDashboard(req, res) {
    try {
      const userId = req.user.id;
      
      // This would be expanded with actual student-specific data
      const user = await User.findById(userId);
      
      res.json({
        user,
        message: 'Student dashboard data retrieved'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = DashboardController;

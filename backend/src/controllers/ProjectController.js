const Project = require('../models/Project');
const User = require('../models/User');

class ProjectController {
  static async submitProject(req, res) {
    try {
      const { studentId } = req.params;
      const { title, description, githubLink } = req.body;

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const project = await Project.create(studentId, {
        title,
        description,
        githubLink
      });

      res.status(201).json({
        message: 'Project submitted successfully',
        project
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getStudentProjects(req, res) {
    try {
      const { studentId } = req.params;
      const { limit = 50, offset = 0 } = req.query;

      const student = await User.findById(studentId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      const projects = await Project.getStudentProjects(
        studentId,
        parseInt(limit),
        parseInt(offset)
      );

      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAllProjects(req, res) {
    try {
      const { limit = 100, offset = 0 } = req.query;

      const projects = await Project.getAllProjects(
        parseInt(limit),
        parseInt(offset)
      );

      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProjectById(req, res) {
    try {
      const { projectId } = req.params;

      const project = await Project.getById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async updateProject(req, res) {
    try {
      const { projectId } = req.params;

      const project = await Project.getById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const updated = await Project.updateProject(projectId, req.body);
      res.json({
        message: 'Project updated successfully',
        project: updated
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteProject(req, res) {
    try {
      const { projectId } = req.params;

      const project = await Project.getById(projectId);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      await Project.delete(projectId);
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getRecentSubmissions(req, res) {
    try {
      const { limit = 10 } = req.query;

      const projects = await Project.getRecentSubmissions(parseInt(limit));
      res.json(projects);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getProjectStats(req, res) {
    try {
      const stats = await Project.getProjectStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = ProjectController;

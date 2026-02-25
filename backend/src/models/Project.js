const pool = require('../config/database');

class Project {
  static async create(studentId, projectData) {
    const { title, description, githubLink } = projectData;
    const result = await pool.query(
      'INSERT INTO projects (student_id, title, description, github_link, status) VALUES ($1, $2, $3, $4, $5) RETURNING id, student_id, title, description, github_link, status, feedback, submission_date, created_at',
      [studentId, title, description, githubLink, 'Submitted']
    );
    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT id, student_id, title, description, github_link, status, feedback, submission_date, created_at FROM projects WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getStudentProjects(studentId, limit = 50, offset = 0) {
    const result = await pool.query(
      'SELECT id, student_id, title, description, github_link, status, feedback, submission_date, created_at FROM projects WHERE student_id = $1 ORDER BY submission_date DESC LIMIT $2 OFFSET $3',
      [studentId, limit, offset]
    );
    return result.rows;
  }

  static async getAllProjects(limit = 100, offset = 0) {
    const result = await pool.query(
      `SELECT p.id, p.student_id, p.title, p.description, p.github_link, p.status, p.feedback, p.submission_date, u.name as student_name
       FROM projects p
       JOIN users u ON p.student_id = u.id
       ORDER BY p.submission_date DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  }

  static async updateProject(id, updates) {
    const allowedFields = ['title', 'description', 'github_link', 'status', 'feedback'];
    const updateClauses = [];
    const values = [];
    let paramCount = 1;

    Object.entries(updates).forEach(([key, value]) => {
      const dbKey = key === 'githubLink' ? 'github_link' : key;
      if (allowedFields.includes(dbKey) && value !== undefined) {
        updateClauses.push(`${dbKey} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updateClauses.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE projects SET ${updateClauses.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, student_id, title, description, github_link, status, feedback, submission_date, created_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async getRecentSubmissions(limit = 10) {
    const result = await pool.query(
      `SELECT p.id, p.student_id, p.title, p.status, p.submission_date, u.name as student_name
       FROM projects p
       JOIN users u ON p.student_id = u.id
       ORDER BY p.submission_date DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  static async getProjectStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_projects,
        SUM(CASE WHEN status = 'Submitted' THEN 1 ELSE 0 END) as submitted,
        SUM(CASE WHEN status = 'Under Review' THEN 1 ELSE 0 END) as under_review,
        SUM(CASE WHEN status = 'Approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'Needs Improvement' THEN 1 ELSE 0 END) as needs_improvement
      FROM projects
    `);
    return result.rows[0];
  }
}

module.exports = Project;

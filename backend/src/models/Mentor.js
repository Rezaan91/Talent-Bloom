const pool = require('../config/database');

class Mentor {
  static async create(name) {
    const result = await pool.query(
      'INSERT INTO mentors (name) VALUES ($1) RETURNING id, name, created_at',
      [name]
    );
    return result.rows[0];
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT id, name, created_at FROM mentors WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await pool.query(
      'SELECT id, name, created_at FROM mentors ORDER BY name'
    );
    return result.rows;
  }

  static async update(id, name) {
    const result = await pool.query(
      'UPDATE mentors SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING id, name, created_at',
      [name, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM mentors WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async getMentorStudents(mentorId) {
    const result = await pool.query(
      'SELECT id, name, email, status, track FROM users WHERE mentor_id = $1 ORDER BY name',
      [mentorId]
    );
    return result.rows;
  }
}

module.exports = Mentor;

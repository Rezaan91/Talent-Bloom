const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class User {
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, status, track, programme, mentor_id, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  static async create(userData) {
    const { name, email, password, role, track, programme } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password, role, track, programme, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, name, email, role, status, track, programme, created_at',
      [name, email, hashedPassword, role, track, programme, 'Active']
    );
    return result.rows[0];
  }

  static async update(id, userData) {
    const allowedFields = ['name', 'track', 'programme', 'status', 'mentor_id'];
    const updates = [];
    const values = [];
    let paramCount = 1;

    Object.entries(userData).forEach(([key, value]) => {
      if (allowedFields.includes(key) && value !== undefined) {
        updates.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (updates.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${paramCount} RETURNING id, name, email, role, status, track, programme, mentor_id, created_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0];
  }

  static async getAllStudents() {
    const result = await pool.query(
      'SELECT id, name, email, role, status, track, programme, mentor_id, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['student']
    );
    return result.rows;
  }

  static async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static async getAtRiskStudents() {
    const result = await pool.query(
      'SELECT id, name, email, status, track FROM users WHERE status = $1 ORDER BY created_at DESC',
      ['At Risk']
    );
    return result.rows;
  }

  static async getStudentStats() {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_students,
        SUM(CASE WHEN status = 'Active' THEN 1 ELSE 0 END) as active_students,
        SUM(CASE WHEN status = 'At Risk' THEN 1 ELSE 0 END) as at_risk_students,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) as completed_students
      FROM users WHERE role = 'student'
    `);
    return result.rows[0];
  }
}

module.exports = User;

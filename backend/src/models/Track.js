const pool = require('../config/database');

class Track {
  static async getAll() {
    const result = await pool.query(
      'SELECT id, name FROM tracks ORDER BY name'
    );
    return result.rows;
  }

  static async getById(id) {
    const result = await pool.query(
      'SELECT id, name FROM tracks WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create(name) {
    const result = await pool.query(
      'INSERT INTO tracks (name) VALUES ($1) RETURNING id, name',
      [name]
    );
    return result.rows[0];
  }
}

module.exports = Track;

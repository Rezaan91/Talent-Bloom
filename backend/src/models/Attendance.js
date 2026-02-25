const pool = require('../config/database');

class Attendance {
  static async markAttendance(studentId, date, status) {
    // Check if attendance already marked for this student on this date
    const existing = await pool.query(
      'SELECT id FROM attendance WHERE student_id = $1 AND date = $2',
      [studentId, date]
    );

    if (existing.rows.length > 0) {
      // Update existing record
      const result = await pool.query(
        'UPDATE attendance SET status = $1, updated_at = NOW() WHERE student_id = $2 AND date = $3 RETURNING id, student_id, date, status',
        [status, studentId, date]
      );
      return result.rows[0];
    } else {
      // Create new record
      const result = await pool.query(
        'INSERT INTO attendance (student_id, date, status) VALUES ($1, $2, $3) RETURNING id, student_id, date, status',
        [studentId, date, status]
      );
      return result.rows[0];
    }
  }

  static async getStudentAttendance(studentId, limit = 100, offset = 0) {
    const result = await pool.query(
      'SELECT id, student_id, date, status FROM attendance WHERE student_id = $1 ORDER BY date DESC LIMIT $2 OFFSET $3',
      [studentId, limit, offset]
    );
    return result.rows;
  }

  static async getStudentAttendancePercentage(studentId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
        ROUND(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as percentage
      FROM attendance
      WHERE student_id = $1`,
      [studentId]
    );
    return result.rows[0];
  }

  static async getDailyAttendanceSummary(date) {
    const result = await pool.query(
      `SELECT 
        u.id,
        u.name,
        a.status,
        a.date
      FROM users u
      LEFT JOIN attendance a ON u.id = a.student_id AND a.date = $1
      WHERE u.role = 'student'
      ORDER BY u.name`,
      [date]
    );
    return result.rows;
  }

  static async getAttendanceReport(studentId) {
    const result = await pool.query(
      `SELECT 
        COUNT(*) as total_days,
        SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present_days,
        SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent_days,
        ROUND(SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END)::numeric / COUNT(*) * 100, 2) as percentage,
        MIN(date) as first_date,
        MAX(date) as last_date
      FROM attendance
      WHERE student_id = $1`,
      [studentId]
    );
    return result.rows[0];
  }
}

module.exports = Attendance;

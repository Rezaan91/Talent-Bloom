const pool = require('../config/database');
const bcrypt = require('bcrypt');

const seedDatabase = async () => {
  try {
    console.log('🌱 Seeding database with initial data...');

    // Check if data already exists
    const userCount = await pool.query('SELECT COUNT(*) FROM users');
    if (userCount.rows[0].count > 0) {
      console.log('✓ Database already seeded');
      return;
    }

    // Create tracks
    const tracks = [
      'Software Development',
      'Data Science',
      'UX Design',
      'Cloud Computing',
      'Cybersecurity'
    ];

    for (const track of tracks) {
      await pool.query(
        'INSERT INTO tracks (name) VALUES ($1) ON CONFLICT DO NOTHING',
        [track]
      );
    }

    // Create mentors
    const mentorNames = ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams'];
    const mentorResults = [];

    for (const name of mentorNames) {
      const result = await pool.query(
        'INSERT INTO mentors (name) VALUES ($1) RETURNING id',
        [name]
      );
      mentorResults.push(result.rows[0].id);
    }

    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10);
    await pool.query(
      'INSERT INTO users (name, email, password, role, status, track, programme) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      ['Administrator', 'admin@internship.com', adminPassword, 'admin', 'Active', 'Administration', 'Admin']
    );

    // Create sample students
    const students = [
      { name: 'Alice Johnson', email: 'alice@student.com', password: 'password123', track: 'Software Development', programme: 'Full-Stack' },
      { name: 'Bob Smith', email: 'bob@student.com', password: 'password123', track: 'Data Science', programme: 'ML Engineering' },
      { name: 'Carol White', email: 'carol@student.com', password: 'password123', track: 'UX Design', programme: 'UI/UX' },
      { name: 'David Brown', email: 'david@student.com', password: 'password123', track: 'Cloud Computing', programme: 'DevOps' },
      { name: 'Eva Davis', email: 'eva@student.com', password: 'password123', track: 'Cybersecurity', programme: 'Security' }
    ];

    for (const student of students) {
      const hashedPassword = await bcrypt.hash(student.password, 10);
      const mentorId = mentorResults[Math.floor(Math.random() * mentorResults.length)];
      
      await pool.query(
        'INSERT INTO users (name, email, password, role, status, track, programme, mentor_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [student.name, student.email, hashedPassword, 'student', 'Active', student.track, student.programme, mentorId]
      );
    }

    console.log('✓ Database seeded successfully');
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    throw error;
  }
};

module.exports = { seedDatabase };

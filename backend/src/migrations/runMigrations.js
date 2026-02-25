const { createTables } = require('./createTables');
const { seedDatabase } = require('./seedData');
const pool = require('../config/database');

const runMigrations = async () => {
  try {
    console.log('📦 Starting database migrations...');
    
    // Test connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connection successful');
    
    // Create tables
    await createTables();
    
    // Seed data
    await seedDatabase();
    
    console.log('✅ All migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
};

runMigrations();

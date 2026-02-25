require('dotenv').config();
require('express-async-errors');
const express = require('express');
const cors = require('cors');
const pool = require('./config/database');

// Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const attendanceRoutes = require('./routes/attendance');
const projectRoutes = require('./routes/projects');
const mentorRoutes = require('./routes/mentors');
const trackRoutes = require('./routes/tracks');
const dashboardRoutes = require('./routes/dashboard');

// Middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
const apiVersion = process.env.API_VERSION || 'v1';
const basePath = `/api/${apiVersion}`;

app.use(`${basePath}/auth`, authRoutes);
app.use(`${basePath}/users`, userRoutes);
app.use(`${basePath}/attendance`, attendanceRoutes);
app.use(`${basePath}/projects`, projectRoutes);
app.use(`${basePath}/mentors`, mentorRoutes);
app.use(`${basePath}/tracks`, trackRoutes);
app.use(`${basePath}/dashboard`, dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Internship Management System API is running' });
});

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    name: 'Internship Management System API',
    version: '1.0.0',
    baseUrl: `http://localhost:${PORT}${basePath}`,
    endpoints: {
      auth: {
        login: 'POST /auth/login',
        register: 'POST /auth/register',
        refreshToken: 'POST /auth/refresh-token'
      },
      users: {
        getProfile: 'GET /users/profile',
        getAllStudents: 'GET /users/students',
        getStudentById: 'GET /users/students/:id',
        createStudent: 'POST /users/students',
        updateStudent: 'PUT /users/students/:id',
        deleteStudent: 'DELETE /users/students/:id',
        getAtRiskStudents: 'GET /users/students/at-risk',
        getStudentStats: 'GET /users/students/stats'
      },
      attendance: {
        markAttendance: 'POST /attendance/students/:studentId',
        getStudentAttendance: 'GET /attendance/students/:studentId',
        getAttendancePercentage: 'GET /attendance/students/:studentId/percentage',
        getAttendanceReport: 'GET /attendance/students/:studentId/report',
        getDailyAttendanceSummary: 'GET /attendance/daily?date=YYYY-MM-DD'
      },
      projects: {
        submitProject: 'POST /projects/students/:studentId',
        getStudentProjects: 'GET /projects/students/:studentId',
        getProjectById: 'GET /projects/:projectId',
        updateProject: 'PUT /projects/:projectId',
        deleteProject: 'DELETE /projects/:projectId',
        getAllProjects: 'GET /projects',
        getRecentSubmissions: 'GET /projects/admin/recent',
        getProjectStats: 'GET /projects/admin/stats'
      },
      mentors: {
        getAllMentors: 'GET /mentors',
        createMentor: 'POST /mentors',
        getMentorById: 'GET /mentors/:mentorId',
        updateMentor: 'PUT /mentors/:mentorId',
        deleteMentor: 'DELETE /mentors/:mentorId',
        getMentorStudents: 'GET /mentors/:mentorId/students'
      },
      tracks: {
        getAllTracks: 'GET /tracks',
        createTrack: 'POST /tracks',
        getTrackById: 'GET /tracks/:trackId'
      },
      dashboard: {
        adminDashboard: 'GET /dashboard/admin',
        studentDashboard: 'GET /dashboard/student'
      }
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const result = await pool.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0]);

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════╗
║  Internship Management System API      ║
║  Server running on: http://localhost:${PORT} ║
║  API Version: ${apiVersion}                     ║
║  Environment: ${process.env.NODE_ENV || 'development'}          ║
╚════════════════════════════════════════╝
      `);
      console.log(`📚 API Documentation: http://localhost:${PORT}/api`);
      console.log(`💚 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;

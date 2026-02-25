# Internship Management System - Backend API

A RESTful API backend for the Internship Management System built with Node.js, Express, and PostgreSQL.

## Features

✅ **User Management**
- Role-based access control (Admin & Student)
- JWT authentication with refresh tokens
- Password hashing with bcrypt
- User profile management

✅ **Student Management**
- Register and manage students
- Assign mentors
- Track student status (Active, At Risk, Completed)
- View student statistics

✅ **Attendance Tracking**
- Mark attendance for students
- View attendance history
- Calculate attendance percentages
- Generate attendance reports
- Daily attendance summaries

✅ **Project Management**
- Submit projects with GitHub links
- Review and approve projects
- Provide feedback
- Track project status
- View project statistics

✅ **Mentor System**
- Create and manage mentors
- Assign mentors to students
- View assigned students

✅ **Tracks & Programs**
- Software Development
- Data Science
- UX Design
- Cloud Computing
- Cybersecurity

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Environment**: dotenv

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **PostgreSQL** (v12.0 or higher)
- **Git**

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/mpotsengheisi/Internship-Dashboard.git
cd Internship-Dashboard/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=internship_management_db
DB_USER=postgres
DB_PASSWORD=your_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=24h
```

### 4. Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE internship_management_db;

# Exit psql
\q
```

### 5. Run Migrations

```bash
npm run migrate
```

This will:
- Create all necessary tables
- Create indexes for better performance
- Seed the database with initial data

### 6. Start the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Default Admin Credentials

For testing, the database is seeded with:
- **Email**: admin@internship.com
- **Password**: admin123

### Endpoints

#### Authentication

```
POST   /auth/login              - Login user
POST   /auth/register           - Register new student
POST   /auth/refresh-token      - Refresh JWT token
```

#### Users (Students)

```
GET    /users/profile           - Get logged-in user profile
GET    /users/students          - Get all students (Admin)
GET    /users/students/:id      - Get student by ID (Admin)
POST   /users/students          - Create new student (Admin)
PUT    /users/students/:id      - Update student (Admin)
DELETE /users/students/:id      - Delete student (Admin)
GET    /users/students/at-risk  - Get at-risk students (Admin)
GET    /users/students/stats    - Get student statistics (Admin)
```

#### Attendance

```
POST   /attendance/students/:studentId                    - Mark attendance (Admin)
GET    /attendance/students/:studentId                    - Get student attendance
GET    /attendance/students/:studentId/percentage        - Get attendance percentage
GET    /attendance/students/:studentId/report            - Get attendance report
GET    /attendance/daily?date=YYYY-MM-DD                 - Get daily summary (Admin)
```

#### Projects

```
POST   /projects/students/:studentId      - Submit project
GET    /projects/students/:studentId      - Get student's projects
GET    /projects/:projectId               - Get project by ID
PUT    /projects/:projectId               - Update project (Admin)
DELETE /projects/:projectId               - Delete project (Admin)
GET    /projects                          - Get all projects (Admin)
GET    /projects/admin/recent             - Get recent submissions (Admin)
GET    /projects/admin/stats              - Get project statistics (Admin)
```

#### Mentors

```
GET    /mentors                           - Get all mentors
POST   /mentors                           - Create mentor (Admin)
GET    /mentors/:mentorId                 - Get mentor by ID
PUT    /mentors/:mentorId                 - Update mentor (Admin)
DELETE /mentors/:mentorId                 - Delete mentor (Admin)
GET    /mentors/:mentorId/students        - Get mentor's students
```

#### Tracks

```
GET    /tracks                            - Get all tracks
POST   /tracks                            - Create track (Admin)
GET    /tracks/:trackId                   - Get track by ID
```

#### Dashboard

```
GET    /dashboard/admin                   - Get admin dashboard (Admin)
GET    /dashboard/student                 - Get student dashboard
```

## Example API Requests

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@internship.com",
    "password": "admin123"
  }'
```

### Get All Students
```bash
curl -X GET http://localhost:5000/api/v1/users/students \
  -H "Authorization: Bearer <your_token>"
```

### Create Student
```bash
curl -X POST http://localhost:5000/api/v1/users/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "name": "John Doe",
    "email": "john@student.com",
    "password": "Secure123!",
    "track": "Software Development",
    "programme": "Full-Stack"
  }'
```

### Mark Attendance
```bash
curl -X POST http://localhost:5000/api/v1/attendance/students/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "date": "2026-02-25",
    "status": "Present"
  }'
```

### Submit Project
```bash
curl -X POST http://localhost:5000/api/v1/projects/students/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_token>" \
  -d '{
    "title": "E-commerce Platform",
    "description": "A full-stack e-commerce application",
    "githubLink": "https://github.com/user/ecommerce"
  }'
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js           # Database configuration
│   ├── controllers/              # Business logic
│   │   ├── AuthController.js
│   │   ├── UserController.js
│   │   ├── AttendanceController.js
│   │   ├── ProjectController.js
│   │   ├── MentorController.js
│   │   ├── TrackController.js
│   │   └── DashboardController.js
│   ├── middleware/               # Express middleware
│   │   ├── auth.js              # JWT authentication
│   │   ├── validation.js        # Request validation
│   │   └── errorHandler.js      # Global error handling
│   ├── models/                  # Database models
│   │   ├── User.js
│   │   ├── Attendance.js
│   │   ├── Project.js
│   │   ├── Mentor.js
│   │   └── Track.js
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── attendance.js
│   │   ├── projects.js
│   │   ├── mentors.js
│   │   ├── tracks.js
│   │   └── dashboard.js
│   ├── migrations/              # Database migrations
│   │   ├── createTables.js
│   │   ├── seedData.js
│   │   └── runMigrations.js
│   └── index.js                 # Express app entry point
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## Database Schema

### Users Table
- `id` - Primary Key
- `name` - User's name
- `email` - Unique email address
- `password` - Hashed password
- `role` - admin or student
- `status` - Active, At Risk, Completed
- `track` - Internship track
- `programme` - Programme name
- `mentor_id` - Foreign key to mentors
- `created_at`, `updated_at` - Timestamps

### Attendance Table
- `id` - Primary Key
- `student_id` - Foreign key to users
- `date` - Attendance date
- `status` - Present or Absent
- `created_at`, `updated_at` - Timestamps

### Projects Table
- `id` - Primary Key
- `student_id` - Foreign key to users
- `title` - Project title
- `description` - Project description
- `github_link` - GitHub repository link
- `status` - Submitted, Under Review, Approved, Needs Improvement
- `feedback` - Admin feedback
- `submission_date` - When submitted
- `created_at`, `updated_at` - Timestamps

### Mentors Table
- `id` - Primary Key
- `name` - Mentor name
- `created_at`, `updated_at` - Timestamps

### Tracks Table
- `id` - Primary Key
- `name` - Track name
- `created_at`, `updated_at` - Timestamps

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": []
}
```

Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., email already exists)
- `500` - Server Error

## Security Features

✅ **Password Security**
- Passwords are hashed using bcrypt
- Never stored in plain text

✅ **JWT Authentication**
- Stateless authentication
- Refresh token support
- Configurable expiration

✅ **Authorization**
- Role-based access control
- Admin-only endpoints
- User ownership validation

✅ **Input Validation**
- Joi schema validation
- Email format validation
- Required field validation

✅ **CORS**
- Configurable CORS origins
- Prevents unauthorized cross-origin requests

## Development

### Running in Development Mode

```bash
npm run dev
```

This uses `nodemon` to automatically restart the server when files change.

### Database Commands

```bash
# Run migrations and seed data
npm run migrate

# Seed database with sample data (if migrations already ran)
node src/migrations/seedData.js
```

## Future Enhancements

- [ ] Email notifications
- [ ] QR code attendance check-in
- [ ] File uploads for projects
- [ ] GitHub API integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app integration
- [ ] Push notifications
- [ ] real-time messaging
- [ ] Audit logging
- [ ] Rate limiting
- [ ] Request caching

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Support

For issues and questions:
- GitHub Issues: [Open an issue](https://github.com/mpotsengheisi/Internship-Dashboard/issues)
- Email: support@internship-system.com

## Acknowledgments

- Built with Node.js and Express
- Database powered by PostgreSQL
- Authentication with JWT
- Special thanks to all contributors

---

**Happy Coding!** 🚀

Last Updated: February 25, 2026

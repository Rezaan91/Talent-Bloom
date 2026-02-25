# API Specification - Internship Management System

## Base URL
```
http://localhost:5000/api/v1
```

## Authentication

### Login User
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@internship.com",
  "password": "admin123"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Administrator",
    "email": "admin@internship.com",
    "role": "admin",
    "status": "Active",
    "track": "Administration",
    "programme": "Admin",
    "mentorId": null
  }
}
```

### Register Student
**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@student.com",
  "password": "SecurePassword123!",
  "track": "Software Development",
  "programme": "Full-Stack Development"
}
```

**Response (201 Created):**
```json
{
  "message": "Student registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 6,
    "name": "John Doe",
    "email": "john@student.com",
    "role": "student",
    "status": "Active",
    "track": "Software Development",
    "programme": "Full-Stack Development",
    "created_at": "2026-02-25T10:00:00Z"
  }
}
```

### Refresh Token
**Endpoint:** `POST /auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## User Management

### Get User Profile
**Endpoint:** `GET /users/profile`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Administrator",
  "email": "admin@internship.com",
  "role": "admin",
  "status": "Active",
  "track": "Administration",
  "programme": "Admin",
  "mentor_id": null,
  "created_at": "2026-02-25T09:00:00Z"
}
```

### Get All Students
**Endpoint:** `GET /users/students`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
```
limit=100&offset=0
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@student.com",
    "role": "student",
    "status": "Active",
    "track": "Software Development",
    "programme": "Full-Stack",
    "mentor_id": 1,
    "created_at": "2026-02-25T09:30:00Z"
  }
]
```

### Get Student by ID
**Endpoint:** `GET /users/students/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):** Same as above

### Create Student
**Endpoint:** `POST /users/students`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@student.com",
  "password": "SecurePassword123!",
  "track": "Data Science",
  "programme": "ML Engineering"
}
```

**Response (201 Created):**
```json
{
  "message": "Student created successfully",
  "student": {
    "id": 7,
    "name": "Jane Smith",
    "email": "jane@student.com",
    "role": "student",
    "status": "Active",
    "track": "Data Science",
    "programme": "ML Engineering",
    "created_at": "2026-02-25T10:00:00Z"
  }
}
```

### Update Student
**Endpoint:** `PUT /users/students/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "At Risk",
  "mentorId": 2,
  "track": "Data Science"
}
```

**Response (200 OK):**
```json
{
  "message": "Student updated successfully",
  "student": {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@student.com",
    "role": "student",
    "status": "At Risk",
    "track": "Data Science",
    "mentor_id": 2,
    "created_at": "2026-02-25T09:30:00Z"
  }
}
```

### Delete Student
**Endpoint:** `DELETE /users/students/:id`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Student deleted successfully"
}
```

### Get At-Risk Students
**Endpoint:** `GET /users/students/at-risk`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "name": "Bob Smith",
    "email": "bob@student.com",
    "status": "At Risk",
    "track": "Data Science"
  }
]
```

### Get Student Statistics
**Endpoint:** `GET /users/students/stats`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "total_students": 5,
  "active_students": 3,
  "at_risk_students": 1,
  "completed_students": 1
}
```

---

## Attendance Management

### Mark Attendance
**Endpoint:** `POST /attendance/students/:studentId`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "date": "2026-02-25",
  "status": "Present"
}
```

**Response (200 OK):**
```json
{
  "message": "Attendance marked successfully",
  "attendance": {
    "id": 1,
    "student_id": 2,
    "date": "2026-02-25",
    "status": "Present"
  }
}
```

### Get Student Attendance
**Endpoint:** `GET /attendance/students/:studentId`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
limit=100&offset=0
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "student_id": 2,
    "date": "2026-02-25",
    "status": "Present"
  },
  {
    "id": 2,
    "student_id": 2,
    "date": "2026-02-24",
    "status": "Absent"
  }
]
```

### Get Attendance Percentage
**Endpoint:** `GET /attendance/students/:studentId/percentage`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "total_days": 10,
  "present_days": 9,
  "percentage": 90.00
}
```

### Get Attendance Report
**Endpoint:** `GET /attendance/students/:studentId/report`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "total_days": 10,
  "present_days": 9,
  "absent_days": 1,
  "percentage": 90.00,
  "first_date": "2026-02-15",
  "last_date": "2026-02-25"
}
```

### Get Daily Attendance Summary
**Endpoint:** `GET /attendance/daily?date=2026-02-25`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "Alice Johnson",
    "status": "Present",
    "date": "2026-02-25"
  },
  {
    "id": 3,
    "name": "Bob Smith",
    "status": "Absent",
    "date": "2026-02-25"
  }
]
```

---

## Project Management

### Submit Project
**Endpoint:** `POST /projects/students/:studentId`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "E-Commerce Platform",
  "description": "A full-stack e-commerce platform using MERN stack",
  "githubLink": "https://github.com/user/ecommerce-platform"
}
```

**Response (201 Created):**
```json
{
  "message": "Project submitted successfully",
  "project": {
    "id": 1,
    "student_id": 2,
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce platform using MERN stack",
    "github_link": "https://github.com/user/ecommerce-platform",
    "status": "Submitted",
    "feedback": null,
    "submission_date": "2026-02-25T10:00:00Z",
    "created_at": "2026-02-25T10:00:00Z"
  }
}
```

### Get Student's Projects
**Endpoint:** `GET /projects/students/:studentId`

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
```
limit=50&offset=0
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "student_id": 2,
    "title": "E-Commerce Platform",
    "description": "A full-stack e-commerce platform using MERN stack",
    "github_link": "https://github.com/user/ecommerce-platform",
    "status": "Approved",
    "feedback": "Great work! Well-structured code.",
    "submission_date": "2026-02-25T10:00:00Z",
    "created_at": "2026-02-25T10:00:00Z"
  }
]
```

### Get All Projects (Admin)
**Endpoint:** `GET /projects`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
```
limit=100&offset=0
```

**Response (200 OK):** Array of projects from all students

### Get Project by ID
**Endpoint:** `GET /projects/:projectId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):** Single project object

### Update Project (Admin)
**Endpoint:** `PUT /projects/:projectId`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "Approved",
  "feedback": "Excellent work! Well-organized and documented."
}
```

**Response (200 OK):**
```json
{
  "message": "Project updated successfully",
  "project": {
    "id": 1,
    "student_id": 2,
    "title": "E-Commerce Platform",
    "status": "Approved",
    "feedback": "Excellent work! Well-organized and documented.",
    "submission_date": "2026-02-25T10:00:00Z",
    "created_at": "2026-02-25T10:00:00Z"
  }
}
```

### Delete Project (Admin)
**Endpoint:** `DELETE /projects/:projectId`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Project deleted successfully"
}
```

### Get Recent Submissions (Admin)
**Endpoint:** `GET /projects/admin/recent`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Query Parameters:**
```
limit=10
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "student_id": 2,
    "title": "E-Commerce Platform",
    "status": "Submitted",
    "submission_date": "2026-02-25T10:00:00Z",
    "student_name": "Alice Johnson"
  }
]
```

### Get Project Statistics (Admin)
**Endpoint:** `GET /projects/admin/stats`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "total_projects": 5,
  "submitted": 2,
  "under_review": 1,
  "approved": 1,
  "needs_improvement": 1
}
```

---

## Mentor Management

### Get All Mentors
**Endpoint:** `GET /mentors`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "John Smith",
    "created_at": "2026-02-25T09:00:00Z"
  },
  {
    "id": 2,
    "name": "Jane Doe",
    "created_at": "2026-02-25T09:00:00Z"
  }
]
```

### Create Mentor (Admin)
**Endpoint:** `POST /mentors`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Sarah Williams"
}
```

**Response (201 Created):**
```json
{
  "message": "Mentor created successfully",
  "mentor": {
    "id": 5,
    "name": "Sarah Williams",
    "created_at": "2026-02-25T10:00:00Z"
  }
}
```

### Get Mentor by ID
**Endpoint:** `GET /mentors/:mentorId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Smith",
  "created_at": "2026-02-25T09:00:00Z"
}
```

### Update Mentor (Admin)
**Endpoint:** `PUT /mentors/:mentorId`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Smith Jr."
}
```

**Response (200 OK):**
```json
{
  "message": "Mentor updated successfully",
  "mentor": {
    "id": 1,
    "name": "John Smith Jr.",
    "created_at": "2026-02-25T09:00:00Z"
  }
}
```

### Delete Mentor (Admin)
**Endpoint:** `DELETE /mentors/:mentorId`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "message": "Mentor deleted successfully"
}
```

### Get Mentor's Students
**Endpoint:** `GET /mentors/:mentorId/students`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@student.com",
    "status": "Active",
    "track": "Software Development"
  }
]
```

---

## Track Management

### Get All Tracks
**Endpoint:** `GET /tracks`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Software Development"
  },
  {
    "id": 2,
    "name": "Data Science"
  },
  {
    "id": 3,
    "name": "UX Design"
  },
  {
    "id": 4,
    "name": "Cloud Computing"
  },
  {
    "id": 5,
    "name": "Cybersecurity"
  }
]
```

### Get Track by ID
**Endpoint:** `GET /tracks/:trackId`

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Software Development"
}
```

### Create Track (Admin)
**Endpoint:** `POST /tracks`

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Backend Development"
}
```

**Response (201 Created):**
```json
{
  "message": "Track created successfully",
  "track": {
    "id": 6,
    "name": "Backend Development"
  }
}
```

---

## Dashboard

### Get Admin Dashboard
**Endpoint:** `GET /dashboard/admin`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Response (200 OK):**
```json
{
  "studentStats": {
    "total_students": 5,
    "active_students": 3,
    "at_risk_students": 1,
    "completed_students": 1
  },
  "projectStats": {
    "total_projects": 5,
    "submitted": 2,
    "under_review": 1,
    "approved": 1,
    "needs_improvement": 1
  },
  "recentProjects": [
    {
      "id": 1,
      "student_id": 2,
      "title": "E-Commerce Platform",
      "status": "Submitted",
      "submission_date": "2026-02-25T10:00:00Z",
      "student_name": "Alice Johnson"
    }
  ],
  "atRiskStudents": [
    {
      "id": 3,
      "name": "Bob Smith",
      "email": "bob@student.com",
      "status": "At Risk",
      "track": "Data Science"
    }
  ]
}
```

### Get Student Dashboard
**Endpoint:** `GET /dashboard/student`

**Headers:**
```
Authorization: Bearer {student_token}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 2,
    "name": "Alice Johnson",
    "email": "alice@student.com",
    "role": "student",
    "status": "Active",
    "track": "Software Development",
    "programme": "Full-Stack",
    "mentor_id": 1,
    "created_at": "2026-02-25T09:30:00Z"
  },
  "message": "Student dashboard data retrieved"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "\"email\" must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "Admin access required"
}
```

### 404 Not Found
```json
{
  "error": "Student not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Server Error |

---

## Valid Enums

### User Roles
- `admin`
- `student`

### Student Status
- `Active`
- `At Risk`
- `Completed`

### Attendance Status
- `Present`
- `Absent`

### Project Status
- `Submitted`
- `Under Review`
- `Approved`
- `Needs Improvement`

### Tracks
- `Software Development`
- `Data Science`
- `UX Design`
- `Cloud Computing`
- `Cybersecurity`

---

Last Updated: February 25, 2026

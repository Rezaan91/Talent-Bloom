# API Testing with cURL Examples

## Prerequisites
- Backend running on http://localhost:5000
- PostgreSQL database set up
- Migrations completed
- jq installed (optional, for pretty JSON output)

---

## 1. Health Check

```bash
curl http://localhost:5000/health
```

Expected Response:
```json
{
  "status": "OK",
  "message": "Internship Management System API is running"
}
```

---

## 2. Authentication Tests

### Login as Admin

```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@internship.com",
    "password": "admin123"
  }' | jq '.'
```

**Save the token for subsequent requests:**
```bash
TOKEN="your_token_here"
```

### Register New Student

```bash
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Student",
    "email": "newstudent@student.com",
    "password": "SecurePass123!",
    "track": "Software Development",
    "programme": "Full-Stack"
  }' | jq '.'
```

### Refresh Token

```bash
curl -X POST http://localhost:5000/api/v1/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "your_refresh_token"
  }' | jq '.'
```

---

## 3. User Management Tests

### Get Own Profile

```bash
curl -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get All Students (Admin)

```bash
curl -X GET http://localhost:5000/api/v1/users/students \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Specific Student

```bash
curl -X GET http://localhost:5000/api/v1/users/students/2 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Create New Student (Admin)

```bash
curl -X POST http://localhost:5000/api/v1/users/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Developer",
    "email": "john.dev@student.com",
    "password": "Secure123!",
    "track": "Software Development",
    "programme": "Backend Engineering"
  }' | jq '.'
```

### Update Student (Admin)

```bash
curl -X PUT http://localhost:5000/api/v1/users/students/7 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "At Risk",
    "mentorId": 2
  }' | jq '.'
```

### Delete Student (Admin)

```bash
curl -X DELETE http://localhost:5000/api/v1/users/students/7 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get At-Risk Students (Admin)

```bash
curl -X GET http://localhost:5000/api/v1/users/students/at-risk \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Student Statistics (Admin)

```bash
curl -X GET http://localhost:5000/api/v1/users/students/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 4. Attendance Tests

### Mark Attendance (Admin)

```bash
curl -X POST http://localhost:5000/api/v1/attendance/students/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "date": "2026-02-25",
    "status": "Present"
  }' | jq '.'
```

### Get Student Attendance History

```bash
curl -X GET "http://localhost:5000/api/v1/attendance/students/2?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Attendance Percentage

```bash
curl -X GET http://localhost:5000/api/v1/attendance/students/2/percentage \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Attendance Report

```bash
curl -X GET http://localhost:5000/api/v1/attendance/students/2/report \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Daily Attendance Summary (Admin)

```bash
curl -X GET "http://localhost:5000/api/v1/attendance/daily?date=2026-02-25" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 5. Project Tests

### Submit Project

```bash
curl -X POST http://localhost:5000/api/v1/projects/students/2 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Task Management App",
    "description": "A web-based task management application",
    "githubLink": "https://github.com/user/task-app"
  }' | jq '.'
```

### Get Student Projects

```bash
curl -X GET "http://localhost:5000/api/v1/projects/students/2?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get All Projects (Admin)

```bash
curl -X GET "http://localhost:5000/api/v1/projects?limit=20&offset=0" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Specific Project

```bash
curl -X GET http://localhost:5000/api/v1/projects/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Update Project (Admin)

```bash
curl -X PUT http://localhost:5000/api/v1/projects/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "Approved",
    "feedback": "Great implementation! Code is well-structured."
  }' | jq '.'
```

### Delete Project (Admin)

```bash
curl -X DELETE http://localhost:5000/api/v1/projects/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Recent Projects (Admin)

```bash
curl -X GET "http://localhost:5000/api/v1/projects/admin/recent?limit=5" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Project Statistics (Admin)

```bash
curl -X GET http://localhost:5000/api/v1/projects/admin/stats \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 6. Mentor Tests

### Get All Mentors

```bash
curl -X GET http://localhost:5000/api/v1/mentors \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Create Mentor (Admin)

```bash
curl -X POST http://localhost:5000/api/v1/mentors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Dr. Michael Chen"
  }' | jq '.'
```

### Get Specific Mentor

```bash
curl -X GET http://localhost:5000/api/v1/mentors/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Update Mentor (Admin)

```bash
curl -X PUT http://localhost:5000/api/v1/mentors/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Dr. Michael Chen Jr."
  }' | jq '.'
```

### Delete Mentor (Admin)

```bash
curl -X DELETE http://localhost:5000/api/v1/mentors/5 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Mentor's Students

```bash
curl -X GET http://localhost:5000/api/v1/mentors/1/students \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## 7. Track Tests

### Get All Tracks

```bash
curl -X GET http://localhost:5000/api/v1/tracks \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Specific Track

```bash
curl -X GET http://localhost:5000/api/v1/tracks/1 \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Create Track (Admin)

```bash
curl -X POST http://localhost:5000/api/v1/tracks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Mobile Development"
  }' | jq '.'
```

---

## 8. Dashboard Tests

### Get Admin Dashboard

```bash
curl -X GET http://localhost:5000/api/v1/dashboard/admin \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

### Get Student Dashboard

```bash
curl -X GET http://localhost:5000/api/v1/dashboard/student \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## Testing Tips

### Pretty Print JSON
```bash
# All commands above include | jq '.' for pretty printing
# Install jq if not available:
# Ubuntu/Debian: sudo apt-get install jq
# macOS: brew install jq
# Windows: choco install jq
```

### Save Response to File
```bash
curl -X GET http://localhost:5000/api/v1/users/students \
  -H "Authorization: Bearer $TOKEN" > students.json
```

### Include Response Headers
```bash
curl -i -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Show Request and Response
```bash
curl -v -X GET http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Time the Request
```bash
curl -w "\nTime: %{time_total}s\n" \
  -X GET http://localhost:5000/api/v1/users/students \
  -H "Authorization: Bearer $TOKEN"
```

---

## Common Testing Workflow

```bash
#!/bin/bash

# 1. Get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@internship.com","password":"admin123"}' | jq -r '.token')

echo "Token: $TOKEN"

# 2. Test several endpoints
curl -s http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer $TOKEN" | jq '.'

curl -s http://localhost:5000/api/v1/users/students \
  -H "Authorization: Bearer $TOKEN" | jq '.'

curl -s http://localhost:5000/api/v1/dashboard/admin \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

## Troubleshooting

### Connection Refused
```bash
# Check if server is running
curl http://localhost:5000/health
```

### Invalid Token
```bash
# Re-login and get a fresh token
TOKEN=$(curl -s -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@internship.com","password":"admin123"}' | jq -r '.token')
```

### 401 Unauthorized
```bash
# Ensure token is in Authorization header
# Format: Bearer {token}
```

### 403 Forbidden
```bash
# Using student token for admin endpoint
# Login as admin instead
```

---

**Happy Testing! 🧪**

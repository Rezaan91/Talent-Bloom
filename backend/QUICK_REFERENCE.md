# Quick Reference Guide

## Getting Started (First Time)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials
```

### 3. Create Database
```bash
psql -U postgres -c "CREATE DATABASE internship_management_db;"
```

### 4. Run Migrations
```bash
npm run migrate
```

### 5. Start Development Server
```bash
npm run dev
```

**Server will be at:** `http://localhost:5000`

---

## Important URLs

| Purpose | URL |
|---------|-----|
| API Base | `http://localhost:5000/api/v1` |
| Health Check | `http://localhost:5000/health` |
| API Docs | `http://localhost:5000/api` |

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@internship.com | admin123 |

---

## Key Files & Directories

```
backend/
├── src/
│   ├── index.js                 # Main app entry point
│   ├── config/database.js       # Database connection
│   ├── controllers/             # Business logic
│   ├── models/                  # Database models
│   ├── routes/                  # API routes
│   ├── middleware/              # Auth, validation, error handling
│   └── migrations/              # Database setup
├── .env.example                 # Environment variables template
├── package.json                 # Dependencies
├── README.md                    # Full documentation
├── SETUP.md                     # Setup guide
├── API_SPECIFICATION.md         # Complete API docs
└── docker-compose.yml           # Docker setup
```

---

## Common Commands

### Development
```bash
npm run dev                  # Start with hot reload
npm start                    # Start production mode
npm run migrate              # Setup database
npm run seed                 # Seed sample data
```

### Testing API
```bash
curl http://localhost:5000/health              # Health check
curl http://localhost:5000/api                 # Documentation
```

### Docker
```bash
docker-compose up -d         # Start services
docker-compose down          # Stop services
docker-compose logs -f       # View logs
```

---

## Environment Variables

### Essential
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=internship_management_db
DB_USER=postgres
DB_PASSWORD=your_password

PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key
```

### Optional
```env
CORS_ORIGIN=http://localhost:3000
JWT_EXPIRE=24h
API_VERSION=v1
```

---

## API Authentication

### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@internship.com",
    "password": "admin123"
  }'
```

### Using Token
```bash
curl http://localhost:5000/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## CRUD Operations Summary

### Create
```
POST /endpoint
Content-Type: application/json
Authorization: Bearer {token}

{}  # Request body with data
```

### Read
```
GET /endpoint or GET /endpoint/:id
Authorization: Bearer {token}
```

### Update
```
PUT /endpoint/:id
Content-Type: application/json
Authorization: Bearer {token}

{}  # Request body with updated data
```

### Delete
```
DELETE /endpoint/:id
Authorization: Bearer {token}
```

---

## Troubleshooting Checklist

- [ ] PostgreSQL running? → `psql -U postgres`
- [ ] Database created? → `psql -U postgres -l`
- [ ] Dependencies installed? → `npm install`
- [ ] .env configured? → Check DB credentials match PostgreSQL
- [ ] Migrations ran? → `npm run migrate`
- [ ] Server starting? → `npm run dev`
- [ ] Is port 5000 available? → `lsof -i :5000`
- [ ] Firewall blocking? → Check Windows Firewall settings

---

## Response Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | ✅ Success | GET, PUT, DELETE successful |
| 201 | ✅ Created | POST successful |
| 400 | ❌ Bad Request | Invalid input data |
| 401 | ❌ Unauthorized | Missing/invalid token |
| 403 | ❌ Forbidden | Insufficient permissions |
| 404 | ❌ Not Found | Resource doesn't exist |
| 409 | ❌ Conflict | Email already exists |
| 500 | ❌ Server Error | Backend error |

---

## Database Schema Quick View

### Users
- ID, Name, Email, Password, Role, Status
- Track, Programme, Mentor ID

### Attendance
- ID, Student ID, Date, Status (Present/Absent)

### Projects
- ID, Student ID, Title, Description
- GitHub Link, Status, Feedback

### Mentors
- ID, Name

### Tracks
- ID, Name

---

## Key Endpoints

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register student
- `POST /auth/refresh-token` - Refresh JWT

### Users
- `GET /users/students` - All students (admin)
- `POST /users/students` - Create student (admin)
- `PUT /users/students/:id` - Update student (admin)
- `DELETE /users/students/:id` - Delete student (admin)

### Attendance
- `POST /attendance/students/:id` - Mark attendance (admin)
- `GET /attendance/students/:id` - Get history
- `GET /attendance/students/:id/percentage` - Get %

### Projects
- `POST /projects/students/:id` - Submit project
- `GET /projects/students/:id` - Get student projects
- `PUT /projects/:id` - Update (admin)
- `GET /projects` - All projects (admin)

### Dashboard
- `GET /dashboard/admin` - Admin view
- `GET /dashboard/student` - Student view

---

## Validation Rules

### Email
- Must be valid email format
- Must be unique in database

### Password
- Minimum 6 characters
- Hashed using bcrypt before storage

### Date Format
- ISO format: `YYYY-MM-DD`

### Enum Values
**Tracks:** Software Development, Data Science, UX Design, Cloud Computing, Cybersecurity
**Status:** Active, At Risk, Completed
**Project Status:** Submitted, Under Review, Approved, Needs Improvement
**Attendance:** Present, Absent

---

## Security Notes

✅ **Password Security**
- All passwords hashed with bcrypt
- Never stored in plain text
- Minimum 6 characters enforced

✅ **JWT Authentication**
- Stateless token-based auth
- 24-hour expiration (configurable)
- Refresh token support

✅ **Authorization**
- Role-based access control
- Admin-only endpoints protected
- User ownership validation

---

## Performance Tips

1. **Use pagination** for large lists
   ```
   GET /users/students?limit=20&offset=0
   ```

2. **Minimize requests** - Combine related queries

3. **Cache tokens** in localStorage (frontend)

4. **Database indexes** - Already created automatically

5. **Connection pooling** - Configured in database.js

---

## Next Steps

1. [ ] Start backend server → `npm run dev`
2. [ ] Test health endpoint → `http://localhost:5000/health`
3. [ ] Login with admin credentials
4. [ ] Create sample data
5. [ ] Connect frontend to API
6. [ ] Test all CRUD operations
7. [ ] Deploy to production

---

## Support Resources

- 📖 Full README: [README.md](README.md)
- 🔧 Setup Guide: [SETUP.md](SETUP.md)
- 📋 API Spec: [API_SPECIFICATION.md](API_SPECIFICATION.md)
- 🔗 Frontend Integration: [FRONTEND_INTEGRATION.md](FRONTEND_INTEGRATION.md)
- 🐳 Docker: [docker-compose.yml](docker-compose.yml)

---

## Quick Problem Solver

**Cannot connect to database?**
```bash
psql -U postgres -h localhost
```
Then check credentials in .env

**Port 5000 in use?**
```bash
lsof -i :5000
kill -9 <PID>
```

**Need to reset database?**
```bash
psql -U postgres -c "DROP DATABASE internship_management_db;"
psql -U postgres -c "CREATE DATABASE internship_management_db;"
npm run migrate
```

**Token expired?**
Use `/auth/refresh-token` endpoint or re-login

**Migrations failed?**
Ensure database exists and user has permissions

---

**Happy Developing! 🚀**

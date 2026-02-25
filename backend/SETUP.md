# Backend Setup & Deployment Guide

## Quick Start (5 minutes)

### Prerequisites Check
```bash
node --version  # Should be v14.0.0 or higher
npm --version   # Should be v6.0.0 or higher
psql --version  # PostgreSQL should be installed
```

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=internship_management_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
PORT=5000
JWT_SECRET=your_secret_key_here
```

### Step 3: Create Database
```bash
psql -U postgres -c "CREATE DATABASE internship_management_db;"
```

### Step 4: Run Migrations
```bash
npm run migrate
```

### Step 5: Start Server
```bash
npm run dev
```

Visit: `http://localhost:5000/health`

---

## Database Setup Details

### PostgreSQL Installation

**Windows:**
1. Download from https://www.postgresql.org/download/windows/
2. Run installer
3. Remember the password you set
4. PostgreSQL will run on port 5432 by default

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Create Database User (Optional)

```bash
psql -U postgres

-- Create user
CREATE USER internship_user WITH PASSWORD 'secure_password';

-- Grant privileges
ALTER ROLE internship_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE internship_management_db TO internship_user;

-- Exit
\q
```

---

## Environment Variable Configuration

### Development (.env)
```env
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=internship_management_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=false
PORT=5000
API_VERSION=v1
JWT_SECRET=dev_secret_key_123456789
JWT_EXPIRE=24h
CORS_ORIGIN=http://localhost:3000
```

### Production (.env)
```env
NODE_ENV=production
DB_HOST=prod-database-host.com
DB_PORT=5432
DB_NAME=internship_management_db
DB_USER=prod_user
DB_PASSWORD=strong_production_password
DB_SSL=true
PORT=5000
API_VERSION=v1
JWT_SECRET=production_secret_key_change_this_immediately
JWT_EXPIRE=24h
CORS_ORIGIN=https://yourdomain.com
```

---

## API Testing

### Using curl

**Login:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@internship.com","password":"admin123"}'
```

**Get Students (with token):**
```bash
curl -X GET http://localhost:5000/api/v1/users/students \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Import the API collection from `postman-collection.json`
2. Set the following variables:
   - `base_url`: http://localhost:5000/api/v1
   - `token`: Your JWT token from login

3. Test endpoints from the collection

### Using VS Code REST Client

Create `.http` file:
```http
### Login
POST http://localhost:5000/api/v1/auth/login
Content-Type: application/json

{
  "email": "admin@internship.com",
  "password": "admin123"
}

### Get All Students
GET http://localhost:5000/api/v1/users/students
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Troubleshooting

### Port 5000 Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT 1"

# Check connection string in .env
# Verify credentials
# Ensure database exists
psql -U postgres -l
```

### npm Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Reinstall
npm install
```

### JWT Token Issues
- Ensure JWT_SECRET is set in .env
- Check token expiration
- Refresh token if expired

---

## Monitoring & Logs

### Start with Logging
```bash
NODE_ENV=development npm run dev
```

### Check Server Health
```bash
curl http://localhost:5000/health
```

### View API Documentation
```
http://localhost:5000/api
```

---

## Performance Optimization

### Database Indexes
Indexes are automatically created by migrations:
- `idx_users_email` - For email lookups
- `idx_users_role` - For role filtering
- `idx_attendance_student` - For student attendance
- `idx_projects_student` - For student projects

### Connection Pooling
The PostgreSQL connection pool is configured in `src/config/database.js`:
- Default: 20 connections
- Min idle: 0
- Max connections: 30

### Caching (Future)
Currently using in-memory data. Consider Redis for:
- JWT token blacklisting
- Session caching
- Query result caching

---

## Deployment

### Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create internship-management-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run npm run migrate
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t internship-api .
docker run -p 5000:5000 --env-file .env internship-api
```

---

## Security Checklist

- [ ] Change JWT_SECRET in production
- [ ] Use strong database password
- [ ] Enable HTTPS/SSL in production
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Use environment variables for sensitive data
- [ ] Implement request logging
- [ ] Set up monitoring and alerts
- [ ] Regular security audits

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Can't connect to database | Verify PostgreSQL is running, check credentials in .env |
| JWT token invalid | Ensure JWT_SECRET is correct, token may be expired |
| CORS errors | Check CORS_ORIGIN in .env matches frontend URL |
| Port already in use | Kill process using port 5000 or change PORT in .env |
| Migration errors | Ensure database exists and user has privileges |

---

## Next Steps

1. ✅ Backend API running
2. 📱 Connect frontend to backend (update API endpoints)
3. 🔒 Implement additional security features
4. 📊 Add analytics and reporting
5. 📧 Set up email notifications
6. 🚀 Deploy to production

---

## Support Resources

- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Express.js**: https://expressjs.com/
- **JWT Guide**: https://jwt.io/
- **Node.js**: https://nodejs.org/

For help, create an issue on GitHub or contact the development team.

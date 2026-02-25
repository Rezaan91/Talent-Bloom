# Frontend Integration Guide

## Connecting Your Frontend to the Backend API

This guide explains how to integrate your existing HTML/CSS/JavaScript frontend with the new backend API.

## API Configuration

### 1. Create API Configuration File

Create `js/api-config.js`:

```javascript
// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';
const API_ENDPOINTS = {
  // Auth
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    refreshToken: `${API_BASE_URL}/auth/refresh-token`,
  },
  
  // Users
  users: {
    profile: `${API_BASE_URL}/users/profile`,
    students: `${API_BASE_URL}/users/students`,
    student: (id) => `${API_BASE_URL}/users/students/${id}`,
    atRisk: `${API_BASE_URL}/users/students/at-risk`,
    stats: `${API_BASE_URL}/users/students/stats`,
  },
  
  // Attendance
  attendance: {
    mark: (studentId) => `${API_BASE_URL}/attendance/students/${studentId}`,
    get: (studentId) => `${API_BASE_URL}/attendance/students/${studentId}`,
    percentage: (studentId) => `${API_BASE_URL}/attendance/students/${studentId}/percentage`,
    report: (studentId) => `${API_BASE_URL}/attendance/students/${studentId}/report`,
    daily: `${API_BASE_URL}/attendance/daily`,
  },
  
  // Projects
  projects: {
    submit: (studentId) => `${API_BASE_URL}/projects/students/${studentId}`,
    studentProjects: (studentId) => `${API_BASE_URL}/projects/students/${studentId}`,
    all: `${API_BASE_URL}/projects`,
    byId: (id) => `${API_BASE_URL}/projects/${id}`,
    recent: `${API_BASE_URL}/projects/admin/recent`,
    stats: `${API_BASE_URL}/projects/admin/stats`,
  },
  
  // Mentors
  mentors: {
    all: `${API_BASE_URL}/mentors`,
    byId: (id) => `${API_BASE_URL}/mentors/${id}`,
    students: (id) => `${API_BASE_URL}/mentors/${id}/students`,
  },
  
  // Tracks
  tracks: {
    all: `${API_BASE_URL}/tracks`,
    byId: (id) => `${API_BASE_URL}/tracks/${id}`,
  },
  
  // Dashboard
  dashboard: {
    admin: `${API_BASE_URL}/dashboard/admin`,
    student: `${API_BASE_URL}/dashboard/student`,
  },
};

// Token Management
class TokenManager {
  static setToken(token) {
    localStorage.setItem('token', token);
  }
  
  static getToken() {
    return localStorage.getItem('token');
  }
  
  static setRefreshToken(token) {
    localStorage.setItem('refreshToken', token);
  }
  
  static getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }
  
  static clearTokens() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
  
  static isLoggedIn() {
    return !!this.getToken();
  }
}

// API Request Helper
class ApiClient {
  static async request(url, method = 'GET', data = null) {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    const token = TokenManager.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const config = {
      method,
      headers,
    };
    
    if (data && method !== 'GET') {
      config.body = JSON.stringify(data);
    }
    
    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await this.refreshToken();
        if (refreshed) {
          return this.request(url, method, data);
        } else {
          TokenManager.clearTokens();
          window.location.href = '/login.html';
          return null;
        }
      }
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP Error: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return response;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }
  
  static async get(url) {
    return this.request(url, 'GET');
  }
  
  static async post(url, data) {
    return this.request(url, 'POST', data);
  }
  
  static async put(url, data) {
    return this.request(url, 'PUT', data);
  }
  
  static async delete(url) {
    return this.request(url, 'DELETE');
  }
  
  static async refreshToken() {
    const refreshToken = TokenManager.getRefreshToken();
    if (!refreshToken) return false;
    
    try {
      const response = await this.post(API_ENDPOINTS.auth.refreshToken, {
        refreshToken,
      });
      
      if (response.token) {
        TokenManager.setToken(response.token);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
    
    return false;
  }
}
```

### 2. Update Login Page

Update your login form to use the API:

```html
<!-- In your login page -->
<script src="js/api-config.js"></script>

<script>
// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const response = await ApiClient.post(API_ENDPOINTS.auth.login, {
      email,
      password,
    });
    
    // Store tokens
    TokenManager.setToken(response.token);
    TokenManager.setRefreshToken(response.refreshToken);
    
    // Redirect based on role
    if (response.user.role === 'admin') {
      window.location.href = 'admin-dashboard.html';
    } else {
      window.location.href = 'student-dashboard.html';
    }
  } catch (error) {
    alert('Login failed: ' + error.message);
  }
});
</script>
```

### 3. Update Student Registration

```javascript
// Student Registration Handler
document.getElementById('registrationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
    track: document.getElementById('track').value,
    programme: document.getElementById('programme').value,
  };
  
  try {
    const response = await ApiClient.post(
      API_ENDPOINTS.auth.register,
      data
    );
    
    TokenManager.setToken(response.token);
    alert('Registration successful!');
    window.location.href = 'student-dashboard.html';
  } catch (error) {
    alert('Registration failed: ' + error.message);
  }
});
```

### 4. Update Dashboard

Load dashboard data from API:

```javascript
// Load Admin Dashboard
async function loadAdminDashboard() {
  try {
    const data = await ApiClient.get(API_ENDPOINTS.dashboard.admin);
    
    // Update statistics
    document.getElementById('totalStudents').textContent = 
      data.studentStats.total_students;
    document.getElementById('activeStudents').textContent = 
      data.studentStats.active_students;
    document.getElementById('atRiskStudents').textContent = 
      data.studentStats.at_risk_students;
    document.getElementById('completedStudents').textContent = 
      data.studentStats.completed_students;
    
    // Update project stats
    document.getElementById('totalProjects').textContent = 
      data.projectStats.total_projects;
    document.getElementById('approvedProjects').textContent = 
      data.projectStats.approved;
    
    // Display recent submissions
    displayRecentProjects(data.recentProjects);
    
    // Display at-risk students
    displayAtRiskStudents(data.atRiskStudents);
  } catch (error) {
    console.error('Failed to load dashboard:', error);
  }
}

function displayRecentProjects(projects) {
  const container = document.getElementById('recentProjects');
  container.innerHTML = projects.map(p => `
    <div class="project-card">
      <h4>${p.title}</h4>
      <p>By: ${p.student_name}</p>
      <p>Status: ${p.status}</p>
      <a href="${p.github_link}" target="_blank">View Repository</a>
    </div>
  `).join('');
}

function displayAtRiskStudents(students) {
  const container = document.getElementById('atRiskStudents');
  container.innerHTML = students.map(s => `
    <div class="student-card alert">
      <h4>${s.name}</h4>
      <p>Track: ${s.track}</p>
      <p>Status: ${s.status}</p>
      <button onclick="contactStudent(${s.id})">Contact</button>
    </div>
  `).join('');
}

// Load on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAdminDashboard);
} else {
  loadAdminDashboard();
}
```

### 5. Update Student Management

```javascript
// Load Students List
async function loadStudents() {
  try {
    const students = await ApiClient.get(API_ENDPOINTS.users.students);
    displayStudents(students);
  } catch (error) {
    console.error('Failed to load students:', error);
  }
}

// Create Student
document.getElementById('createStudentForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const data = {
    name: document.getElementById('studentName').value,
    email: document.getElementById('studentEmail').value,
    password: 'TempPassword123!',
    track: document.getElementById('studentTrack').value,
    programme: document.getElementById('studentProgramme').value,
  };
  
  try {
    await ApiClient.post(API_ENDPOINTS.users.students, data);
    alert('Student created successfully!');
    loadStudents();
  } catch (error) {
    alert('Error creating student: ' + error.message);
  }
});

// Update Student
async function updateStudent(studentId) {
  const data = {
    status: document.getElementById(`status_${studentId}`).value,
    mentorId: parseInt(document.getElementById(`mentor_${studentId}`).value),
  };
  
  try {
    await ApiClient.put(API_ENDPOINTS.users.student(studentId), data);
    alert('Student updated successfully!');
  } catch (error) {
    alert('Error updating student: ' + error.message);
  }
}

// Delete Student
async function deleteStudent(studentId) {
  if (confirm('Are you sure you want to delete this student?')) {
    try {
      await ApiClient.delete(API_ENDPOINTS.users.student(studentId));
      alert('Student deleted successfully!');
      loadStudents();
    } catch (error) {
      alert('Error deleting student: ' + error.message);
    }
  }
}
```

### 6. Update Attendance Tracking

```javascript
// Mark Attendance
async function markAttendance(studentId, date, status) {
  try {
    const response = await ApiClient.post(
      API_ENDPOINTS.attendance.mark(studentId),
      { date, status }
    );
    alert('Attendance marked successfully!');
    return response;
  } catch (error) {
    alert('Error marking attendance: ' + error.message);
  }
}

// Get Student Attendance Percentage
async function getAttendancePercentage(studentId) {
  try {
    const data = await ApiClient.get(
      API_ENDPOINTS.attendance.percentage(studentId)
    );
    return data.percentage;
  } catch (error) {
    console.error('Error fetching attendance:', error);
  }
}

// Get Attendance Report
async function getAttendanceReport(studentId) {
  try {
    return await ApiClient.get(
      API_ENDPOINTS.attendance.report(studentId)
    );
  } catch (error) {
    console.error('Error fetching report:', error);
  }
}
```

### 7. Update Project Management

```javascript
// Submit Project
document.getElementById('projectForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const studentId = TokenManager.getToken() ? await getCurrentUserId() : null;
  
  const data = {
    title: document.getElementById('projectTitle').value,
    description: document.getElementById('projectDescription').value,
    githubLink: document.getElementById('githubLink').value,
  };
  
  try {
    await ApiClient.post(
      API_ENDPOINTS.projects.submit(studentId),
      data
    );
    alert('Project submitted successfully!');
  } catch (error) {
    alert('Error submitting project: ' + error.message);
  }
});

// Get Student Projects
async function loadStudentProjects(studentId) {
  try {
    const projects = await ApiClient.get(
      API_ENDPOINTS.projects.studentProjects(studentId)
    );
    displayProjects(projects);
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Update Project (Admin)
async function updateProjectStatus(projectId, status, feedback) {
  try {
    await ApiClient.put(
      API_ENDPOINTS.projects.byId(projectId),
      { status, feedback }
    );
    alert('Project updated successfully!');
  } catch (error) {
    alert('Error updating project: ' + error.message);
  }
}
```

### 8. Logout Handler

```javascript
// Logout Function
function logout() {
  TokenManager.clearTokens();
  window.location.href = 'login.html';
}

// Add to HTML
document.getElementById('logoutBtn').addEventListener('click', logout);
```

## Example HTML Integration

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Internship Management</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div id="dashboard">
    <h1>Admin Dashboard</h1>
    
    <div class="stats">
      <div class="stat-card">
        <h3>Total Students</h3>
        <p id="totalStudents">-</p>
      </div>
      <div class="stat-card">
        <h3>Active Students</h3>
        <p id="activeStudents">-</p>
      </div>
      <div class="stat-card">
        <h3>At Risk</h3>
        <p id="atRiskStudents">-</p>
      </div>
    </div>
    
    <button id="logoutBtn" class="btn-logout">Logout</button>
  </div>
  
  <script src="js/api-config.js"></script>
  <script src="js/script.js"></script>
</body>
</html>
```

## Environment Configuration

Update your API base URL for different environments:

```javascript
// In api-config.js
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://api.internship-system.com'
  : 'http://localhost:5000/api/v1';
```

## Error Handling Best Practices

```javascript
async function safeApiCall(apiFunction) {
  try {
    return await apiFunction();
  } catch (error) {
    if (error.message.includes('401')) {
      // Token invalid, redirect to login
      window.location.href = '/login.html';
    } else if (error.message.includes('403')) {
      alert('You do not have permission to perform this action');
    } else if (error.message.includes('404')) {
      alert('Resource not found');
    } else {
      alert('An error occurred: ' + error.message);
    }
  }
}
```

## Testing the Integration

1. Start the backend: `npm run dev` (in backend folder)
2. Open your frontend in a browser
3. Test login with: `admin@internship.com` / `admin123`
4. Verify all endpoints are working
5. Check browser console for API errors

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Check CORS_ORIGIN in backend .env |
| Token not persisting | Check localStorage is enabled |
| API not responding | Ensure backend is running on port 5000 |
| 401 Unauthorized | Token may be expired, refresh or re-login |

---

**You're all set!** Your frontend is now connected to the backend API.

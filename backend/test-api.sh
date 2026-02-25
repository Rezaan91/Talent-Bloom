#!/bin/bash
# API Testing Script - Internship Management System
# Save as: test-api.sh
# Usage: bash test-api.sh

BASE_URL="http://localhost:5000/api/v1"
TOKEN=""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}=== Internship Management System API Testing ===${NC}\n"

# 1. Test Health Endpoint
echo -e "${YELLOW}1. Testing Health Endpoint...${NC}"
curl -s http://localhost:5000/health | jq '.'
echo -e "\n"

# 2. Login
echo -e "${YELLOW}2. Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@internship.com",
    "password": "admin123"
  }')

echo "$LOGIN_RESPONSE" | jq '.'
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')
echo -e "${GREEN}Token: $TOKEN${NC}\n"

# 3. Get User Profile
echo -e "${YELLOW}3. Getting User Profile...${NC}"
curl -s -X GET "$BASE_URL/users/profile" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 4. Get All Students
echo -e "${YELLOW}4. Getting All Students...${NC}"
curl -s -X GET "$BASE_URL/users/students" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 5. Get Student Stats
echo -e "${YELLOW}5. Getting Student Statistics...${NC}"
curl -s -X GET "$BASE_URL/users/students/stats" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 6. Get All Mentors
echo -e "${YELLOW}6. Getting All Mentors...${NC}"
curl -s -X GET "$BASE_URL/mentors" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 7. Get All Tracks
echo -e "${YELLOW}7. Getting All Tracks...${NC}"
curl -s -X GET "$BASE_URL/tracks" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 8. Get Admin Dashboard
echo -e "${YELLOW}8. Getting Admin Dashboard...${NC}"
curl -s -X GET "$BASE_URL/dashboard/admin" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 9. Get Student by ID (1)
echo -e "${YELLOW}9. Getting Student by ID (2)...${NC}"
curl -s -X GET "$BASE_URL/users/students/2" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

# 10. Get Attendance Percentage
echo -e "${YELLOW}10. Getting Attendance Percentage for Student 2...${NC}"
curl -s -X GET "$BASE_URL/attendance/students/2/percentage" \
  -H "Authorization: Bearer $TOKEN" | jq '.'
echo -e "\n"

echo -e "${GREEN}=== API Testing Complete ===${NC}"

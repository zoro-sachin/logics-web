# API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `201 Created`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "xp": 0,
    "currentLevel": 1
  }
}
```

### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "xp": 150,
    "currentLevel": 2
  }
}
```

### Get Current User
```http
GET /auth/me
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "xp": 150,
    "currentLevel": 2,
    "streak": 5
  }
}
```

---

## 🎮 Games Endpoints

### Start Game
```http
POST /games/start
```
🔒 **Protected Route**

**Request Body:**
```json
{
  "gameType": "memory-matrix",
  "difficulty": "medium"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sessionId": "507f1f77bcf86cd799439012",
    "gameType": "memory-matrix",
    "difficulty": "medium",
    "config": {
      "gridSize": 4,
      "timeToMemorize": 5,
      "maxScore": 1000
    }
  }
}
```

### Submit Game
```http
POST /games/submit
```
🔒 **Protected Route**

**Request Body:**
```json
{
  "gameType": "memory-matrix",
  "difficulty": "medium",
  "score": 850,
  "timeSpent": 45,
  "accuracy": 85,
  "gameData": {
    "gridSize": 4,
    "correctTiles": 12,
    "totalTiles": 16
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "userId": "507f1f77bcf86cd799439011",
    "gameType": "memory-matrix",
    "score": 850,
    "accuracy": 85,
    "rank": 15,
    "xpEarned": 50
  }
}
```

### Get Game History
```http
GET /games/history?limit=10&gameType=memory-matrix
```
🔒 **Protected Route**

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)
- `gameType` (optional): Filter by game type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "gameType": "memory-matrix",
      "difficulty": "medium",
      "score": 850,
      "accuracy": 85,
      "timeSpent": 45,
      "createdAt": "2026-02-05T08:30:00.000Z"
    }
  ]
}
```

### Get Leaderboard
```http
GET /games/leaderboard/:gameType?limit=100
```

**Path Parameters:**
- `gameType`: Game type (memory-matrix, pattern-recognition, time-attack)

**Query Parameters:**
- `limit` (optional): Number of results (default: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "username": "player1",
      "score": 1500,
      "accuracy": 95,
      "gamesPlayed": 25,
      "createdAt": "2026-02-05T08:30:00.000Z"
    }
  ]
}
```

### Get Game Statistics
```http
GET /games/stats
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "memory-matrix",
      "totalPlayed": 15,
      "bestScore": 1200,
      "avgScore": 850,
      "avgAccuracy": 82
    }
  ]
}
```

---

## 📊 Analytics Endpoints

### Get Overview
```http
GET /analytics/overview
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalPoints": 1250,
    "totalGames": 45,
    "totalQuizzes": 12,
    "accuracy": 78,
    "level": "Logical Master",
    "streak": 7
  }
}
```

### Get Strengths Analysis
```http
GET /analytics/strengths
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "categoryPerformance": [
      {
        "category": "number series",
        "avgAccuracy": 85,
        "totalAttempts": 20
      }
    ],
    "radarData": [
      { "category": "Number Series", "value": 85 },
      { "category": "Patterns", "value": 78 }
    ]
  }
}
```

### Get Activity Heatmap
```http
GET /analytics/activity?days=30
```
🔒 **Protected Route**

**Query Parameters:**
- `days` (optional): Number of days to fetch (default: 30)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-05",
      "count": 5,
      "types": {
        "games": 3,
        "quizzes": 2
      }
    }
  ]
}
```

### Get Performance Trends
```http
GET /analytics/trends?period=week
```
🔒 **Protected Route**

**Query Parameters:**
- `period` (optional): week, month, year (default: week)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-01",
      "avgAccuracy": 75,
      "totalActivities": 8,
      "xpEarned": 120
    }
  ]
}
```

### Get Recent Activity
```http
GET /analytics/recent?limit=5
```
🔒 **Protected Route**

**Query Parameters:**
- `limit` (optional): Number of activities (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "type": "game",
      "gameType": "memory-matrix",
      "score": 850,
      "difficulty": "medium",
      "createdAt": "2026-02-05T08:30:00.000Z"
    },
    {
      "type": "quiz",
      "category": "reasoning",
      "percentage": 85,
      "difficulty": "hard",
      "createdAt": "2026-02-05T07:15:00.000Z"
    }
  ]
}
```

---

## 📝 Quiz Endpoints

### Submit Quiz
```http
POST /quizzes/submit
```
🔒 **Protected Route**

**Request Body:**
```json
{
  "category": "reasoning",
  "difficulty": "medium",
  "score": 8,
  "totalQuestions": 10,
  "percentage": 0.8,
  "timeSpent": 300
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "userId": "507f1f77bcf86cd799439011",
    "category": "reasoning",
    "score": 8,
    "percentage": 80,
    "xpEarned": 40
  }
}
```

### Get Quiz History
```http
GET /quizzes/history?limit=10
```
🔒 **Protected Route**

**Query Parameters:**
- `limit` (optional): Number of results (default: 20)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "category": "reasoning",
      "difficulty": "medium",
      "score": 8,
      "totalQuestions": 10,
      "percentage": 80,
      "timeSpent": 300,
      "createdAt": "2026-02-05T08:30:00.000Z"
    }
  ]
}
```

---

## ❓ Question Endpoints

### Generate Question
```http
POST /questions/generate
```
🔒 **Protected Route**

**Request Body:**
```json
{
  "category": "number series",
  "subcategory": "arithmetic",
  "difficulty": "medium"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "category": "number series",
    "difficulty": "medium",
    "questionText": "What comes next: 2, 4, 6, 8, ?",
    "options": ["9", "10", "11", "12"],
    "correctAnswer": "10",
    "explanation": "This is an arithmetic sequence with a common difference of 2.",
    "hint": "Look for the pattern in the differences.",
    "points": 15
  }
}
```

### Submit Answer
```http
POST /questions/submit
```
🔒 **Protected Route**

**Request Body:**
```json
{
  "questionId": "507f1f77bcf86cd799439015",
  "selectedAnswer": "10",
  "timeSpent": 15
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "correct": true,
    "explanation": "This is an arithmetic sequence with a common difference of 2.",
    "xpEarned": 15,
    "newXP": 165,
    "levelUp": false
  }
}
```

---

## 👤 User Endpoints

### Get User Statistics
```http
GET /users/stats
```
🔒 **Protected Route**

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "totalXP": 1250,
    "currentLevel": 5,
    "streak": 7,
    "totalGames": 45,
    "totalQuizzes": 12,
    "avgAccuracy": 78,
    "recentActivity": []
  }
}
```

### Get Global Leaderboard
```http
GET /users/leaderboard?limit=100
```

**Query Parameters:**
- `limit` (optional): Number of users (default: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "username": "player1",
      "xp": 5000,
      "level": 10,
      "gamesPlayed": 150
    }
  ]
}
```

---

## 🚨 Error Responses

All endpoints follow a consistent error format:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Invalid input data"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Not authorized, token failed"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Resource not found"
}
```

### 500 Server Error
```json
{
  "success": false,
  "error": "Server error"
}
```

---

## 📌 Rate Limiting

- **Default**: 100 requests per 15 minutes per IP
- **Authentication**: 5 requests per 15 minutes per IP
- **Games/Quizzes**: 50 requests per 15 minutes per user

---

## 🔄 Pagination

Endpoints that return lists support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)

**Response includes:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## 📝 Notes

- All timestamps are in ISO 8601 format (UTC)
- All IDs are MongoDB ObjectIds
- Percentages are returned as decimals (0.85 = 85%)
- Scores and XP are integers
- Game types: `memory-matrix`, `pattern-recognition`, `time-attack`
- Difficulties: `easy`, `medium`, `hard`
- Categories: `number series`, `patterns`, `puzzles`, `aptitude`, `reasoning`

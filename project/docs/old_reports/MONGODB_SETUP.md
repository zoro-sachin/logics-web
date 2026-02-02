# 🗄️ MongoDB Setup & Configuration Guide

## Current Status
✅ MongoDB is currently running and connected
✅ Database connection working properly
✅ All models and schemas ready to use

---

## 📊 MongoDB Connection

### Current Configuration
```
Connection String: mongodb://localhost:27017/logical-thinking-db
Database Name: logical-thinking-db
Status: ✅ Connected
```

### Database Collections
Your database will automatically create these collections when first used:

1. **users** - User accounts and profiles
   - Fields: username, email, password (hashed), skillLevel, totalScore, badges, progress
   
2. **questions** - Practice questions
   - Fields: category, difficulty, questionText, options, correctAnswer, explanation, points
   
3. **quizzes** - Structured tests
   - Fields: title, description, category, questions (references), timeLimit, passingScore
   
4. **scores** - User quiz/practice scores
   - Fields: userId, quizId, score, correctAnswers, totalQuestions, date
   
5. **certificates** - Generated certificates
   - Fields: userId, scoreId, certificateUrl, issuedDate, expiryDate
   
6. **leaderboards** - User rankings
   - Fields: userId, rank, totalScore, category, lastUpdated

---

## 🚀 MongoDB Installation & Setup

### Option 1: Local MongoDB (Recommended for Development)

#### Windows - Install MongoDB Community Edition

**Step 1: Download Installer**
1. Visit: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (e.g., 7.0)
   - OS: Windows x64
   - Package: MSI
3. Click Download

**Step 2: Run Installer**
1. Open the downloaded `.msi` file
2. Follow installation wizard:
   - Accept license
   - Choose Complete Setup
   - Check "Install MongoDB as a Service"
   - Uncheck "Install MongoDB Compass" (optional)
3. Complete installation

**Step 3: Verify Installation**
```powershell
# Open new PowerShell and check if MongoDB is running
Get-Service | Where-Object {$_.Name -like "*Mongo*"}

# Should show: mongod running status
```

**Step 4: Create Data Directory**
```powershell
mkdir C:\data\db
mkdir C:\data\log
```

**Step 5: Start MongoDB (if not auto-started)**
```powershell
# MongoDB should auto-start as a service
# Or manually start:
net start MongoDB

# To stop:
net stop MongoDB
```

### Option 2: MongoDB Atlas (Cloud Database)

#### Using MongoDB Cloud Service

**Step 1: Create Account**
1. Visit: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google account

**Step 2: Create Cluster**
1. Click "Create a Deployment"
2. Select "Free" tier (M0)
3. Choose region (closest to you)
4. Click "Create"
5. Wait for cluster to deploy (5-10 minutes)

**Step 3: Setup Network Access**
1. Go to "Network Access"
2. Click "Add IP Address"
3. Enter `0.0.0.0/0` for development (or your IP)
4. Click Confirm

**Step 4: Create Database User**
1. Go to "Database Access"
2. Click "Add New Database User"
3. Enter:
   - Username: `admin` (or your choice)
   - Password: Generate secure password
   - Role: `Read and write to any database`
4. Click "Add User"

**Step 5: Get Connection String**
1. Go to "Database"
2. Click "Connect"
3. Select "Drivers"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<dbname>`

**Step 6: Update .env**
```
# Replace MONGODB_URI with:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/logical-thinking-db?retryWrites=true&w=majority
```

---

## 🔧 Database Configuration

### Current .env Configuration
```env
MONGODB_URI=mongodb://localhost:27017/logical-thinking-db
```

### Switching to Atlas
1. Sign up at MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Create cluster and database user
3. Get connection string
4. Update `.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/logical-thinking-db?retryWrites=true&w=majority
   ```
5. Restart server: `npm start`

---

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,              // 3-30 characters, unique
  email: String,                 // Valid email, unique
  password: String,              // Hashed with bcrypt
  skillLevel: String,            // 'Beginner', 'Intermediate', 'Advanced', 'Expert'
  totalScore: Number,            // 0 by default
  badges: [
    {
      name: String,
      earnedAt: Date
    }
  ],
  progress: {
    numberSeries: Number,
    patterns: Number,
    puzzles: Number,
    aptitude: Number,
    reasoning: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Questions Collection
```javascript
{
  _id: ObjectId,
  category: String,              // 'number-series', 'patterns', 'puzzles', 'aptitude', 'reasoning'
  difficulty: String,            // 'easy', 'medium', 'hard'
  questionText: String,
  options: [String, String, String, String],  // 4 options (A, B, C, D)
  correctAnswer: String,         // The correct option text
  explanation: String,           // Detailed explanation
  points: Number,                // 10 (easy), 20 (medium), 30 (hard)
  generatedBy: String,           // 'AI' or 'manual'
  aiGeneratedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Quizzes Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,              // Or 'mixed'
  questions: [ObjectId],         // References to Question documents
  timeLimit: Number,             // In minutes (e.g., 30)
  passingScore: Number,          // Percentage (e.g., 60)
  difficulty: String,            // 'easy', 'medium', 'hard', 'mixed'
  isActive: Boolean,             // true for active quizzes
  createdAt: Date,
  updatedAt: Date
}
```

### Scores Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to User
  quizId: ObjectId,              // Reference to Quiz
  score: Number,                 // Points earned
  correctAnswers: Number,        // Count of correct answers
  totalQuestions: Number,        // Total questions in quiz
  percentage: Number,            // Score percentage
  timeTaken: Number,             // In seconds
  submittedAt: Date
}
```

### Certificates Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to User
  scoreId: ObjectId,             // Reference to Score
  certificateUrl: String,        // URL to PDF
  issuedDate: Date,
  expiryDate: Date,              // Optional
  createdAt: Date
}
```

---

## 🔍 Viewing & Managing Data

### Option 1: MongoDB Compass (GUI)

**Download**: https://www.mongodb.com/products/tools/compass
**Steps:**
1. Install MongoDB Compass
2. Launch application
3. Click "Connect"
4. Should auto-connect to `mongodb://localhost:27017`
5. Browse databases and collections

### Option 2: Mongo Shell (CLI)

**Open PowerShell:**
```powershell
mongosh
# or
mongo
```

**Common Commands:**
```javascript
// Show databases
show dbs

// Use database
use logical-thinking-db

// Show collections
show collections

// View users
db.users.find()

// View first user
db.users.findOne()

// View questions
db.questions.find()

// Count documents
db.users.countDocuments()

// Delete all (careful!)
db.users.deleteMany({})
```

### Option 3: VS Code Extension

1. Install "MongoDB for VS Code" extension
2. Reload VS Code
3. Connect to MongoDB
4. Browse and manage databases directly in VS Code

---

## 📋 Sample Data

### Adding Sample Questions (using mongo shell)

```javascript
// Connect to database
use logical-thinking-db

// Insert sample question
db.questions.insertOne({
  category: "number-series",
  difficulty: "easy",
  questionText: "What comes next in the series? 2, 4, 6, 8, ?",
  options: ["10", "12", "14", "16"],
  correctAnswer: "10",
  explanation: "This is a simple arithmetic sequence where each number increases by 2. Starting from 2: 2+2=4, 4+2=6, 6+2=8, 8+2=10.",
  points: 10,
  generatedBy: "manual",
  aiGeneratedAt: new Date()
})

// Insert multiple questions
db.questions.insertMany([
  {
    category: "patterns",
    difficulty: "medium",
    questionText: "Which pattern comes next?",
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctAnswer: "Option A",
    explanation: "Explanation here",
    points: 20,
    generatedBy: "AI"
  }
])
```

---

## ⚙️ Database Maintenance

### Backup Database

**Local MongoDB:**
```powershell
# Backup to folder
mongodump --db logical-thinking-db --out C:\backups

# Restore from backup
mongorestore --db logical-thinking-db C:\backups\logical-thinking-db
```

**MongoDB Atlas:**
1. Go to "Clusters"
2. Click "..." (three dots)
3. Select "Backup and Restore"
4. Click "Backup Now"

### Monitor Performance

**Check Database Size:**
```javascript
use logical-thinking-db
db.stats()
```

**Check Collection Size:**
```javascript
db.users.stats()
db.questions.stats()
```

---

## 🚀 Database Initialization

When you first run the application:

1. **Server starts** → Connects to MongoDB
2. **Models loaded** → Schema validation active
3. **Routes ready** → API endpoints listening
4. **Collections auto-create** → When first document inserted

### First User Registration:
```
POST /api/auth/register
Body: {
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

→ Inserts into db.users
→ Returns JWT token
```

---

## 🔐 MongoDB Security

### For Development (Current Setup)
- ✅ Local MongoDB (no auth required)
- ✅ .env file with connection string

### For Production (IMPORTANT)
- ❌ Don't use local MongoDB
- ✅ Use MongoDB Atlas with:
  - Strong password
  - IP whitelist
  - Encrypted connections (SSL)
  - Regular backups
  - Authentication enabled

### Update .env for Production:
```env
# Development
MONGODB_URI=mongodb://localhost:27017/logical-thinking-db

# Production (NEVER commit this!)
MONGODB_URI=mongodb+srv://dbuser:securePassword@cluster.mongodb.net/logical-thinking-db?retryWrites=true&w=majority
```

---

## ✅ Troubleshooting

### "Cannot connect to MongoDB"

**Solution 1: Check if running**
```powershell
Get-Service | Where-Object {$_.Name -like "*Mongo*"}
# Should show status: Running

# If not running, start it:
net start MongoDB
```

**Solution 2: Check connection string**
```env
# For local MongoDB, should be:
MONGODB_URI=mongodb://localhost:27017/logical-thinking-db

# For Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

### "Database not found" error

**Solution:**
```javascript
// MongoDB automatically creates the database
// When first document is inserted
db.users.insertOne({username: "test", email: "test@test.com"})
```

### Performance Issues

**Check indexes:**
```javascript
db.users.getIndexes()

// Create index for faster queries
db.users.createIndex({email: 1})
```

---

## 📚 Further Reading

- MongoDB Documentation: https://docs.mongodb.com/
- Mongoose ODM: https://mongoosejs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Connection String URI: https://docs.mongodb.com/manual/reference/connection-string/

---

**Status: ✅ Database Connected and Ready**

Your MongoDB instance is running and the application is connected. You're ready to store and retrieve data!

*Last Updated: January 25, 2026*

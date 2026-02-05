# Logical Thinking Platform - Setup & Deployment Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher) - Running locally or MongoDB Atlas account
- **npm** or **yarn** package manager
- **Git** (optional, for version control)

---

## 🚀 Quick Start

### 1. Environment Setup

#### Backend (.env file)
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/logical-thinking-platform
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/logical-thinking-platform

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: OpenAI API (if using AI features)
OPENAI_API_KEY=your-openai-api-key-here
```

#### Frontend (proxy configuration)
The `client/package.json` already includes:
```json
"proxy": "http://localhost:5000"
```

### 2. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed Database (Optional but Recommended)

```bash
# From the server directory
cd server
node scripts/seedQuestions.js
```

This will populate your database with 30+ sample questions across all categories.

### 4. Run the Application

#### Development Mode (Recommended for testing)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm start
```

The application will open at `http://localhost:3000`

#### Production Mode

```bash
# Build the frontend
cd client
npm run build

# Serve from backend
cd ../server
npm start
```

---

## 📁 Project Structure

```
project/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── analytics/ # Analytics visualizations
│   │   │   ├── games/     # Game components
│   │   │   ├── gamification/ # XP, streaks, badges
│   │   │   └── quiz/      # Quiz components
│   │   ├── context/       # React context providers
│   │   ├── data/          # Static data (knowledge content)
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   └── App.js         # Main app component
│   └── package.json
│
└── server/                # Node.js backend
    ├── controllers/       # Request handlers
    ├── middleware/        # Auth, error handling
    ├── models/           # Mongoose schemas
    ├── routes/           # API routes
    ├── scripts/          # Utility scripts (seed data)
    ├── services/         # Business logic
    ├── config/           # Configuration files
    └── server.js         # Entry point
```

---

## 🔑 Key Features & Routes

### Frontend Routes
- `/` - Landing page
- `/login` - User login
- `/register` - User registration
- `/dashboard` - User dashboard with analytics
- `/practice` - Practice mode
- `/games` - Interactive logic games
- `/quizzes` - Timed quizzes
- `/knowledge` - Knowledge vault
- `/leaderboard` - Global rankings
- `/certificates` - User certificates

### Backend API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

#### Questions
- `POST /api/questions/generate` - Generate question
- `POST /api/questions/submit` - Submit answer

#### Games
- `POST /api/games/start` - Start game session
- `POST /api/games/submit` - Submit game results
- `GET /api/games/history` - Get game history
- `GET /api/games/leaderboard/:gameType` - Get leaderboard
- `GET /api/games/stats` - Get game statistics

#### Analytics
- `GET /api/analytics/overview` - Overview statistics
- `GET /api/analytics/strengths` - Strengths analysis
- `GET /api/analytics/activity` - Activity heatmap
- `GET /api/analytics/trends` - Performance trends
- `GET /api/analytics/recent` - Recent activity

#### Quizzes
- `POST /api/quizzes/submit` - Submit quiz results
- `GET /api/quizzes/history` - Quiz history

#### Users
- `GET /api/users/stats` - User statistics
- `GET /api/users/leaderboard` - Global leaderboard

---

## 🌐 Deployment

### Option 1: Vercel (Frontend) + Render (Backend)

#### Deploy Backend to Render

1. Create account at [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment Variables**: Add all from `.env`

#### Deploy Frontend to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import your repository
3. Configure:
   - **Framework Preset**: Create React App
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `build`
4. Add environment variable:
   - `REACT_APP_API_URL`: Your Render backend URL

5. Update `client/src/services/*.js` to use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
```

### Option 2: Heroku (Full Stack)

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add MongoDB addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Option 3: DigitalOcean / AWS / Azure

1. Set up a VPS/VM
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies
5. Configure nginx as reverse proxy
6. Set up PM2 for process management:

```bash
npm install -g pm2
pm2 start server/server.js --name "logic-platform"
pm2 startup
pm2 save
```

---

## 🧪 Testing

### Manual Testing Checklist

#### Authentication
- [ ] Register new user
- [ ] Login with credentials
- [ ] Logout functionality
- [ ] Protected routes redirect to login

#### Games
- [ ] Play Memory Matrix (all difficulties)
- [ ] Play Pattern Recognition
- [ ] Play Time-Attack Logic
- [ ] Verify scores are saved
- [ ] Check leaderboards update

#### Quizzes
- [ ] Start quiz with timer
- [ ] Answer questions
- [ ] View results with explanations
- [ ] Verify backend submission

#### Knowledge Vault
- [ ] Navigate categories
- [ ] Expand/collapse topics
- [ ] View examples

#### Dashboard
- [ ] Stats display correctly
- [ ] Recent activity shows
- [ ] Game performance visible
- [ ] Charts render properly

### API Testing with Postman/Thunder Client

```bash
# Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}

# Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}

# Get Analytics (requires JWT token)
GET http://localhost:5000/api/analytics/overview
Authorization: Bearer <your-jwt-token>
```

---

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Ensure MongoDB is running
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change port in `.env` or kill process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill
```

#### CORS Errors
**Solution**: Ensure proxy is set in `client/package.json` or configure CORS in `server/server.js`

#### Missing Dependencies
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Database Schema

### Users Collection
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  xp: Number,
  currentLevel: Number,
  streak: Number,
  gamesPlayed: [{
    gameType: String,
    totalPlayed: Number,
    bestScore: Number,
    avgAccuracy: Number
  }],
  progress: Object,
  createdAt: Date
}
```

### Games Collection
```javascript
{
  userId: ObjectId,
  gameType: String,
  difficulty: String,
  score: Number,
  timeSpent: Number,
  accuracy: Number,
  gameData: Object,
  createdAt: Date
}
```

### Questions Collection
```javascript
{
  category: String,
  difficulty: String,
  questionText: String,
  options: [String],
  correctAnswer: String,
  explanation: String,
  hint: String,
  points: Number
}
```

---

## 🔐 Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **JWT Secret**: Use strong, random secret in production
3. **Password Hashing**: Already implemented with bcrypt
4. **Input Validation**: Validate all user inputs
5. **Rate Limiting**: Consider adding rate limiting middleware
6. **HTTPS**: Always use HTTPS in production
7. **MongoDB**: Use MongoDB Atlas with IP whitelisting

---

## 📈 Performance Optimization

### Frontend
- Code splitting with React.lazy()
- Image optimization
- Minimize bundle size
- Use production build

### Backend
- Database indexing on frequently queried fields
- Implement caching (Redis)
- Use compression middleware
- Optimize aggregation pipelines

---

## 🆘 Support & Maintenance

### Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor server health (PM2, New Relic)
- Database performance monitoring

### Backups
```bash
# MongoDB backup
mongodump --uri="mongodb://localhost:27017/logical-thinking-platform" --out=./backup

# Restore
mongorestore --uri="mongodb://localhost:27017/logical-thinking-platform" ./backup
```

### Updates
```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Security audit
npm audit
npm audit fix
```

---

## 📝 License & Credits

This platform was built using:
- React.js
- Node.js & Express
- MongoDB & Mongoose
- React Icons
- Recharts (for analytics)

---

## 🎯 Next Steps After Deployment

1. Set up custom domain
2. Configure SSL certificate
3. Set up email service (SendGrid, Mailgun)
4. Implement social login (Google, GitHub)
5. Add more game types
6. Expand knowledge vault content
7. Create mobile app (React Native)
8. Add multiplayer features

---

**Need Help?** Check the walkthrough.md for detailed feature documentation.

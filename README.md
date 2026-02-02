# Logical Thinking Learning Platform

A full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to help students improve their logical reasoning and problem-solving skills through interactive practice, quizzes, and AI-powered learning.

## 🎯 Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based registration and login
- ✅ **AI-Powered Question Generation** - Dynamic questions using OpenAI GPT
- ✅ **Practice Mode** - Unlimited practice with instant feedback
- ✅ **AI Hints & Explanations** - Smart guidance without giving away answers
- ✅ **Progress Tracking** - Monitor improvement across categories
- ✅ **Skill Levels** - Automatic progression from Beginner to Expert
- ✅ **Badge System** - Earn achievements as you learn
- 🔄 **Quiz System** - Timed tests (backend ready, frontend placeholder)
- 🔄 **Leaderboard** - Competitive rankings (backend ready, frontend placeholder)
- 🔄 **Certificates** - PDF generation for achievements (backend ready, frontend placeholder)

### Question Categories
- Number Series
- Patterns
- Puzzles
- Aptitude
- Reasoning

### Difficulty Levels
- Easy
- Medium
- Hard

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **OpenAI API** - AI question generation and hints
- **PDFKit** - Certificate generation

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📁 Project Structure

```
project 1/
├── server/                    # Backend
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Question.js
│   │   ├── Quiz.js
│   │   ├── Score.js
│   │   └── Certificate.js
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── aiController.js
│   │   ├── questionController.js
│   │   ├── quizController.js
│   │   ├── leaderboardController.js
│   │   └── certificateController.js
│   ├── routes/              # API endpoints
│   ├── middleware/          # Auth & validation
│   ├── utils/               # Helper functions
│   ├── server.js            # Entry point
│   └── package.json
│
├── client/                  # Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   ├── Navbar.js
│   │   │   ├── ProtectedRoute.js
│   │   │   ├── LoadingSpinner.js
│   │   │   └── ErrorMessage.js
│   │   ├── context/        # State management
│   │   │   └── AuthContext.js
│   │   ├── pages/          # Page components
│   │   │   ├── Landing.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Practice.js
│   │   │   ├── Quizzes.js
│   │   │   ├── Leaderboard.js
│   │   │   └── Certificates.js
│   │   ├── services/       # API calls
│   │   ├── utils/          # Helper functions
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- OpenAI API key

### Installation

#### 1. Clone and Setup Backend

```bash
# Navigate to server directory
cd "d:/project 1/server"

# Install dependencies
npm install

# Create .env file
copy .env.example .env

#Edit .env with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/logical-thinking-db
# JWT_SECRET=your_secure_jwt_secret_here
# OPENAI_API_KEY=your_openai_api_key_here
# NODE_ENV=development

# Start server
npm run dev
```

The backend server will run on `http://localhost:5000`

#### 2. Setup Frontend

```bash
# Open a new terminal
# Navigate to client directory
cd "d:/project 1/client"

# Install dependencies
npm install

# Start React app
npm start
```

The frontend will run on `http://localhost:3000`

### Database Setup

Make sure MongoDB is running:

**Local MongoDB:**
```bash
mongod
```

**Or use MongoDB Atlas** and update the `MONGODB_URI` in `.env`

## 🔑 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/logical-thinking-db
JWT_SECRET=your_jwt_secret_key_here_change_in_production
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/progress` - Update progress
- `GET /api/users/stats` - Get user statistics

### AI
- `POST /api/ai/generate-question` - Generate new question
- `POST /api/ai/hint` - Get hint for question
- `POST /api/ai/explain` - Get explanation

### Questions
- `GET /api/questions/practice` - Get practice question
- `POST /api/questions/submit` - Submit answer

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes/:id/submit` - Submit quiz

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard
- `GET /api/leaderboard/category/:category` - Category leaderboard

### Certificates
- `GET /api/certificates/check/:scoreId` - Check eligibility
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/user` - Get user certificates

## 🎨 Design Features

- **Modern UI** - Clean, professional design with Inter font
- **Responsive** - Works on desktop, tablet, and mobile
- **Smooth Animations** - Fade-in and slide transitions
- **Color-Coded Difficulty** - Visual indicators for question difficulty
- **Real-time Feedback** - Instant validation and explanations
- **Progress Visualization** - Charts and progress bars

## 🔐 Security

- Passwords hashed with bcrypt
- JWT token authentication
- Protected API routes
- Input validation on client and server
- CORS enabled
- Environment variables for sensitive data

## 💡 Usage Guide

### For Students

1. **Register/Login** - Create an account or log in
2. **Dashboard** - View your progress and statistics
3. **Practice Mode**:
   - Select category and difficulty
   - Generate AI-powered questions
   - Get hints if stuck
   - View detailed explanations
   - Earn points for correct answers
4. **Track Progress** - Monitor improvement across categories
5. **Earn Badges** - Unlock achievements as you learn

### For Developers

#### Adding New Categories
1. Update category enum in `server/models/Question.js`
2. Add category description in `server/utils/aiPrompts.js`
3. Update frontend category list in `client/src/pages/Practice.js`

#### Customizing AI Prompts
Edit `server/utils/aiPrompts.js` to modify question generation behavior

## 🔧 Extending the Platform

### Implementing Full Quiz System
The quiz backend is complete. To implement the frontend:
1. Create quiz listing component
2. Implement quiz session with timer
3. Add results page with detailed review
4. Connect to existing quiz API endpoints

### Implementing Leaderboard
The leaderboard backend is complete. To implement frontend:
1. Create leaderboard table component
2. Add category filters
3. Display user's rank
4. Connect to existing leaderboard API

### Implementing Certificates
The certificate backend is complete. To implement frontend:
1. Create certificate display component
2. Add download functionality
3. Show earned certificates
4. Connect to existing certificate API

## 📝 Notes

- **OpenAI API**: Requires valid OpenAI API key. Questions are generated in real-time.
- **Cost**: OpenAI API calls incur costs. Monitor usage in your OpenAI dashboard.
- **Question Cache**: Generated questions are saved to database for consistency.
- **Performance**: Consider implementing Redis caching for high traffic.

## 🐛 Troubleshooting

### Backend doesn't start
- Ensure MongoDB is running
- Check if port 5000 is available
- Verify environment variables in `.env`

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check proxy configuration in `client/package.json`

### OpenAI errors
- Verify your OpenAI API key is valid
- Check you have credits in your OpenAI account
- Review API rate limits

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables
2. Ensure MongoDB Atlas connection
3. Deploy with `npm start`

### Frontend (Vercel/Netlify)
1. Build with `npm run build`
2. Set API base URL to your backend
3. Deploy dist folder

## 📄 License

MIT

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙏 Acknowledgments

- OpenAI for GPT API
- MongoDB for database
- React team for amazing library
- All contributors and testers

---

**Built with ❤️ for learners who want to master logical thinking**

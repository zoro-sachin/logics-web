import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Quizzes from './pages/Quizzes';
import Leaderboard from './pages/Leaderboard';
import Certificates from './pages/Certificates';
import './index.css';

/**
 * Main App Component
 */
function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/practice"
                            element={
                                <ProtectedRoute>
                                    <Practice />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/quizzes"
                            element={
                                <ProtectedRoute>
                                    <Quizzes />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <ProtectedRoute>
                                    <Leaderboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/certificates"
                            element={
                                <ProtectedRoute>
                                    <Certificates />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;

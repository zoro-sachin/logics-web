import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page centered section-padding">
            <div className="container">
                <div className="auth-card glass-card fade-in">
                    <div className="auth-header text-center mb-lg">
                        <h1 className="text-gradient">Cognitive Login</h1>
                        <p className="text-secondary">Resume your analytical evolution.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full mt-lg"
                            disabled={loading}
                        >
                            {loading ? 'Authenticating...' : 'Commence Training'}
                        </button>
                    </form>

                    <div className="auth-footer mt-lg text-center">
                        <p>New to the platform? <Link to="/register" className="text-primary">Create Identity</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

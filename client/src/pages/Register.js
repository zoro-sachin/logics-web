import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await register(formData.username, formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="container">
                <div className="auth-card glass-card fade-in">
                    <div className="auth-header text-center mb-lg">
                        <h1 className="text-gradient">Initiate Identity</h1>
                        <p className="text-secondary">Join 10,000+ logical thinkers today.</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>Username</label>
                            <div className="input-container">
                                <FiUser />
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="thought_leader"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Email Address</label>
                            <div className="input-container">
                                <FiMail />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="logic@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-2">
                            <div className="input-group">
                                <label>Password</label>
                                <div className="input-container">
                                    <FiLock />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Confirm</label>
                                <div className="input-container">
                                    <FiLock />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-full"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Begin Ascension'}
                        </button>
                    </form>

                    <div className="auth-footer text-center">
                        <p>Already a member? <Link to="/login" className="text-primary">Sign In</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

import React, { useState } from 'react';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await contactAPI.send(formData);
      setMessage('Message sent successfully!');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setMessage('Failed to send message. Please try again.');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <section className="section">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <h1 className="section-title">Get In Touch</h1>
              <p>
                I'm always interested in hearing about new opportunities and projects.
                Feel free to reach out if you'd like to collaborate!
              </p>

              <div className="contact-details">
                <div className="contact-item">
                  <h4>Email</h4>
                  <p>sachins.devp@gmail.com</p>
                </div>
                <div className="contact-item">
                  <h4>Location</h4>
                  <p>arcot,TamilNadu</p>
                </div>
                <div className="contact-item">
                  <h4>Social</h4>
                  <div className="social-links">
                    <a href="https://github.com/zoro-sachin" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://www.instagram.com/moon_.only_?igsh=MTg5bXkyMWozcjE5Yg==" target="_blank" rel="noopener noreferrer">Instagram</a>

                  </div>
                </div>
              </div>
            </div>

            <div className="contact-form-container glass">
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="Your Message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                {message && (
                  <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  className="pill-btn primary full-width"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
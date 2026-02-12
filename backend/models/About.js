const mongoose = require('mongoose');

const AboutSchema = new mongoose.Schema({
  headline: { type: String },
  bio: { type: String },
  skills: [String],
  education: [
    {
      institution: String,
      degree: String,
      from: String,
      to: String,
      description: String
    }
  ],
  socialLinks: {
    website: String,
    github: String,
    linkedin: String,
    twitter: String
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('About', AboutSchema);

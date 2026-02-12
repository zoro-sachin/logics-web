const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  shortDescription: { type: String },
  tags: [String],
  liveUrl: { type: String },
  repoUrl: { type: String },
  coverImage: { type: String }, // store URL
  gallery: [String], // optional image URLs
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);

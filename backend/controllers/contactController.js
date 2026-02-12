const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const c = new Contact(req.body);
    await c.save();
    // Optionally: integrate email notification here (SendGrid / nodemailer)
    res.status(201).json({ message: 'Message received' });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.listMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.markSeen = async (req, res) => {
  try {
    const msg = await Contact.findByIdAndUpdate(req.params.id, { seen: true }, { new: true });
    if (!msg) return res.status(404).json({ message: 'Not found' });
    res.json(msg);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

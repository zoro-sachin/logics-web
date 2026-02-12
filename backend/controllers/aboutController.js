const About = require('../models/About');

exports.getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // return empty object if none configured
      return res.json({});
    }
    res.json(about);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

exports.upsertAbout = async (req, res) => {
  try {
    const payload = req.body;
    let about = await About.findOneAndUpdate({}, payload, { upsert: true, new: true });
    res.json(about);
  } catch (err) {
    res.status(500).send('Server error');
  }
};

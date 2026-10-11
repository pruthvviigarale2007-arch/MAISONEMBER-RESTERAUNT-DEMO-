const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/newsletter
router.post('/', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existing = db.prepare('SELECT id FROM newsletter_subscribers WHERE email = ?').get(cleanEmail);

    if (existing) {
      return res.json({
        success: true,
        already_subscribed: true,
        message: 'Merci. You are already subscribed to The Ember Journal.'
      });
    }

    db.prepare('INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)')
      .run(cleanEmail, new Date().toISOString());

    res.status(201).json({
      success: true,
      message: 'Merci. You have been added to The Ember Journal. A welcome dispatch has been prepared for your inbox.'
    });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    res.status(500).json({ success: false, error: 'Failed to process journal subscription.' });
  }
});

// GET /api/newsletter (Admin)
router.get('/', (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch subscribers.' });
  }
});

module.exports = router;

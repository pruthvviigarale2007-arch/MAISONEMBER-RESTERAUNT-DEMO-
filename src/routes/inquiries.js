const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/inquiries
router.post('/', (req, res) => {
  try {
    const { name, email, phone, event_type, preferred_date, guest_count, message } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, error: 'Full name is required.' });
    }
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email is required.' });
    }

    const type = event_type || 'Private Dining Salon';
    const count = parseInt(guest_count, 10) || 8;
    const createdAt = new Date().toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO inquiries (name, email, phone, event_type, preferred_date, guest_count, message, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
    `);

    const result = insertStmt.run(
      name.trim(),
      email.trim(),
      (phone || '').trim(),
      type,
      preferred_date || null,
      count,
      (message || '').trim(),
      createdAt
    );

    const created = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      inquiry: created,
      message: 'Merci. Your salon inquiry has been dispatched to our maître d’hôtel and cellar team. We will contact you within 24 hours.'
    });
  } catch (err) {
    console.error('Inquiry error:', err);
    res.status(500).json({ success: false, error: 'Failed to submit inquiry.' });
  }
});

// GET /api/inquiries (Admin)
router.get('/', (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM inquiries ORDER BY created_at DESC').all();
    res.json({ success: true, count: inquiries.length, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve inquiries.' });
  }
});

// PATCH /api/inquiries/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    db.prepare('UPDATE inquiries SET status = ? WHERE id = ?').run(status, Number(id));
    const updated = db.prepare('SELECT * FROM inquiries WHERE id = ?').get(Number(id));
    res.json({ success: true, inquiry: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update inquiry status.' });
  }
});

module.exports = router;

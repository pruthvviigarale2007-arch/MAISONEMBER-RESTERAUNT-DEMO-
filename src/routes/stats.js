const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/stats
router.get('/', (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Today bookings & covers
    const todayStats = db.prepare(`
      SELECT COUNT(*) as bookings_today, COALESCE(SUM(party_size), 0) as covers_today
      FROM reservations
      WHERE reservation_date = ? AND status != 'cancelled'
    `).get(today);

    // Total upcoming
    const upcomingStats = db.prepare(`
      SELECT COUNT(*) as upcoming_bookings, COALESCE(SUM(party_size), 0) as upcoming_covers
      FROM reservations
      WHERE reservation_date >= ? AND status != 'cancelled'
    `).get(today);

    // Subscribers count
    const subscribers = db.prepare('SELECT COUNT(*) as total_subscribers FROM newsletter_subscribers').get();

    // Inquiries count
    const pendingInquiries = db.prepare("SELECT COUNT(*) as pending FROM inquiries WHERE status = 'pending'").get();

    res.json({
      success: true,
      today,
      bookings_today: todayStats ? todayStats.bookings_today : 0,
      covers_today: todayStats ? todayStats.covers_today : 0,
      upcoming_bookings: upcomingStats ? upcomingStats.upcoming_bookings : 0,
      upcoming_covers: upcomingStats ? upcomingStats.upcoming_covers : 0,
      total_subscribers: subscribers ? subscribers.total_subscribers : 0,
      pending_inquiries: pendingInquiries ? pendingInquiries.pending : 0
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to load stats.' });
  }
});

module.exports = router;

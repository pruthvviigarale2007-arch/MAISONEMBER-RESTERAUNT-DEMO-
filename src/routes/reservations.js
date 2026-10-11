const express = require('express');
const router = express.Router();
const db = require('../db');

const TIME_SLOTS = ['18:30', '19:00', '19:45', '20:30', '21:15', '21:45'];
const AREA_CAPACITY = {
  'Main Dining Room': 4,
  'Hearth Counter': 3,
  'Wine Vault Salon': 2
};

// Generate human-friendly reference e.g. EMB-8492
function generateReference() {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `EMB-${num}`;
}

// GET /api/reservations/availability?date=YYYY-MM-DD&area=...&party=...
router.get('/availability', (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const area = req.query.area || 'Main Dining Room';
    const party = parseInt(req.query.party, 10) || 2;
    const maxCapacity = AREA_CAPACITY[area] || 4;

    const bookedRows = db.prepare(`
      SELECT reservation_time, COUNT(*) as booked
      FROM reservations
      WHERE reservation_date = ? AND seating_area = ? AND status != 'cancelled'
      GROUP BY reservation_time
    `).all(date, area);

    const bookingMap = {};
    for (const r of bookedRows) {
      bookingMap[r.reservation_time] = r.booked;
    }

    const slots = TIME_SLOTS.map(time => {
      const booked = bookingMap[time] || 0;
      const remaining = Math.max(0, maxCapacity - booked);
      let status = 'available';
      let label = 'Available';
      let selectable = true;

      if (remaining === 0) {
        status = 'committed';
        label = 'Committed';
        selectable = false;
      } else if (remaining === 1) {
        status = 'last_table';
        label = 'Last table';
      } else if (remaining === 2) {
        status = 'limited';
        label = 'Last 2 tables';
      }

      return {
        time,
        booked,
        remaining,
        status,
        label,
        selectable
      };
    });

    res.json({
      success: true,
      date,
      seating_area: area,
      party_size: party,
      slots
    });
  } catch (err) {
    console.error('Availability check error:', err);
    res.status(500).json({ success: false, error: 'Could not query slot availability.' });
  }
});

// GET /api/reservations (Staff query)
router.get('/', (req, res) => {
  try {
    const { date, status, search } = req.query;
    let sql = 'SELECT * FROM reservations WHERE 1=1';
    const params = [];

    if (date) {
      sql += ' AND reservation_date = ?';
      params.push(date);
    }
    if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      sql += ' AND (guest_name LIKE ? OR guest_email LIKE ? OR guest_phone LIKE ? OR reference LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY reservation_date DESC, reservation_time ASC';

    const reservations = db.prepare(sql).all(...params);
    res.json({ success: true, count: reservations.length, reservations });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ success: false, error: 'Failed to retrieve reservations.' });
  }
});

// GET /api/reservations/:idOrRef
router.get('/:idOrRef', (req, res) => {
  try {
    const { idOrRef } = req.params;
    let resRow;
    if (isNaN(idOrRef)) {
      resRow = db.prepare('SELECT * FROM reservations WHERE reference = ?').get(idOrRef.toUpperCase());
    } else {
      resRow = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(idOrRef));
    }

    if (!resRow) {
      return res.status(404).json({ success: false, error: 'Reservation not found.' });
    }
    res.json({ success: true, reservation: resRow });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch reservation.' });
  }
});

// POST /api/reservations
router.post('/', (req, res) => {
  try {
    const {
      guest_name,
      guest_email,
      guest_phone,
      guest_notes,
      party_size,
      seating_area,
      reservation_date,
      reservation_time
    } = req.body;

    // Validation
    if (!guest_name || !guest_name.trim()) {
      return res.status(400).json({ success: false, error: 'Guest name is required.' });
    }
    if (!guest_email || !guest_email.includes('@')) {
      return res.status(400).json({ success: false, error: 'A valid email address is required.' });
    }
    if (!guest_phone || !guest_phone.trim()) {
      return res.status(400).json({ success: false, error: 'Telephone number is required.' });
    }
    if (!reservation_date) {
      return res.status(400).json({ success: false, error: 'Reservation date is required.' });
    }
    if (!reservation_time || !TIME_SLOTS.includes(reservation_time)) {
      return res.status(400).json({ success: false, error: 'Please choose a valid service sitting.' });
    }

    const party = parseInt(party_size, 10) || 2;
    const area = seating_area || 'Main Dining Room';
    const maxCapacity = AREA_CAPACITY[area] || 4;

    // Capacity check
    const existing = db.prepare(`
      SELECT COUNT(*) as booked
      FROM reservations
      WHERE reservation_date = ? AND seating_area = ? AND reservation_time = ? AND status != 'cancelled'
    `).get(reservation_date, area, reservation_time);

    if (existing && existing.booked >= maxCapacity) {
      return res.status(409).json({
        success: false,
        error: `The ${reservation_time} sitting in ${area} is fully committed for this evening. Please select another sitting.`
      });
    }

    // Generate reference
    let reference = generateReference();
    let collisionCheck = db.prepare('SELECT id FROM reservations WHERE reference = ?').get(reference);
    while (collisionCheck) {
      reference = generateReference();
      collisionCheck = db.prepare('SELECT id FROM reservations WHERE reference = ?').get(reference);
    }

    const createdAt = new Date().toISOString();
    const insertStmt = db.prepare(`
      INSERT INTO reservations (
        reference, guest_name, guest_email, guest_phone, guest_notes,
        party_size, seating_area, reservation_date, reservation_time, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', ?)
    `);

    const result = insertStmt.run(
      reference,
      guest_name.trim(),
      guest_email.trim(),
      guest_phone.trim(),
      (guest_notes || '').trim(),
      party,
      area,
      reservation_date,
      reservation_time,
      createdAt
    );

    const newBooking = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);

    // Google Calendar Link generator helper
    const [year, month, day] = reservation_date.split('-');
    const [hour, minute] = reservation_time.split(':');
    const startIso = `${year}${month}${day}T${hour}${minute}00`;
    const endHour = (parseInt(hour, 10) + 2).toString().padStart(2, '0');
    const endIso = `${year}${month}${day}T${endHour}${minute}00`;
    const calTitle = encodeURIComponent(`Dinner at Maison Ember (${reference})`);
    const calDetails = encodeURIComponent(`Table for ${party} guests at Maison Ember. Area: ${area}. Notes: ${guest_notes || 'None'}. Reference: ${reference}`);
    const calLocation = encodeURIComponent('14 Rue des Tournelles, 75004 Paris, France');
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${startIso}/${endIso}&details=${calDetails}&location=${calLocation}`;

    res.status(201).json({
      success: true,
      reference,
      reservation: newBooking,
      calendar_link: googleCalUrl,
      message: `Merci, ${guest_name}. Your table for ${party} guests has been confirmed at Maison Ember.`
    });
  } catch (err) {
    console.error('Reservation creation error:', err);
    res.status(500).json({ success: false, error: 'Failed to process table reservation.' });
  }
});

// PATCH /api/reservations/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['confirmed', 'seated', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid reservation status.' });
    }

    const updateStmt = db.prepare('UPDATE reservations SET status = ? WHERE id = ?');
    const result = updateStmt.run(status, Number(id));

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Reservation not found.' });
    }

    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(Number(id));
    res.json({ success: true, reservation: updated });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, error: 'Failed to update reservation status.' });
  }
});

// DELETE /api/reservations/:id
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleteStmt = db.prepare('DELETE FROM reservations WHERE id = ?');
    const result = deleteStmt.run(Number(id));

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Reservation not found.' });
    }

    res.json({ success: true, message: 'Reservation removed successfully.' });
  } catch (err) {
    console.error('Delete reservation error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete reservation.' });
  }
});

module.exports = router;

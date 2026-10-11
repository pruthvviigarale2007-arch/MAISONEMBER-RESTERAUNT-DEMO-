const http = require('http');
const app = require('../src/server');

async function runTests() {
  console.log('🧪 Starting Maison Ember Backend API Integration Tests...\n');
  
  // Start server on random port
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Root API
  await test('GET /api returns restaurant details', async () => {
    const res = await fetch(`${baseUrl}/api`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.restaurant.includes('Maison Ember')) throw new Error('Invalid restaurant name');
  });

  // 2. Menu API
  await test('GET /api/menu returns full seasonal dishes categorized', async () => {
    const res = await fetch(`${baseUrl}/api/menu`);
    const data = await res.json();
    if (!data.success || data.total < 15) throw new Error(`Expected at least 15 items, got ${data.total}`);
    if (!data.grouped.starters.length || !data.grouped.mains.length) throw new Error('Missing starters/mains');
  });

  // 3. Availability API
  await test('GET /api/reservations/availability returns slots with remaining capacity', async () => {
    const today = new Date().toISOString().split('T')[0];
    const res = await fetch(`${baseUrl}/api/reservations/availability?date=${today}&area=Main%20Dining%20Room&party=2`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.slots) || data.slots.length !== 6) {
      throw new Error('Invalid slots response structure');
    }
    const hasSlotStatus = data.slots.every(s => s.status && s.time);
    if (!hasSlotStatus) throw new Error('Slots missing status flags');
  });

  // 4. Create Reservation
  let createdRef = null;
  let createdId = null;
  await test('POST /api/reservations creates a verified booking folio', async () => {
    const payload = {
      guest_name: 'Geneviève Renaud',
      guest_email: 'genevieve@renaud-arts.fr',
      guest_phone: '+33 6 11 22 33 44',
      guest_notes: 'Window banquette if possible, celebrating book publication',
      party_size: 2,
      seating_area: 'Hearth Counter',
      reservation_date: new Date().toISOString().split('T')[0],
      reservation_time: '18:30'
    };

    const res = await fetch(`${baseUrl}/api/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.reference.startsWith('EMB-')) throw new Error('Reference not generated');
    if (!data.calendar_link.includes('calendar.google.com')) throw new Error('Calendar link not generated');
    createdRef = data.reference;
    createdId = data.reservation.id;
  });

  // 5. Update Status
  await test('PATCH /api/reservations/:id/status updates status to seated', async () => {
    const res = await fetch(`${baseUrl}/api/reservations/${createdId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'seated' })
    });
    const data = await res.json();
    if (!data.success || data.reservation.status !== 'seated') {
      throw new Error('Status not updated to seated');
    }
  });

  // 6. Newsletter Subscription
  await test('POST /api/newsletter accepts valid patron email', async () => {
    const res = await fetch(`${baseUrl}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `patron_${Date.now()}@paris.fr` })
    });
    const data = await res.json();
    if (!data.success) throw new Error('Subscription failed');
  });

  // 7. Private Salon Inquiry
  await test('POST /api/inquiries records private salon request', async () => {
    const payload = {
      name: 'Laurent Mercier',
      email: 'laurent@vinicole.fr',
      phone: '+33 6 99 88 77 66',
      event_type: 'Wine Vault Private Salon (8-14 guests)',
      preferred_date: '2026-12-14',
      guest_count: 12,
      message: 'Private winemaker tasting with sommelier Camille Roy'
    };

    const res = await fetch(`${baseUrl}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.status !== 201) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.success || !data.inquiry.id) throw new Error('Inquiry not saved');
  });

  // 8. Stats API
  await test('GET /api/stats reports covers and bookings', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    const data = await res.json();
    if (!data.success || typeof data.upcoming_bookings !== 'number') {
      throw new Error('Stats payload invalid');
    }
  });

  server.close();

  console.log('\n=======================================');
  console.log(`🎉 Results: ${passed} Passed, ${failed} Failed`);
  console.log('=======================================\n');

  if (failed > 0) process.exit(1);
  process.exit(0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

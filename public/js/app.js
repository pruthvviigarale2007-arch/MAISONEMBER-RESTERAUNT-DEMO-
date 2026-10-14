// Maison Ember — Frontend to Backend Connector (with Static / GitHub Pages Demo Mode)
(function installMaisonEmberDemoApi() {
  if (window.__maisonEmberDemoApiInstalled) return;
  window.__maisonEmberDemoApiInstalled = true;

  const STORAGE_KEY = 'maison_ember_demo_store_v1';
  const TIME_SLOTS = ['18:30', '19:00', '19:45', '20:30', '21:15', '21:45'];
  const AREA_CAPACITY = { 'Main Dining Room': 4, 'Hearth Counter': 3, 'Wine Vault Salon': 2 };

  function getStore() {
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.menu_items) && parsed.menu_items.length > 0) {
          return parsed;
        }
      }
    } catch (e) {}

    const initialMenu = [
      ['starters', 'Saint-Vaast Oyster over Embers', 'Huîtres aux braises', 'Briefly kissed by beech fire, smoked marrow butter, verjus mignonette, pickled sea fennel.', 22, '€22', 'GF', 1],
      ['starters', 'Brittany Scallop Crudo', 'Crudo de Saint-Jacques', 'Hand-dived, pressed walnut oil, charred blood orange vinegar, winter purslane.', 26, '€26', 'GF', 2],
      ['starters', 'Charred Leeks & Smoked Ricotta', 'Poireaux brûlés & ricotta fumée', 'Roasted whole in oak ash, house-made sheep ricotta, toasted hazelnuts, elderflower capers.', 18, '€18', 'V', 3],
      ['starters', 'Duck Rillettes & Hearth Brioche', 'Rillettes de canard confit', 'Maison-cured duck rillettes, spiced wild fig relish, pickled shallots, wood-fired toasted brioche.', 20, '€20', '', 4],
      ['starters', 'Charred Morel Mushrooms & Sabayon', 'Morilles au feu de bois', 'Wild spring morels sautéed over open iron, vin jaune sabayon, grilled brioche crisps.', 24, '€24', 'V', 5],
      ['mains', 'Line-Caught Turbot on the Bone', 'Turbot de ligne au feu de bois', 'Slow-grilled over embers, brown butter fumet, glazed young leeks, wild sorrel oil.', 46, '€46', 'GF', 1],
      ['mains', 'Aveyron Lamb Saddle & Merguez', 'Selle d’agneau de l’Aveyron', 'Spit-roasted with rosemary twigs, ember-braised celtuce, smoked pepper jus.', 42, '€42', '', 2],
      ['mains', 'Dry-Aged Normande Ribeye (For Two)', 'Côte de bœuf maturée (Pour deux)', '55 days dry-aged, seared over wild cherry wood, roasted garlic marrow butter, shallot confit.', 115, '€115', '800g', 3],
      ['mains', 'Ash-Baked Delicata Squash', 'Courge Delicata cuite sous la cendre', 'Chestnut emulsion, toasted pumpkin seeds, crisp sage, vin jaune reductions.', 31, '€31', 'V / GF', 4],
      ['mains', 'Wood-Roasted Challans Duck Breast', 'Magret de canard de Challans', 'Smoked honey glaze, roasted late cherries, parsnip purée, crushed juniper jus.', 44, '€44', 'GF', 5],
      ['sides', 'Smoked Ratte Potato Purée', 'Purée de pommes Ratte fumées', 'Cultured butter, sea salt flakes, churned hazelnut oil.', 10, '€10', 'V / GF', 1],
      ['sides', 'Ember-Charred Bitter Greens', 'Verdurettes braisées aux cendres', 'Seasonal chicory and brassicas kissed by coal, aged cider vinegar reduction.', 9, '€9', 'V / GF', 2],
      ['sides', 'Natural Levain Bread & Smoked Butter', 'Pain au levain & beurre fumé', '36-hour fermented country boule, butter churned and smoked over hazelnut twigs.', 6, '€6', 'V', 3],
      ['sides', 'Ash-Roasted Heritage Carrots', 'Carottes anciennes confites', 'Charred over Picardy birch, wildflower honey, cracked coriander seeds.', 11, '€11', 'V / GF', 4],
      ['desserts', 'Fire-Roasted Quince & Bay Leaf Ice Cream', 'Coing rôti au feu & glace laurier', 'Slowly caramelized under embers, bay leaf infused crème glacée, buckwheat sablé.', 14, '€14', 'V', 1],
      ['desserts', 'Smoked Dark Chocolate Mousse (72% Guanaja)', 'Mousse au chocolat fumé', 'Valrhona Guanaja chocolate, cold-smoked Maldon sea salt, raw olive oil drizzle.', 15, '€15', 'V', 2],
      ['desserts', 'Raw Milk Comté (36 mo) Affinage', 'Comté affiné 36 mois', 'From Marcel Petite cellars, sourdough charcoal crackers, seasonal fig paste.', 16, '€16', 'V', 3],
      ['desserts', 'Wood-Baked Apple Tart & Crème Crue', 'Tarte fine tiède au feu de bois', 'Thin caramelized crust baked in hearth ashes, Normandy unpasteurized raw cream.', 14, '€14', 'V', 4],
      ['cellar', 'Domaine Courbet — Savagnin Maceration (Jura 2021)', 'Orange / Maceration', '3 weeks skin-contact, vibrant dried apricot, walnut smoke, deep living minerality.', 78, '€78 / €16 gls', 'Natural', 1],
      ['cellar', 'Domaine de l’Écu — ‘Orthogneiss’ Muscadet (Loire 2022)', 'Blanc Nature', 'Biodynamic, sur lie aging in subterranean vats, crushed oyster shell, citrus flint.', 58, '€58 / €12 gls', 'Bio', 2],
      ['cellar', 'Domaine Gramenon — ‘La Sagesse’ Côtes du Rhône (2022)', 'Rouge Nature', '60-year-old bush vine Grenache, natural amphora aging, wild garrigue, dark mulberry.', 72, '€72 / €15 gls', 'Biodynamic', 3],
      ['cellar', 'Alice et Olivier de Moor — Chablis ‘Coteau de Rosette’ (2021)', 'Blanc Terroir', 'Unfiltered natural Chardonnay, crystalline limestone tension, wild orchard blossom.', 98, '€98 / €20 gls', 'Rare', 4],
      ['cellar', 'Maison Ember Reserve Wild Ferment Cider (Normandy)', 'Cidre Vivant', 'Ancient heritage orchard apples, natural zero-sulfur bubbles, dry brioche and wood notes.', 32, '€32 / €8 gls', 'Artisanal', 5]
    ].map((m, idx) => ({
      id: idx + 1, category: m[0], title: m[1], french_subtitle: m[2], description: m[3],
      price: m[4], price_display: m[5], badge: m[6], is_available: 1, sort_order: m[7]
    }));

    const nowIso = new Date().toISOString();
    const initialReservations = [
      { id: 1, reference: 'EMB-8491', guest_name: 'Éléonore de la Tour', guest_email: 'eleonore.latour@paris.com', guest_phone: '+33 6 54 89 21 00', guest_notes: 'Anniversary celebration · 1 pescatarian guest', party_size: 2, seating_area: 'Main Dining Room', reservation_date: todayStr, reservation_time: '19:45', status: 'confirmed', created_at: nowIso },
      { id: 2, reference: 'EMB-8492', guest_name: 'Henri Rousseau', guest_email: 'h.rousseau@marais.fr', guest_phone: '+33 6 12 34 56 78', guest_notes: 'Quiet table preferred', party_size: 4, seating_area: 'Main Dining Room', reservation_date: todayStr, reservation_time: '19:45', status: 'confirmed', created_at: nowIso },
      { id: 3, reference: 'EMB-8493', guest_name: 'Camille Delacroix', guest_email: 'camille.d@atelier.fr', guest_phone: '+33 6 98 76 54 32', guest_notes: 'Wine pairing voyage requested', party_size: 2, seating_area: 'Hearth Counter', reservation_date: todayStr, reservation_time: '20:30', status: 'confirmed', created_at: nowIso },
      { id: 4, reference: 'EMB-8494', guest_name: 'Julien Moreau', guest_email: 'j.moreau@presse.com', guest_phone: '+33 6 45 67 89 01', guest_notes: 'Chef Alexandre tasting menu', party_size: 6, seating_area: 'Wine Vault Salon', reservation_date: todayStr, reservation_time: '20:30', status: 'confirmed', created_at: nowIso },
      { id: 5, reference: 'EMB-8495', guest_name: 'Gaston Mercier', guest_email: 'gaston@vins-nature.org', guest_phone: '+33 6 33 22 11 00', guest_notes: 'Sommelier table booking', party_size: 2, seating_area: 'Hearth Counter', reservation_date: todayStr, reservation_time: '21:45', status: 'confirmed', created_at: nowIso },
      { id: 6, reference: 'EMB-8496', guest_name: 'Sophie Laurent', guest_email: 'sophie.laurent@sorbonne.fr', guest_phone: '+33 6 88 99 00 11', guest_notes: 'Birthday dinner', party_size: 4, seating_area: 'Hearth Counter', reservation_date: todayStr, reservation_time: '21:45', status: 'confirmed', created_at: nowIso },
      { id: 7, reference: 'EMB-8497', guest_name: 'Pierre Bertin', guest_email: 'p.bertin@design.fr', guest_phone: '+33 6 77 88 99 00', guest_notes: 'Gluten-free for 1 guest', party_size: 2, seating_area: 'Hearth Counter', reservation_date: todayStr, reservation_time: '21:45', status: 'confirmed', created_at: nowIso }
    ];

    const store = {
      menu_items: initialMenu,
      reservations: initialReservations,
      newsletter_subscribers: [
        { id: 1, email: 'sommelier.notes@maisonember.com', subscribed_at: nowIso },
        { id: 2, email: 'gastronome@paris-eats.com', subscribed_at: nowIso }
      ],
      inquiries: [
        { id: 1, name: 'Antoine de Saint-Germain', email: 'antoine@lux-foundation.fr', phone: '+33 1 44 55 66 77', event_type: 'Private Dining Salon', preferred_date: '2026-11-28', guest_count: 12, message: 'Private 6-course tasting menu with biodynamic wine pairings for our board dinner.', status: 'pending', created_at: nowIso }
      ]
    };
    saveStore(store);
    return store;
  }

  function saveStore(store) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(store)); } catch (e) {}
  }

  function jsonResponse(obj, status = 200) {
    return new Response(JSON.stringify(obj), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function handleDemoApi(urlStr, options = {}) {
    const store = getStore();
    const method = (options.method || 'GET').toUpperCase();
    const u = new URL(urlStr, window.location.origin);
    const path = u.pathname.replace(/^.*\/api/, '/api');
    let body = {};
    if (options.body) {
      try { body = JSON.parse(options.body); } catch (e) {}
    }

    if (path === '/api/menu' && method === 'GET') {
      const items = store.menu_items;
      const grouped = {
        starters: items.filter(i => i.category === 'starters'),
        mains: items.filter(i => i.category === 'mains'),
        sides: items.filter(i => i.category === 'sides'),
        desserts: items.filter(i => i.category === 'desserts'),
        cellar: items.filter(i => i.category === 'cellar')
      };
      return jsonResponse({ success: true, total: items.length, items, grouped });
    }

    const menuMatch = path.match(/^\/api\/menu\/(\d+)$/);
    if (menuMatch) {
      const id = Number(menuMatch[1]);
      if (method === 'PATCH') {
        const item = store.menu_items.find(i => i.id === id);
        if (item && body.is_available !== undefined) item.is_available = body.is_available ? 1 : 0;
        saveStore(store);
        return jsonResponse({ success: true });
      }
      if (method === 'DELETE') {
        store.menu_items = store.menu_items.filter(i => i.id !== id);
        saveStore(store);
        return jsonResponse({ success: true });
      }
    }

    if (path === '/api/reservations/availability' && method === 'GET') {
      const date = u.searchParams.get('date') || new Date().toISOString().split('T')[0];
      const area = u.searchParams.get('area') || 'Main Dining Room';
      const party = parseInt(u.searchParams.get('party') || '2', 10);
      const maxCap = AREA_CAPACITY[area] || 4;
      const slots = TIME_SLOTS.map(time => {
        const booked = store.reservations.filter(r => r.reservation_date === date && r.seating_area === area && r.reservation_time === time && r.status !== 'cancelled').length;
        const remaining = Math.max(0, maxCap - booked);
        let status = 'available', label = 'Available', selectable = true;
        if (remaining === 0) { status = 'committed'; label = 'Committed'; selectable = false; }
        else if (remaining === 1) { status = 'last_table'; label = 'Last table'; }
        else if (remaining === 2) { status = 'limited'; label = 'Last 2 tables'; }
        return { time, booked, remaining, status, label, selectable };
      });
      return jsonResponse({ success: true, date, seating_area: area, party_size: party, slots });
    }

    if (path === '/api/reservations' && method === 'GET') {
      const date = u.searchParams.get('date');
      const status = u.searchParams.get('status');
      const search = (u.searchParams.get('search') || '').toLowerCase();
      let list = [...store.reservations];
      if (date) list = list.filter(r => r.reservation_date === date);
      if (status && status !== 'all') list = list.filter(r => r.status === status);
      if (search) {
        list = list.filter(r =>
          (r.guest_name || '').toLowerCase().includes(search) ||
          (r.guest_email || '').toLowerCase().includes(search) ||
          (r.guest_phone || '').toLowerCase().includes(search) ||
          (r.reference || '').toLowerCase().includes(search)
        );
      }
      return jsonResponse({ success: true, count: list.length, reservations: list });
    }

    if (path === '/api/reservations' && method === 'POST') {
      const ref = 'EMB-' + Math.floor(1000 + Math.random() * 9000);
      const id = (store.reservations.reduce((m, r) => Math.max(m, r.id || 0), 0)) + 1;
      const newRes = {
        id,
        reference: ref,
        guest_name: body.guest_name,
        guest_email: body.guest_email,
        guest_phone: body.guest_phone,
        guest_notes: body.guest_notes || '',
        party_size: Number(body.party_size) || 2,
        seating_area: body.seating_area || 'Main Dining Room',
        reservation_date: body.reservation_date,
        reservation_time: body.reservation_time,
        status: 'confirmed',
        created_at: new Date().toISOString()
      };
      store.reservations.unshift(newRes);
      saveStore(store);

      const [y, m, d] = (newRes.reservation_date || '2026-10-15').split('-');
      const [hh, mm] = (newRes.reservation_time || '19:45').split(':');
      const start = `${y}${m}${d}T${hh}${mm}00`;
      const endH = (parseInt(hh, 10) + 2).toString().padStart(2, '0');
      const end = `${y}${m}${d}T${endH}${mm}00`;
      const calLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(`Dinner at Maison Ember (${ref})`)}&dates=${start}/${end}&details=${encodeURIComponent(`Table for ${newRes.party_size} (${newRes.seating_area}) - Ref: ${ref}`)}&location=${encodeURIComponent('14 Rue des Tournelles, 75004 Paris')}`;

      return jsonResponse({ success: true, reference: ref, reservation: newRes, calendar_link: calLink }, 201);
    }

    const resStatusMatch = path.match(/^\/api\/reservations\/(\d+)\/status$/);
    if (resStatusMatch && method === 'PATCH') {
      const id = Number(resStatusMatch[1]);
      const r = store.reservations.find(x => x.id === id);
      if (r && body.status) r.status = body.status;
      saveStore(store);
      return jsonResponse({ success: true });
    }

    const resDelMatch = path.match(/^\/api\/reservations\/(\d+)$/);
    if (resDelMatch && method === 'DELETE') {
      const id = Number(resDelMatch[1]);
      store.reservations = store.reservations.filter(x => x.id !== id);
      saveStore(store);
      return jsonResponse({ success: true });
    }

    if (path === '/api/newsletter') {
      if (method === 'GET') return jsonResponse({ success: true, subscribers: store.newsletter_subscribers });
      if (method === 'POST') {
        const email = (body.email || '').trim();
        if (!store.newsletter_subscribers.some(s => s.email === email)) {
          store.newsletter_subscribers.unshift({ id: Date.now(), email, subscribed_at: new Date().toISOString() });
          saveStore(store);
        }
        return jsonResponse({ success: true, message: 'Bienvenue. You are now subscribed to The Ember Journal.' });
      }
    }

    if (path === '/api/inquiries') {
      if (method === 'GET') return jsonResponse({ success: true, inquiries: store.inquiries });
      if (method === 'POST') {
        store.inquiries.unshift({
          id: Date.now(),
          name: body.name,
          email: body.email,
          phone: body.phone || '',
          event_type: body.event_type || 'Private Dining Salon',
          preferred_date: body.preferred_date || '',
          guest_count: Number(body.guest_count) || 8,
          message: body.message || '',
          status: 'pending',
          created_at: new Date().toISOString()
        });
        saveStore(store);
        return jsonResponse({ success: true, message: 'Thank you. Our Sommelier & Events Director will contact you within 24 hours.' });
      }
    }

    const inqMatch = path.match(/^\/api\/inquiries\/(\d+)\/status$/);
    if (inqMatch && method === 'PATCH') {
      const id = Number(inqMatch[1]);
      const inq = store.inquiries.find(x => x.id === id);
      if (inq && body.status) inq.status = body.status;
      saveStore(store);
      return jsonResponse({ success: true });
    }

    if (path === '/api/stats' && method === 'GET') {
      const todayStr = new Date().toISOString().split('T')[0];
      const active = store.reservations.filter(r => r.status !== 'cancelled');
      const todayList = active.filter(r => r.reservation_date === todayStr);
      return jsonResponse({
        success: true,
        bookings_today: todayList.length,
        covers_today: todayList.reduce((s, r) => s + Number(r.party_size || 0), 0),
        upcoming_bookings: active.length,
        upcoming_covers: active.reduce((s, r) => s + Number(r.party_size || 0), 0),
        total_subscribers: store.newsletter_subscribers.length,
        pending_inquiries: store.inquiries.filter(i => i.status === 'pending').length
      });
    }

    return jsonResponse({ success: true });
  }

  const origFetch = window.fetch.bind(window);
  window.fetch = async function(input, init) {
    const urlStr = typeof input === 'string' ? input : (input && input.url ? input.url : '');
    if (urlStr.includes('/api/')) {
      const isStaticHost = window.location.hostname.endsWith('github.io') || window.location.protocol === 'file:';
      if (isStaticHost) {
        return handleDemoApi(urlStr, init);
      }
      try {
        const res = await origFetch(input, init);
        const ct = res.headers.get('content-type') || '';
        if (res.ok && ct.includes('application/json')) {
          return res;
        }
        return handleDemoApi(urlStr, init);
      } catch (err) {
        return handleDemoApi(urlStr, init);
      }
    }
    return origFetch(input, init);
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  // Booking State
  const bookingState = {
    partySize: 2,
    seatingArea: 'Main Dining Room',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedTime: '19:45',
    activeCategory: 'starters'
  };

  // DOM Elements
  const summaryParty = document.getElementById('summary-party');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  const summaryArea = document.getElementById('summary-area');
  const dateInput = document.getElementById('reservation-date');
  const timeSlotGrid = document.getElementById('time-slot-grid');
  const confirmBtn = document.getElementById('confirm-reservation-btn');
  const partyBtns = document.querySelectorAll('.party-btn');
  const areaCards = document.querySelectorAll('.area-card');

  // Initialize Date Input
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = bookingState.selectedDate;
    updateSummaryDate(bookingState.selectedDate);

    dateInput.addEventListener('change', (e) => {
      bookingState.selectedDate = e.target.value;
      updateSummaryDate(bookingState.selectedDate);
      loadAvailability();
    });
  }

  function updateSummaryDate(dateStr) {
    if (!summaryDate || !dateStr) return;
    const dateObj = new Date(dateStr);
    if (!isNaN(dateObj)) {
      summaryDate.textContent = dateObj.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  // 1. Party Size Selector
  partyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      partyBtns.forEach(b => {
        b.classList.remove('bg-primary-container', 'text-on-primary', 'border-primary-container');
        b.classList.add('border-outline-variant');
      });
      btn.classList.remove('border-outline-variant');
      btn.classList.add('bg-primary-container', 'text-on-primary', 'border-primary-container');

      const size = parseInt(btn.getAttribute('data-party'), 10) || 2;
      bookingState.partySize = size;
      if (summaryParty) {
        summaryParty.textContent = `${size} Guest${size > 1 ? 's' : ''}`;
      }
      loadAvailability();
    });
  });

  // 2. Seating Area Cards
  areaCards.forEach(card => {
    card.addEventListener('click', () => {
      areaCards.forEach(c => {
        c.classList.remove('border-2', 'border-primary-container', 'bg-surface-container');
        c.classList.add('border', 'border-outline-variant');
        const icon = c.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.classList.remove('text-primary');
          icon.classList.add('text-on-surface-variant');
          icon.textContent = c.getAttribute('data-area') === 'Hearth Counter' ? 'restaurant' : 'wine_bar';
        }
      });

      card.classList.remove('border', 'border-outline-variant');
      card.classList.add('border-2', 'border-primary-container', 'bg-surface-container');
      const activeIcon = card.querySelector('.material-symbols-outlined');
      if (activeIcon) {
        activeIcon.classList.remove('text-on-surface-variant');
        activeIcon.classList.add('text-primary');
        activeIcon.textContent = 'check_circle';
      }

      bookingState.seatingArea = card.getAttribute('data-area');
      if (summaryArea) {
        summaryArea.textContent = bookingState.seatingArea;
      }
      loadAvailability();
    });
  });

  // 3. Real-Time Slot Availability Loader
  async function loadAvailability() {
    if (!timeSlotGrid) return;

    try {
      timeSlotGrid.innerHTML = `
        <div class="col-span-full py-4 text-center text-on-surface-variant font-label-caption">
          Checking hearth availability for ${bookingState.selectedDate}...
        </div>
      `;

      const res = await fetch(`/api/reservations/availability?date=${encodeURIComponent(bookingState.selectedDate)}&area=${encodeURIComponent(bookingState.seatingArea)}&party=${bookingState.partySize}`);
      const data = await res.json();

      if (!data.success || !data.slots) {
        timeSlotGrid.innerHTML = `<div class="col-span-full py-4 text-error font-body-sm">Unable to load availability.</div>`;
        return;
      }

      timeSlotGrid.innerHTML = '';
      let hasSelectedMatch = false;

      data.slots.forEach(slot => {
        const isSelected = slot.time === bookingState.selectedTime && slot.selectable;
        if (isSelected) hasSelectedMatch = true;

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-time', slot.time);

        if (!slot.selectable) {
          // Committed / Sold out
          btn.className = 'border border-outline-variant bg-surface-container-high opacity-50 p-3 text-left rounded cursor-not-allowed';
          btn.disabled = true;
          btn.innerHTML = `
            <span class="block font-price-numeral text-price-numeral font-semibold text-on-surface-variant line-through">${slot.time}</span>
            <span class="block font-label-caption text-label-caption text-error mt-0.5">Committed</span>
          `;
        } else if (isSelected) {
          // Selected
          btn.className = 'time-slot-btn border-2 border-primary-container bg-surface-container p-3 text-left rounded transition-colors';
          btn.innerHTML = `
            <div class="flex items-center justify-between">
              <span class="block font-price-numeral text-price-numeral font-semibold text-primary">${slot.time}</span>
              <span class="text-xs text-primary font-medium">Selected</span>
            </div>
            <span class="block font-label-caption text-label-caption ${slot.status === 'limited' ? 'text-primary-container' : 'text-secondary'} mt-0.5">${slot.label}</span>
          `;
        } else {
          // Available slot
          btn.className = 'time-slot-btn border border-outline-variant p-3 text-left rounded hover:border-primary transition-colors';
          btn.innerHTML = `
            <span class="block font-price-numeral text-price-numeral font-semibold text-on-surface">${slot.time}</span>
            <span class="block font-label-caption text-label-caption ${slot.status === 'last_table' ? 'text-primary' : 'text-secondary'} mt-0.5">${slot.label}</span>
          `;
        }

        if (slot.selectable) {
          btn.addEventListener('click', () => {
            bookingState.selectedTime = slot.time;
            if (summaryTime) {
              summaryTime.textContent = `${slot.time} Sitting`;
            }
            loadAvailability(); // Re-render selected style
          });
        }

        timeSlotGrid.appendChild(btn);
      });

      // If previous selection was disabled on this date, pick first available
      if (!hasSelectedMatch) {
        const firstAvailable = data.slots.find(s => s.selectable);
        if (firstAvailable) {
          bookingState.selectedTime = firstAvailable.time;
          if (summaryTime) {
            summaryTime.textContent = `${firstAvailable.time} Sitting`;
          }
          // Highlight first available
          loadAvailability();
        }
      }
    } catch (err) {
      console.error('Error fetching availability:', err);
    }
  }

  // Initial availability check
  loadAvailability();

  // 4. Reservation Submission
  if (confirmBtn) {
    confirmBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const guestName = (document.getElementById('guest-name')?.value || '').trim();
      const guestEmail = (document.getElementById('guest-email')?.value || '').trim();
      const guestPhone = (document.getElementById('guest-phone')?.value || '').trim();
      const guestNotes = (document.getElementById('guest-notes')?.value || '').trim();

      if (!guestName) {
        showToast('Please provide your full name.', 'error');
        document.getElementById('guest-name')?.focus();
        return;
      }
      if (!guestEmail || !guestEmail.includes('@')) {
        showToast('Please provide a valid email address.', 'error');
        document.getElementById('guest-email')?.focus();
        return;
      }
      if (!guestPhone) {
        showToast('Please provide a telephone number for booking verification.', 'error');
        document.getElementById('guest-phone')?.focus();
        return;
      }

      confirmBtn.disabled = true;
      confirmBtn.innerHTML = `
        <span class="material-symbols-outlined animate-spin" data-icon="sync">sync</span>
        <span>Securing Hearth Table...</span>
      `;

      try {
        const payload = {
          guest_name: guestName,
          guest_email: guestEmail,
          guest_phone: guestPhone,
          guest_notes: guestNotes,
          party_size: bookingState.partySize,
          seating_area: bookingState.seatingArea,
          reservation_date: bookingState.selectedDate,
          reservation_time: bookingState.selectedTime
        };

        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          showToast(data.error || 'Failed to complete reservation.', 'error');
          return;
        }

        // Show Confirmation Receipt Modal
        showReceiptModal(data);
        // Refresh availability
        loadAvailability();
      } catch (err) {
        console.error('Reservation error:', err);
        showToast('Network error while completing reservation. Please try again.', 'error');
      } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = `
          <span>Complete Table Reservation</span>
          <span class="material-symbols-outlined" data-icon="done">done</span>
        `;
      }
    });
  }

  // 5. Confirmation Receipt Modal
  function showReceiptModal(data) {
    const booking = data.reservation;
    const modal = document.getElementById('reservation-receipt-modal');
    if (!modal) return;

    document.getElementById('receipt-ref').textContent = data.reference;
    document.getElementById('receipt-name').textContent = booking.guest_name;
    document.getElementById('receipt-datetime').textContent = `${booking.reservation_date} at ${booking.reservation_time}`;
    document.getElementById('receipt-party').textContent = `${booking.party_size} Guest${booking.party_size > 1 ? 's' : ''}`;
    document.getElementById('receipt-area').textContent = booking.seating_area;
    document.getElementById('receipt-notes').textContent = booking.guest_notes || 'None specified';

    // Google Calendar button
    const calBtn = document.getElementById('receipt-cal-btn');
    if (calBtn && data.calendar_link) {
      calBtn.href = data.calendar_link;
    }

    // Download iCal (.ics) button
    const icsBtn = document.getElementById('receipt-ics-btn');
    if (icsBtn) {
      icsBtn.onclick = () => downloadIcs(booking, data.reference);
    }

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Download iCal (.ics) file
  function downloadIcs(booking, ref) {
    const [y, m, d] = booking.reservation_date.split('-');
    const [hh, mm] = booking.reservation_time.split(':');
    const start = `${y}${m}${d}T${hh}${mm}00`;
    const endH = (parseInt(hh, 10) + 2).toString().padStart(2, '0');
    const end = `${y}${m}${d}T${endH}${mm}00`;

    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Maison Ember//Paris//FR',
      'BEGIN:VEVENT',
      `UID:${ref}@maisonember.com`,
      `DTSTAMP:${start}Z`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:Dinner at Maison Ember (${ref})`,
      `DESCRIPTION:Table for ${booking.party_size} at Maison Ember. Area: ${booking.seating_area}. Ref: ${ref}`,
      'LOCATION:14 Rue des Tournelles\\, 75004 Paris\\, France',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `Maison_Ember_Reservation_${ref}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Close modal button
  const closeReceiptBtn = document.getElementById('close-receipt-btn');
  if (closeReceiptBtn) {
    closeReceiptBtn.addEventListener('click', () => {
      document.getElementById('reservation-receipt-modal')?.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  // 6. Dynamic Menu Tabs & Renderer
  const menuTabBtns = document.querySelectorAll('.menu-category-btn');
  const menuContainer = document.getElementById('dynamic-menu-container');

  let fullMenuCache = null;

  async function fetchMenu() {
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success) {
        fullMenuCache = data.grouped;
        renderMenuCategory(bookingState.activeCategory);
      }
    } catch (err) {
      console.error('Failed to load menu:', err);
    }
  }

  function renderMenuCategory(catKey) {
    if (!menuContainer || !fullMenuCache) return;
    const items = fullMenuCache[catKey] || [];

    const categoryTitles = {
      starters: { title: 'Starters & Raw Bar', sub: 'Entrées & Crudo' },
      mains: { title: 'Plats au Feu de Bois', sub: 'The Open Fire Mains' },
      sides: { title: 'Sides from the Ash', sub: 'Accompagnements du Fournil' },
      desserts: { title: 'Cheeses & Desserts', sub: 'Douceurs & Affinages' },
      cellar: { title: 'Selected Cellar Vins Vivants', sub: 'Natural & Biodynamic Holdings' }
    };

    const header = categoryTitles[catKey] || { title: 'Carte', sub: '' };

    let html = `
      <div class="animate-fade-in">
        <div class="flex items-baseline justify-between border-b border-outline pb-2 mb-6">
          <h3 class="font-headline-sm text-headline-sm text-on-surface tracking-wide">${header.title}</h3>
          <span class="font-label-caption text-label-caption text-on-surface-variant">${header.sub}</span>
        </div>
        <div class="space-y-6">
    `;

    if (items.length === 0) {
      html += `<p class="text-on-surface-variant font-body-sm">No items currently available in this category.</p>`;
    } else {
      items.forEach(dish => {
        const badgeHtml = dish.badge ? `<span class="font-label-caption text-label-caption text-secondary border border-outline-variant px-1.5 py-0.5 rounded">${dish.badge}</span>` : '';
        const unavailableTag = !dish.is_available ? `<span class="text-xs text-error font-medium ml-2">[Ember depleted today]</span>` : '';

        html += `
          <div class="flex flex-col sm:flex-row sm:items-baseline justify-between ${!dish.is_available ? 'opacity-50' : ''}">
            <div class="max-w-lg">
              <div class="flex items-center space-x-2">
                <h4 class="font-title-menu-item text-title-menu-item text-on-surface">${dish.title}</h4>
                ${badgeHtml}
                ${unavailableTag}
              </div>
              <p class="font-body-sm text-body-sm text-on-surface-variant mt-1">${dish.description}</p>
            </div>
            <div class="hidden sm:block dotted-leader"></div>
            <div class="font-price-numeral text-price-numeral text-on-surface pt-1 sm:pt-0">${dish.price_display || '€' + dish.price}</div>
          </div>
        `;
      });
    }

    html += `</div></div>`;
    menuContainer.innerHTML = html;
  }

  menuTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      menuTabBtns.forEach(b => {
        b.className = 'menu-category-btn px-4 py-2 font-label-uppercase text-label-uppercase border border-outline-variant bg-transparent text-on-surface-variant hover:text-on-surface rounded-lg transition-colors';
      });
      btn.className = 'menu-category-btn px-4 py-2 font-label-uppercase text-label-uppercase border border-primary-container bg-surface-container text-primary rounded-lg transition-colors';

      const cat = btn.getAttribute('data-category') || 'starters';
      bookingState.activeCategory = cat;
      renderMenuCategory(cat);
    });
  });

  fetchMenu();

  // 7. Newsletter Subscription Connector
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterInput = document.getElementById('newsletter-email');
  const newsletterFeedback = document.getElementById('newsletter-feedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = newsletterInput ? newsletterInput.value.trim() : '';
      if (!email) return;

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();

        if (data.success) {
          if (newsletterFeedback) {
            newsletterFeedback.textContent = data.message;
            newsletterFeedback.className = 'font-label-caption text-secondary mt-2 block';
          }
          if (newsletterInput) newsletterInput.value = '';
          showToast(data.message, 'success');
        } else {
          showToast(data.error || 'Subscription failed.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      }
    });
  }

  // 8. Private Dining Salon Inquiry Modal & Form
  const inquiryModal = document.getElementById('inquiry-modal');
  const openInquiryBtns = document.querySelectorAll('.open-inquiry-modal');
  const closeInquiryBtn = document.getElementById('close-inquiry-btn');
  const inquiryForm = document.getElementById('inquiry-form');

  openInquiryBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (inquiryModal) {
        inquiryModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (closeInquiryBtn && inquiryModal) {
    closeInquiryBtn.addEventListener('click', () => {
      inquiryModal.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById('inquiry-name')?.value,
        email: document.getElementById('inquiry-email')?.value,
        phone: document.getElementById('inquiry-phone')?.value,
        event_type: document.getElementById('inquiry-type')?.value,
        guest_count: document.getElementById('inquiry-guests')?.value,
        preferred_date: document.getElementById('inquiry-date')?.value,
        message: document.getElementById('inquiry-message')?.value
      };

      try {
        const res = await fetch('/api/inquiries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          showToast(data.message, 'success');
          inquiryForm.reset();
          inquiryModal?.classList.add('hidden');
          document.body.style.overflow = '';
        } else {
          showToast(data.error || 'Failed to submit inquiry.', 'error');
        }
      } catch (err) {
        showToast('Network error while submitting inquiry.', 'error');
      }
    });
  }

  // 9. Video Sound Toggle Controller
  const hearthVideo = document.getElementById('hero-hearth-video');
  const soundBtn = document.getElementById('toggle-video-sound');
  const soundIcon = document.getElementById('sound-icon');
  const soundText = document.getElementById('sound-text');

  if (hearthVideo && soundBtn) {
    soundBtn.addEventListener('click', () => {
      if (hearthVideo.muted) {
        hearthVideo.muted = false;
        if (soundIcon) soundIcon.textContent = 'volume_up';
        if (soundText) soundText.textContent = 'Mute';
      } else {
        hearthVideo.muted = true;
        if (soundIcon) soundIcon.textContent = 'volume_off';
        if (soundText) soundText.textContent = 'Sound On';
      }
    });
  }

  // Helper: Toast Notifications
  function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast-notice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notice ${type === 'error' ? 'toast-error' : 'toast-success'} animate-fade-in`;
    toast.innerHTML = `
      <span class="material-symbols-outlined">${type === 'error' ? 'warning' : 'check_circle'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
});

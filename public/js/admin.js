// Maison Ember — Staff Atelier & Table Desk Controller (with Static / GitHub Pages Demo Mode)
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
      return jsonResponse({ success: true, reference: ref, reservation: newRes }, 201);
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

    if (path === '/api/newsletter' && method === 'GET') {
      return jsonResponse({ success: true, subscribers: store.newsletter_subscribers });
    }

    if (path === '/api/inquiries' && method === 'GET') {
      return jsonResponse({ success: true, inquiries: store.inquiries });
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
  // Tabs Navigation
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabs = {
    reservations: document.getElementById('tab-reservations'),
    menu: document.getElementById('tab-menu'),
    inquiries: document.getElementById('tab-inquiries'),
    newsletter: document.getElementById('tab-newsletter')
  };

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => {
        b.classList.remove('border-primary', 'text-primary');
        b.classList.add('border-transparent', 'text-on-surface-variant');
      });
      btn.classList.remove('border-transparent', 'text-on-surface-variant');
      btn.classList.add('border-primary', 'text-primary');

      const target = btn.getAttribute('data-tab');
      Object.keys(tabs).forEach(k => {
        if (k === target) {
          tabs[k].classList.remove('hidden');
        } else {
          tabs[k].classList.add('hidden');
        }
      });

      if (target === 'menu') loadMenuTable();
      if (target === 'inquiries') loadInquiriesTable();
      if (target === 'newsletter') loadNewsletterTable();
    });
  });

  // 1. Live Stats Loader
  async function loadStats() {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) {
        document.getElementById('stat-bookings-today').textContent = data.bookings_today;
        document.getElementById('stat-covers-today').textContent = `${data.covers_today} Covers`;
        document.getElementById('stat-upcoming-bookings').textContent = data.upcoming_bookings;
        document.getElementById('stat-upcoming-covers').textContent = `${data.upcoming_covers} Covers`;
        document.getElementById('stat-subscribers').textContent = data.total_subscribers;
        document.getElementById('stat-inquiries').textContent = data.pending_inquiries;
      }
    } catch (err) {
      console.error('Stats load error:', err);
    }
  }

  // 2. Reservations Folio Table
  const filterDate = document.getElementById('filter-date');
  const filterStatus = document.getElementById('filter-status');
  const searchInput = document.getElementById('search-reservations');
  const resetBtn = document.getElementById('reset-filter-btn');
  const tbody = document.getElementById('reservations-tbody');

  async function loadReservations() {
    try {
      let url = '/api/reservations?';
      if (filterDate && filterDate.value) url += `date=${encodeURIComponent(filterDate.value)}&`;
      if (filterStatus && filterStatus.value !== 'all') url += `status=${encodeURIComponent(filterStatus.value)}&`;
      if (searchInput && searchInput.value.trim()) url += `search=${encodeURIComponent(searchInput.value.trim())}&`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.success) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-error">Failed to load reservations.</td></tr>`;
        return;
      }

      if (data.reservations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-on-surface-variant font-label-caption">No table reservations match the current filters.</td></tr>`;
        return;
      }

      tbody.innerHTML = data.reservations.map(r => {
        const statusColors = {
          confirmed: 'bg-[#dde6ce] text-[#59614e] border-[#c1cab3]',
          seated: 'bg-[#ffd3c6] text-[#7f3015] border-[#ffb59e]',
          completed: 'bg-surface-container text-on-surface-variant border-outline-variant',
          cancelled: 'bg-[#ffdad6] text-[#ba1a1a] border-[#ffdad6]'
        };
        const badgeClass = statusColors[r.status] || 'bg-surface-container text-on-surface';

        return `
          <tr class="hover:bg-surface-container transition-colors">
            <td class="p-3.5 font-bold text-primary">${r.reference}</td>
            <td class="p-3.5">
              <div class="font-medium text-on-surface">${escapeHtml(r.guest_name)}</div>
              <div class="text-[11px] text-on-surface-variant">${escapeHtml(r.guest_phone)} · ${escapeHtml(r.guest_email)}</div>
            </td>
            <td class="p-3.5">
              <div class="font-medium text-on-surface">${r.reservation_date}</div>
              <div class="text-[11px] text-primary font-semibold">${r.reservation_time} Sitting</div>
            </td>
            <td class="p-3.5">
              <span class="font-semibold text-on-surface">${r.party_size} Guests</span>
              <div class="text-[11px] text-on-surface-variant">${escapeHtml(r.seating_area)}</div>
            </td>
            <td class="p-3.5 max-w-xs truncate text-on-surface-variant" title="${escapeHtml(r.guest_notes || '')}">
              ${r.guest_notes ? escapeHtml(r.guest_notes) : '<span class="text-outline italic">None</span>'}
            </td>
            <td class="p-3.5">
              <span class="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${badgeClass}">
                ${r.status}
              </span>
            </td>
            <td class="p-3.5 text-right space-x-1 whitespace-nowrap">
              ${r.status === 'confirmed' ? `
                <button onclick="updateReservationStatus(${r.id}, 'seated')" class="px-2 py-1 bg-primary text-white rounded text-[11px] hover:bg-primary-container" title="Seat table">Seat</button>
              ` : ''}
              ${r.status === 'seated' ? `
                <button onclick="updateReservationStatus(${r.id}, 'completed')" class="px-2 py-1 bg-secondary text-white rounded text-[11px]" title="Complete service">Finish</button>
              ` : ''}
              ${r.status !== 'cancelled' && r.status !== 'completed' ? `
                <button onclick="updateReservationStatus(${r.id}, 'cancelled')" class="px-2 py-1 border border-outline-variant text-on-surface-variant rounded text-[11px] hover:text-error" title="Cancel booking">Cancel</button>
              ` : ''}
              <button onclick="deleteReservation(${r.id})" class="p-1 text-on-surface-variant hover:text-error rounded" title="Delete record">
                <span class="material-symbols-outlined text-sm">delete</span>
              </button>
            </td>
          </tr>
        `;
      }).join('');
    } catch (err) {
      console.error('Error fetching reservations:', err);
    }
  }

  // Update status
  window.updateReservationStatus = async (id, status) => {
    try {
      const res = await fetch(`/api/reservations/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        loadReservations();
        loadStats();
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  // Delete
  window.deleteReservation = async (id) => {
    if (!confirm('Remove this reservation folio permanently?')) return;
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        loadReservations();
        loadStats();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  if (filterDate) filterDate.addEventListener('change', loadReservations);
  if (filterStatus) filterStatus.addEventListener('change', loadReservations);
  if (searchInput) searchInput.addEventListener('input', debounce(loadReservations, 300));
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (filterDate) filterDate.value = '';
      if (filterStatus) filterStatus.value = 'all';
      if (searchInput) searchInput.value = '';
      loadReservations();
    });
  }

  // 3. Walk-In / Desk Booking Modal
  const walkinModal = document.getElementById('walkin-modal');
  const openWalkinBtn = document.getElementById('open-walkin-modal-btn');
  const closeWalkinBtn = document.getElementById('close-walkin-btn');
  const walkinForm = document.getElementById('walkin-form');

  if (openWalkinBtn) {
    openWalkinBtn.addEventListener('click', () => {
      const today = new Date().toISOString().split('T')[0];
      const dateEl = document.getElementById('w-date');
      if (dateEl) dateEl.value = today;
      walkinModal.classList.remove('hidden');
    });
  }

  if (closeWalkinBtn) {
    closeWalkinBtn.addEventListener('click', () => {
      walkinModal.classList.add('hidden');
    });
  }

  if (walkinForm) {
    walkinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        guest_name: document.getElementById('w-name').value,
        guest_email: document.getElementById('w-email').value,
        guest_phone: document.getElementById('w-phone').value,
        party_size: document.getElementById('w-party').value,
        seating_area: document.getElementById('w-area').value,
        reservation_date: document.getElementById('w-date').value,
        reservation_time: document.getElementById('w-time').value,
        guest_notes: document.getElementById('w-notes').value
      };

      try {
        const res = await fetch('/api/reservations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert(`Reservation secured with folio ref: ${data.reference}`);
          walkinForm.reset();
          walkinModal.classList.add('hidden');
          loadReservations();
          loadStats();
        } else {
          alert(data.error || 'Booking error.');
        }
      } catch (err) {
        alert('Failed to connect to reservation service.');
      }
    });
  }

  // 4. Menu Table
  async function loadMenuTable() {
    const tbody = document.getElementById('menu-tbody');
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (!data.success) return;

      tbody.innerHTML = data.items.map(dish => `
        <tr class="hover:bg-surface-container ${!dish.is_available ? 'opacity-60' : ''}">
          <td class="p-3.5 uppercase font-medium text-secondary text-[11px]">${dish.category}</td>
          <td class="p-3.5">
            <div class="font-medium text-on-surface">${dish.title}</div>
            <div class="text-[11px] text-on-surface-variant">${dish.description}</div>
          </td>
          <td class="p-3.5 font-medium text-on-surface">${dish.price_display || '€' + dish.price}</td>
          <td class="p-3.5">${dish.badge ? `<span class="px-1.5 py-0.5 border border-outline-variant rounded text-[10px]">${dish.badge}</span>` : '—'}</td>
          <td class="p-3.5">
            <button onclick="toggleDishAvailability(${dish.id}, ${dish.is_available ? 0 : 1})" class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${dish.is_available ? 'bg-secondary text-white' : 'bg-surface-container-high text-error border border-error'}">
              ${dish.is_available ? 'Serving' : '86’d / Depleted'}
            </button>
          </td>
          <td class="p-3.5 text-right">
            <button onclick="deleteDish(${dish.id})" class="p-1 text-on-surface-variant hover:text-error">
              <span class="material-symbols-outlined text-sm">delete</span>
            </button>
          </td>
        </tr>
      `).join('');
    } catch (e) {}
  }

  window.toggleDishAvailability = async (id, newState) => {
    await fetch(`/api/menu/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_available: newState })
    });
    loadMenuTable();
  };

  window.deleteDish = async (id) => {
    if (!confirm('Remove this dish from the carte?')) return;
    await fetch(`/api/menu/${id}`, { method: 'DELETE' });
    loadMenuTable();
  };

  // 5. Inquiries Table
  async function loadInquiriesTable() {
    const tbody = document.getElementById('inquiries-tbody');
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (!data.success) return;

      tbody.innerHTML = data.inquiries.map(inq => `
        <tr class="hover:bg-surface-container">
          <td class="p-3.5">
            <div class="font-medium text-on-surface">${escapeHtml(inq.name)}</div>
            <div class="text-[11px] text-on-surface-variant">${escapeHtml(inq.email)} · ${escapeHtml(inq.phone || 'No phone')}</div>
          </td>
          <td class="p-3.5 text-primary font-medium">${escapeHtml(inq.event_type)}</td>
          <td class="p-3.5">${inq.preferred_date || 'Flexible'}</td>
          <td class="p-3.5 font-medium">${inq.guest_count} Guests</td>
          <td class="p-3.5 max-w-sm text-on-surface-variant">${escapeHtml(inq.message || '—')}</td>
          <td class="p-3.5">
            <span class="px-2 py-0.5 rounded text-[10px] uppercase font-semibold border ${inq.status === 'booked' ? 'bg-[#dde6ce] text-[#59614e]' : 'bg-surface-container text-primary'}">
              ${inq.status}
            </span>
          </td>
          <td class="p-3.5 text-right space-x-1">
            ${inq.status === 'pending' ? `
              <button onclick="updateInquiryStatus(${inq.id}, 'contacted')" class="px-2 py-1 bg-secondary text-white rounded text-[11px]">Contacted</button>
            ` : ''}
            ${inq.status === 'contacted' ? `
              <button onclick="updateInquiryStatus(${inq.id}, 'booked')" class="px-2 py-1 bg-primary text-white rounded text-[11px]">Book Salon</button>
            ` : ''}
          </td>
        </tr>
      `).join('');
    } catch (e) {}
  }

  window.updateInquiryStatus = async (id, status) => {
    await fetch(`/api/inquiries/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    loadInquiriesTable();
    loadStats();
  };

  // 6. Newsletter Table
  async function loadNewsletterTable() {
    const tbody = document.getElementById('newsletter-tbody');
    try {
      const res = await fetch('/api/newsletter');
      const data = await res.json();
      if (!data.success) return;

      tbody.innerHTML = data.subscribers.map((s, idx) => `
        <tr class="hover:bg-surface-container">
          <td class="p-3.5 font-medium text-on-surface-variant">${idx + 1}</td>
          <td class="p-3.5 font-medium text-on-surface">${escapeHtml(s.email)}</td>
          <td class="p-3.5 text-on-surface-variant">${new Date(s.subscribed_at).toLocaleDateString()}</td>
        </tr>
      `).join('');
    } catch (e) {}
  }

  // Helpers
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }

  // Initial load
  loadStats();
  loadReservations();
});

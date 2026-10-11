// Maison Ember — Staff Atelier & Table Desk Controller

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

// Maison Ember — Frontend to Backend Connector

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

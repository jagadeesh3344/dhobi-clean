/**
 * Dhobiclean - Interactive Page Scripts
 */

// Service quantity state store
const serviceData = {
  'wash-iron': { name: 'Wash & Iron', price: 60, unit: 'kg', qty: 0 },
  'dry-clean': { name: 'Dry Cleaning', price: 120, unit: 'pc', qty: 0 },
  'wash-fold': { name: 'Wash & Fold', price: 50, unit: 'kg', qty: 0 },
  'shoe-cleaning': { name: 'Shoe Cleaning', price: 199, unit: 'pair', qty: 0 },
  'steam-iron': { name: 'Steam Iron', price: 20, unit: 'pc', qty: 0 },
  'curtains-bedding': { name: 'Curtains & Bedding', price: 150, unit: 'pc', qty: 0 },
};

/**
 * Update service item quantity
 * @param {string} serviceKey 
 * @param {number} delta 
 */
function updateQty(serviceKey, delta) {
  if (!serviceData[serviceKey]) return;

  const currentQty = serviceData[serviceKey].qty;
  const newQty = Math.max(0, currentQty + delta);
  serviceData[serviceKey].qty = newQty;

  // Update DOM element
  const qtyEl = document.getElementById(`qty-${serviceKey}`);
  if (qtyEl) {
    qtyEl.textContent = newQty;
  }

  // Update card visual state
  const cardEl = document.querySelector(`.service-item-card[data-service="${serviceKey}"]`);
  if (cardEl) {
    if (newQty > 0) {
      cardEl.classList.add('has-items');
    } else {
      cardEl.classList.remove('has-items');
    }
  }

  updateSummaryBadge();
}

/**
 * Update the cart / selected services summary badge
 */
function updateSummaryBadge() {
  const badgeEl = document.getElementById('cart-summary-badge');
  if (!badgeEl) return;

  let totalItems = 0;
  let totalCost = 0;

  for (const key in serviceData) {
    const item = serviceData[key];
    totalItems += item.qty;
    totalCost += item.qty * item.price;
  }

  if (totalItems === 0) {
    badgeEl.textContent = '0 items selected';
    badgeEl.style.color = '#0284c7';
    badgeEl.style.backgroundColor = '#e0f2fe';
  } else {
    badgeEl.textContent = `${totalItems} items selected • ₹${totalCost.toLocaleString('en-IN')}`;
    badgeEl.style.color = '#059669';
    badgeEl.style.backgroundColor = '#d1fae5';
  }
}

/**
 * Setup strict 10-digit mobile number rules:
 * - Exactly 10 digits (stops taking any more digits once 10 is reached)
 * - Must start with 6, 7, 8, or 9
 * - Rejects all letters, symbols, and invalid starting digits
 * - Smart paste handling for +91 / 0 prefix
 * - Clean input field without text message clutter
 */
function setupStrictPhoneValidation(inputEl) {
  if (!inputEl) return;

  // Prevent invalid keys before they hit the input
  inputEl.addEventListener('keydown', (e) => {
    // Allow navigation, delete, copy/paste shortcuts
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
      (e.ctrlKey || e.metaKey)
    ) {
      return;
    }

    // Block non-digit keys
    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const value = inputEl.value;
    const isReplacingAll = inputEl.selectionStart === 0 && inputEl.selectionEnd === value.length;

    // First digit restriction: must start with 6, 7, 8, or 9
    if ((value.length === 0 || isReplacingAll) && !/^[6-9]$/.test(e.key)) {
      e.preventDefault();
      inputEl.classList.add('phone-error-shake');
      setTimeout(() => inputEl.classList.remove('phone-error-shake'), 400);
      return;
    }

    // Strictly limit to 10 digits - if 10 digits are already entered, do NOT take another digit
    if (value.length >= 10 && inputEl.selectionStart === inputEl.selectionEnd) {
      e.preventDefault();
    }
  });

  // Handle input / paste / autofill
  inputEl.addEventListener('input', () => {
    let val = inputEl.value.replace(/\D/g, ''); // only digits

    // Smart paste: handle +91 or 0 prefix if length > 10
    if (val.length > 10) {
      if (val.startsWith('91') && /^[6-9]/.test(val.slice(2))) {
        val = val.slice(2);
      } else if (val.startsWith('0') && /^[6-9]/.test(val.slice(1))) {
        val = val.slice(1);
      }
    }

    // Strip leading digits until 6, 7, 8, or 9
    while (val.length > 0 && !/^[6-9]/.test(val)) {
      val = val.slice(1);
    }

    // Strictly cap at 10 digits - will never exceed 10
    if (val.length > 10) {
      val = val.slice(0, 10);
    }

    inputEl.value = val;
  });

  // Initialize if value already exists
  if (inputEl.value) {
    let val = inputEl.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    inputEl.value = val;
  }
}

/**
 * Handle form submission
 * @param {Event} event 
 */
function handleBookingSubmit(event) {
  event.preventDefault();

  const nameInput = document.getElementById('user-name');
  const phoneInput = document.getElementById('user-phone');
  const addressInput = document.getElementById('user-address');
  const daySelect = document.getElementById('pickup-day');
  const timeSelect = document.getElementById('pickup-time');
  const storeSelect = document.getElementById('pickup-store');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const day = daySelect.value;
  const time = timeSelect.value;
  const store = storeSelect.value;

  // Strict 10-digit mobile number validation starting with 6, 7, 8, or 9
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    showToast('⚠️ Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9');
    phoneInput.focus();
    phoneInput.classList.add('phone-error-shake');
    setTimeout(() => phoneInput.classList.remove('phone-error-shake'), 400);
    return;
  }


  // Check selected items
  const selectedItems = [];
  let estimatedTotal = 0;

  for (const key in serviceData) {
    const item = serviceData[key];
    if (item.qty > 0) {
      selectedItems.push(`${item.name} (${item.qty} × ₹${item.price})`);
      estimatedTotal += item.qty * item.price;
    }
  }

  if (selectedItems.length === 0) {
    showToast('⚠️ Please select at least one service and quantity for pickup!');
    return;
  }

  // Store order persistently in localStorage for Admin Panel
  const orderId = `#DHB-${Math.floor(100000 + Math.random() * 900000)}`;
  const newOrder = {
    id: orderId,
    name: name,
    phone: phone,
    address: address,
    slot: `${day}, ${time}`,
    hub: store,
    services: selectedItems.length > 0 ? selectedItems.join(', ') : 'General Laundry Pickup',
    total: estimatedTotal > 0 ? estimatedTotal : 150,
    status: 'pending',
    timestamp: new Date().toISOString()
  };

  try {
    const existingOrders = JSON.parse(localStorage.getItem('dhobi_orders') || '[]');
    existingOrders.unshift(newOrder);
    localStorage.setItem('dhobi_orders', JSON.stringify(existingOrders));
    
    // Broadcast storage event for open admin panel tabs
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  // Save last order text for WhatsApp dispatch
  lastCustomerPhone = phone;
  const servicesFormatted = selectedItems.length > 0 ? selectedItems.join('\n- ') : 'General Laundry Care';
  lastWhatsAppText = `🧼 *DHOBICLEAN LAUNDRY PICKUP ORDER*\n----------------------------------------\n🆔 *Order ID:* ${orderId}\n👤 *Customer Name:* ${name}\n📞 *Phone:* ${phone}\n📍 *Address:* ${address}\n📅 *Pickup Slot:* ${day}, ${time}\n🏬 *Assigned Hub:* ${store}\n----------------------------------------\n🛍️ *Selected Services:*\n- ${servicesFormatted}\n----------------------------------------\n💰 *Estimated Total:* ₹${estimatedTotal.toLocaleString('en-IN')}\n----------------------------------------\nThank you for choosing Dhobiclean! Our valet driver will arrive during your pickup slot.`;

  const modal = document.getElementById('confirmation-modal');
  const modalUserName = document.getElementById('modal-user-name');
  const modalDetails = document.getElementById('modal-details');

  modalUserName.textContent = name || 'Customer';

  let itemsHtml = '';
  if (selectedItems.length > 0) {
    itemsHtml = `
      <div style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 8px;">
        <strong>Selected Services:</strong><br>
        ${selectedItems.join('<br>')}
        <div style="margin-top: 6px; font-weight: 700; color: #4ade80;">
          Estimated Total: ₹${estimatedTotal.toLocaleString('en-IN')}
        </div>
      </div>
    `;
  } else {
    itemsHtml = `
      <div style="margin-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 8px; color: #94a3b8;">
        <em>No specific quantity chosen — our laundry valet will weigh and tally your clothes upon pickup!</em>
      </div>
    `;
  }

  modalDetails.innerHTML = `
    <div style="font-weight: 800; color: #38bdf8; margin-bottom: 6px;">Order ID: ${orderId}</div>
    <div><strong>Pickup Slot:</strong> ${day}, ${time}</div>
    <div><strong>Assigned Store:</strong> ${store}</div>
    <div><strong>Phone:</strong> ${phone}</div>
    <div><strong>Address:</strong> ${address}</div>
    ${itemsHtml}
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  // Auto-prompt WhatsApp send after 800ms
  setTimeout(() => {
    if (confirm('📱 Would you like to send order details directly to your WhatsApp?')) {
      sendWhatsAppOrder();
    }
  }, 800);
}

let lastWhatsAppText = '';
let lastCustomerPhone = '';

/**
 * Open WhatsApp pre-filled with customer order details
 */
function sendWhatsAppOrder() {
  if (!lastWhatsAppText) {
    alert('No active order found to send to WhatsApp.');
    return;
  }
  const cleanPhone = lastCustomerPhone.replace(/\D/g, '');
  const targetPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(lastWhatsAppText);
  const waUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;
  window.open(waUrl, '_blank');
}

window.sendWhatsAppOrder = sendWhatsAppOrder;

/**
 * Close confirmation modal
 */
function closeModal() {
  const modal = document.getElementById('confirmation-modal');
  if (modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
}

// Close modal when clicking outside box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('confirmation-modal');
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on Escape key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});

/**
 * Newsletter submission handler
 */
function handleNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input');
  if (input && input.value) {
    alert(`Thank you! You have subscribed with ${input.value}. Use code FRESH20 for 20% off your first pickup.`);
    input.value = '';
  }
}

// Active navigation highlight on scroll for in-page anchors & 7M Secret Admin Trigger
let click7MCount = 0;
let click7MTime = 0;

function showToast(msg) {
  let toast = document.getElementById('admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.style.cssText = 'position: fixed; bottom: 24px; right: 24px; background: rgba(11, 26, 45, 0.9); color: #38bdf8; padding: 12px 20px; border-radius: 9999px; font-weight: 800; font-size: 13px; z-index: 99999; backdrop-filter: blur(12px); border: 1.5px solid #0284c7; box-shadow: 0 10px 30px rgba(0,0,0,0.3); transition: all 0.3s ease; transform: translateY(50px); opacity: 0;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.transform = 'translateY(0)';
  toast.style.opacity = '1';

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    toast.style.transform = 'translateY(50px)';
    toast.style.opacity = '0';
  }, 2200);
}

function handle7MClick() {
  const now = Date.now();
  if (now - click7MTime > 2500) {
    click7MCount = 1;
  } else {
    click7MCount++;
  }
  click7MTime = now;

  const statCard = document.getElementById('stat-card-7m') || document.querySelector('.stat-card');
  if (statCard) {
    statCard.style.transform = 'scale(0.95)';
    setTimeout(() => { statCard.style.transform = ''; }, 150);
  }

  if (click7MCount >= 4) {
    click7MCount = 0;
    // Always clear session token so tapping 4 times MUST ask for admin credentials
    sessionStorage.removeItem('dhobi_admin_auth');
    setTimeout(() => {
      window.location.href = '/admin';
    }, 200);
  }
}

window.handle7MClick = handle7MClick;

window.addEventListener('DOMContentLoaded', () => {
  updateSummaryBadge();
  initTimeSlotFilter();

  // Attach strict 10-digit phone validation starting with 6, 7, 8, or 9
  setupStrictPhoneValidation(document.getElementById('user-phone'));


  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.nav-link');
  const homeLink = document.querySelector('.nav-link[href="/"]');

  // Attach 4-click trigger to 7M+ Happy Customers card & logo
  const stat7mCard = document.querySelector('.stat-card');
  if (stat7mCard) {
    stat7mCard.id = 'stat-card-7m';
    stat7mCard.style.cursor = 'pointer';
    stat7mCard.removeAttribute('title');
    stat7mCard.addEventListener('click', handle7MClick);
  }

  window.addEventListener('scroll', () => {
    // On the homepage, keep Home active unless user scrolled down into in-page anchor
    if (window.scrollY < 300) {
      if (homeLink) homeLink.classList.add('active');
    }
  });
});

/**
 * Filter out past time slots when 'Today' is selected
 */
function updateAvailableTimeSlots() {
  const daySelect = document.getElementById('pickup-day');
  const timeSelect = document.getElementById('pickup-time');
  if (!daySelect || !timeSelect) return;

  const ALL_TIME_SLOTS = [
    { value: 'Morning (8:00 AM - 12:00 PM)', text: 'Morning (8:00 AM - 12:00 PM)', endHour: 12 },
    { value: 'Afternoon (12:00 PM - 4:00 PM)', text: 'Afternoon (12:00 PM - 4:00 PM)', endHour: 16 },
    { value: 'Evening (4:00 PM - 8:00 PM)', text: 'Evening (4:00 PM - 8:00 PM)', endHour: 20 },
    { value: 'Night (8:00 PM - 10:00 PM)', text: 'Night (8:00 PM - 10:00 PM)', endHour: 22 }
  ];

  const now = new Date();
  const currentHour = now.getHours();
  const currentSelectedTime = timeSelect.value;

  // Filter slots whose end hour hasn't passed yet today
  const todayAvailableSlots = ALL_TIME_SLOTS.filter(slot => currentHour < slot.endHour);

  // Update Today option in day dropdown if all slots for today have ended
  const todayOption = daySelect.querySelector('option[value="Today"]');
  if (todayOption) {
    if (todayAvailableSlots.length === 0) {
      todayOption.disabled = true;
      todayOption.textContent = 'Today (Slots Closed)';
      if (daySelect.value === 'Today') {
        daySelect.value = 'Tomorrow';
      }
    } else {
      todayOption.disabled = false;
      todayOption.textContent = 'Today';
    }
  }

  const slotsToDisplay = (daySelect.value === 'Today') ? todayAvailableSlots : ALL_TIME_SLOTS;

  // Re-populate time dropdown options
  timeSelect.innerHTML = '';
  slotsToDisplay.forEach(slot => {
    const opt = document.createElement('option');
    opt.value = slot.value;
    opt.textContent = slot.text;
    timeSelect.appendChild(opt);
  });

  // Keep previously selected option if available in new list
  const exists = Array.from(timeSelect.options).some(opt => opt.value === currentSelectedTime);
  if (exists) {
    timeSelect.value = currentSelectedTime;
  } else if (timeSelect.options.length > 0) {
    timeSelect.selectedIndex = 0;
  }
}

/**
 * Initialize time slot filtering and add change listener
 */
function initTimeSlotFilter() {
  const daySelect = document.getElementById('pickup-day');
  if (daySelect) {
    daySelect.addEventListener('change', updateAvailableTimeSlots);
    updateAvailableTimeSlots();
  }
}


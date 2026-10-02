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
    badgeEl.style.color = '#38bdf8';
    badgeEl.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
  } else {
    badgeEl.textContent = `${totalItems} items selected • ₹${totalCost.toLocaleString('en-IN')}`;
    badgeEl.style.color = '#4ade80';
    badgeEl.style.backgroundColor = 'rgba(74, 222, 128, 0.15)';
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
    <div><strong>Pickup Slot:</strong> ${day}, ${time}</div>
    <div><strong>Assigned Store:</strong> ${store}</div>
    <div><strong>Phone:</strong> ${phone}</div>
    <div><strong>Address:</strong> ${address}</div>
    ${itemsHtml}
  `;

  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
}

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

// Active navigation highlight on scroll for in-page anchors
window.addEventListener('DOMContentLoaded', () => {
  updateSummaryBadge();

  const sections = document.querySelectorAll('main section');
  const navLinks = document.querySelectorAll('.nav-link');
  const homeLink = document.querySelector('.nav-link[href="index.html"]');

  window.addEventListener('scroll', () => {
    // On the homepage, keep Home active unless user scrolled down into in-page anchor
    if (window.scrollY < 300) {
      if (homeLink) homeLink.classList.add('active');
    }
  });
});

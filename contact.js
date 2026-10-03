/**
 * Dhobiclean - Contact Us Multi-Location Interactive Map & Form Script
 */

const STORES = {
  hyderabad: {
    name: 'Dhobiclean Jubilee Hills Hub',
    address: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana - 500033',
    lat: 17.4325,
    lng: 78.4071,
    phone: '+91 62817 46225',
    hours: 'Open Daily: 8:00 AM - 9:00 PM',
    manager: 'Hub Manager: Vikram Reddy',
    status: '🟢 Open Now',
    tag: 'Flagship Hub',
    mapsQuery: 'Jubilee+Hills+Road+36+Hyderabad'
  },
  bangalore: {
    name: 'Dhobiclean Indiranagar Store',
    address: '100ft Road, Indiranagar, Bengaluru, Karnataka - 560038',
    lat: 12.9784,
    lng: 77.6408,
    phone: '+91 98765 43211',
    hours: 'Open Daily: 7:30 AM - 9:30 PM',
    manager: 'Store Manager: Ananya Rao',
    status: '🟢 Open Now',
    tag: 'Express Hub',
    mapsQuery: '100ft+Road+Indiranagar+Bengaluru'
  },
  mumbai: {
    name: 'Dhobiclean Bandra Care Hub',
    address: 'Hill Road, Bandra West, Mumbai, Maharashtra - 400050',
    lat: 19.0600,
    lng: 72.8362,
    phone: '+91 98765 43212',
    hours: 'Open Daily: 8:00 AM - 10:00 PM',
    manager: 'Hub Director: Rohan Mehta',
    status: '🟢 Open Now',
    tag: 'Luxury Care Spa',
    mapsQuery: 'Hill+Road+Bandra+West+Mumbai'
  },
  delhi: {
    name: 'Dhobiclean Connaught Place Center',
    address: 'Block C, Connaught Place, New Delhi, Delhi - 110001',
    lat: 28.6315,
    lng: 77.2167,
    phone: '+91 98765 43213',
    hours: 'Open Daily: 8:00 AM - 9:00 PM',
    manager: 'Store Head: Rajesh Verma',
    status: '🟢 Open Now',
    tag: 'Capital Hub',
    mapsQuery: 'Connaught+Place+New+Delhi'
  },
  chennai: {
    name: 'Dhobiclean Anna Nagar Hub',
    address: '2nd Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040',
    lat: 13.0850,
    lng: 80.2101,
    phone: '+91 98765 43214',
    hours: 'Open Daily: 7:30 AM - 9:00 PM',
    manager: 'Hub Lead: Suresh Kumar',
    status: '🟢 Open Now',
    tag: 'Coastal Hub',
    mapsQuery: '2nd+Avenue+Anna+Nagar+Chennai'
  }
};

let mapInstance = null;
let mapMarker = null;
let currentStoreKey = 'hyderabad';

document.addEventListener('DOMContentLoaded', () => {
  initMap();
  setupStrictPhoneValidation(document.getElementById('contact-phone'));
});



/**
 * Initialize Leaflet Map
 */
function initMap() {
  const mapElement = document.getElementById('dhobi-leaflet-map');
  if (!mapElement) return;

  const store = STORES[currentStoreKey];

  try {
    if (typeof L !== 'undefined') {
      mapInstance = L.map('dhobi-leaflet-map', {
        center: [store.lat, store.lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(mapInstance);

      updateMarker(store);
    }
  } catch (e) {
    console.warn('Leaflet map error:', e);
  }
}

/**
 * Update Map Marker
 */
function updateMarker(store) {
  if (!mapInstance || typeof L === 'undefined') return;

  if (mapMarker) {
    mapInstance.removeLayer(mapMarker);
  }

  const customPin = L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="display: flex; align-items: center; gap: 8px; background: #ffffff; padding: 7px 14px; border-radius: 9999px; box-shadow: 0 6px 20px rgba(2, 132, 199, 0.3); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 13px; font-weight: 800; color: #0b1a2d; white-space: nowrap; border: 2px solid #0284c7; transform: translate(-30%, -100%);">
        <span style="width: 10px; height: 10px; border-radius: 50%; background: #0284c7; display: inline-block; box-shadow: 0 0 8px #0284c7;"></span>
        ${store.name}
      </div>
    `,
    iconSize: [160, 42],
    iconAnchor: [80, 21]
  });

  mapMarker = L.marker([store.lat, store.lng], { icon: customPin }).addTo(mapInstance);
  mapMarker.bindPopup(`<strong>${store.name}</strong><br>${store.address}<br>📞 ${store.phone}`).openPopup();
}

/**
 * Switch Store Location
 */
function switchStore(storeKey) {
  if (!STORES[storeKey]) return;
  currentStoreKey = storeKey;

  const store = STORES[storeKey];

  // Update Pills UI
  const buttons = document.querySelectorAll('#map-store-selector .store-pill');
  buttons.forEach(btn => {
    if (btn.getAttribute('onclick').includes(`'${storeKey}'`)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update Leaflet Map
  if (mapInstance) {
    mapInstance.flyTo([store.lat, store.lng], 14, { duration: 1.2 });
    updateMarker(store);
  }

  // Update Google Maps Iframe
  const gmapIframe = document.getElementById('google-maps-iframe');
  if (gmapIframe) {
    gmapIframe.src = `https://maps.google.com/maps?q=${store.mapsQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }

  // Update Store Metadata Box
  const nameEl = document.getElementById('selected-store-name');
  const addrEl = document.getElementById('selected-store-address');
  const phoneEl = document.getElementById('selected-store-phone');
  const hoursEl = document.getElementById('selected-store-hours');
  const mgrEl = document.getElementById('selected-store-manager');
  const directionsBtn = document.getElementById('btn-get-directions');
  const callBtn = document.getElementById('btn-call-store');

  if (nameEl) nameEl.textContent = store.name;
  if (addrEl) addrEl.textContent = store.address;
  if (phoneEl) phoneEl.textContent = store.phone;
  if (hoursEl) hoursEl.textContent = store.hours;
  if (mgrEl) mgrEl.textContent = store.manager;

  if (directionsBtn) {
    directionsBtn.href = `https://maps.google.com/?q=${store.mapsQuery}`;
  }
  if (callBtn) {
    callBtn.href = `tel:${store.phone.replace(/\s+/g, '')}`;
  }
}

// Make switchStore available globally
window.switchStore = switchStore;

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

  // Prevent invalid keys
  inputEl.addEventListener('keydown', (e) => {
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
      (e.ctrlKey || e.metaKey)
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const value = inputEl.value;
    const isReplacingAll = inputEl.selectionStart === 0 && inputEl.selectionEnd === value.length;

    // First digit must be 6, 7, 8, or 9
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

  // Handle paste and typing
  inputEl.addEventListener('input', () => {
    let val = inputEl.value.replace(/\D/g, '');

    if (val.length > 10) {
      if (val.startsWith('91') && /^[6-9]/.test(val.slice(2))) {
        val = val.slice(2);
      } else if (val.startsWith('0') && /^[6-9]/.test(val.slice(1))) {
        val = val.slice(1);
      }
    }

    while (val.length > 0 && !/^[6-9]/.test(val)) {
      val = val.slice(1);
    }

    // Strictly cap at 10 digits - will never exceed 10
    if (val.length > 10) {
      val = val.slice(0, 10);
    }

    inputEl.value = val;
  });

  if (inputEl.value) {
    let val = inputEl.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    inputEl.value = val;
  }
}

/**
 * Handle Contact Form Submission
 */
function handleContactMessage(event) {
  event.preventDefault();

  const nameInput = document.getElementById('contact-fullname');
  const emailInput = document.getElementById('contact-email');
  const phoneInput = document.getElementById('contact-phone');
  const messageInput = document.getElementById('contact-message');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const phone = phoneInput.value.trim();
  const message = messageInput.value.trim();

  // Strict 10-digit mobile number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
    phoneInput.focus();
    phoneInput.classList.add('phone-error-shake');
    setTimeout(() => phoneInput.classList.remove('phone-error-shake'), 400);
    return;
  }

  const newMsg = {
    time: `Today ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
    name,
    email,
    phone,
    snippet: message,
    status: 'New'
  };

  try {
    const msgs = JSON.parse(localStorage.getItem('dhobi_messages') || '[]');
    msgs.unshift(newMsg);
    localStorage.setItem('dhobi_messages', JSON.stringify(msgs));
    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }

  alert(`Thank you, ${name}! Your message has been sent successfully. Our team will contact you at ${phone || email} within 15 minutes.`);

  event.target.reset();
}



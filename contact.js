/**
 * Dhobiclean - Contact Us Page Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initMap();
});

/**
 * Initialize Leaflet Map with Custom Marker
 */
function initMap() {
  const mapElement = document.getElementById('dhobi-leaflet-map');
  const fallbackElement = document.getElementById('map-fallback');

  if (!mapElement) return;

  // Hyderabad coordinates
  const lat = 17.385044;
  const lng = 78.486671;

  try {
    if (typeof L !== 'undefined') {
      const map = L.map('dhobi-leaflet-map', {
        center: [lat, lng],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // CartoDB Positron / OSM clean tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Custom Red Pin Marker
      const customPin = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="display: flex; align-items: center; gap: 8px; background: white; padding: 6px 12px; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.18); font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; color: #0b1a2d; white-space: nowrap; border: 1.5px solid #ef4444; transform: translate(-30%, -100%);">
            <span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span>
            Dhobiclean Hub
          </div>
        `,
        iconSize: [120, 40],
        iconAnchor: [60, 20]
      });

      const marker = L.marker([lat, lng], { icon: customPin }).addTo(map);
      marker.bindPopup('<strong>Dhobiclean Hub</strong><br>123, Laundry Street, Hyderabad, Telangana - 500001').openPopup();
    } else {
      showFallbackMap();
    }
  } catch (e) {
    console.warn('Leaflet map error, switching to static fallback map:', e);
    showFallbackMap();
  }

  function showFallbackMap() {
    if (mapElement) mapElement.style.display = 'none';
    if (fallbackElement) fallbackElement.style.display = 'block';
  }
}

/**
 * Handle Contact Message Form Submission
 */
function handleContactMessage(event) {
  event.preventDefault();

  const name = document.getElementById('contact-fullname').value.trim();
  const email = document.getElementById('contact-email').value.trim();
  const phone = document.getElementById('contact-phone').value.trim();
  const message = document.getElementById('contact-message').value.trim();

  alert(`Thank you, ${name}! Your message has been received. Our team will contact you at ${phone || email} within 24 hours.`);

  event.target.reset();
}

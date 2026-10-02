# Dhobiclean 🧺✨

A modern, responsive, and picture-perfect multi-page web platform for **Dhobiclean** — an on-demand premium laundry, dry cleaning, and fabric care service.

![Dhobiclean Preview](assets/hero-laundry.jpg)

## 🌐 Complete Multi-Page Suite

The website consists of 5 fully responsive, interconnected, and picture-perfect pages matching custom design mockups:

1. **Home (`index.html`)**:
   - Hero banner with laundry visuals and floating bubble micro-animations.
   - Live metrics bar (15K+ Happy Customers, 50+ Machines, 99.8% Satisfaction, 24/7 Support).
   - Dark interactive pickup booking card (`#0c1b2f`) with live item quantity steppers `[-] / [+]`, real-time price calculation, branch picker, and booking confirmation modal.
   - "Why Choose Dhobiclean" 4-pillar value cards.
   - Brand footer with newsletter subscription.

2. **About Us (`about.html`)**:
   - Folded organic cotton towels hero banner with floating brand badge.
   - Metrics overview bar.
   - "Our Story" narrative accompanied by laundromat interior photography.
   - Dual Mission (Soft Peach) & Vision (Fresh Mint) feature cards.
   - "Our Values" 4-pillar grid (Eco-friendly, Speed, Quality, Transparency).
   - Dynamic wave CTA banner linking to booking.

3. **Services (`services.html`)**:
   - Clean hero banner with fabric care imagery.
   - Interactive category filter tabs (`All Services`, `Laundry`, `Dry Cleaning`, `Special Care`).
   - 6 service catalog cards with price tags, bulleted features, and direct "Book Now" actions:
     - Wash & Fold
     - Wash & Iron
     - Dry Cleaning
     - Steam Press
     - Shoe Cleaning & Revive
     - Curtains & Heavy Bedding
   - "Need a Custom Quote?" customer assistance card.

4. **Blog (`blog.html`)**:
   - Cozy laundry & home aesthetics hero banner.
   - Real-time client-side search bar filtering articles by title, excerpt, and category tags.
   - 6 article cards with high-resolution imagery, read times, dates, and author badges.
   - "Stay Updated" newsletter card with instant subscription feedback.

5. **Contact Us (`contact.html`)**:
   - Specialist hero section with support badge.
   - 4 direct contact channel cards:
     - Call Us (`+91 98765 43210`)
     - Email Us (`support@dhobiclean.com`)
     - Visit Us (`Banjara Hills, Hyderabad, Telangana 500034`)
     - Working Hours (`Mon - Sat: 7:00 AM - 9:00 PM`)
   - Interactive "Send Us a Message" inquiry form with instant submission validation.
   - Interactive Leaflet.js map centered on Banjara Hills, Hyderabad with custom brand markers.

---

## 🚀 Getting Started

Simply open `index.html` in any modern web browser or run a lightweight local static server:

```bash
# Python
python -m http.server 8080

# Or Node.js
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🛠️ Built With

- **HTML5** (Semantic structure & SEO metadata across all 5 pages)
- **Vanilla CSS3** (Design system tokens, custom properties, glassmorphism, responsive flex/grid, micro-animations)
- **JavaScript (ES6+)** (Real-time blog search, dynamic price calculator, booking modal, contact form validation, Leaflet map)
- **Leaflet.js & OpenStreetMap** (Interactive location map)
- **Font Awesome 6** (Vector iconography)
- **Google Fonts** (Plus Jakarta Sans)

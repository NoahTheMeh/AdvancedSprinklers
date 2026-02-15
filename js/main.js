// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('open');
  navToggle.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
  });
});

// Navbar shadow on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
});

// Gallery lightbox
const lightbox = document.createElement('div');
lightbox.className = 'lightbox';
lightbox.innerHTML = '<button class="lightbox-close" aria-label="Close">&times;</button><img src="" alt="">';
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector('img');
const lightboxClose = lightbox.querySelector('.lightbox-close');

document.querySelectorAll('.gallery-item img').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Seasonal banner
(function() {
  const month = new Date().getMonth(); // 0-11
  const banner = document.getElementById('seasonal-banner');
  const message = document.getElementById('seasonal-message');
  const seasons = {
    // Dec, Jan, Feb — winter
    winter: 'Frozen pipes? We handle emergency winter repairs. <a href="#contact">Contact us today!</a>',
    // Mar, Apr — spring booking
    spring: 'Spring is here! Book your sprinkler turn-on before the rush. <a href="#contact">Schedule now!</a>',
    // May, Jun, Jul, Aug — peak season
    summer: 'Peak season is here! New installations, repairs & maintenance. <a href="tel:2086871955">Call for a free estimate!</a>',
    // Sep, Oct, Nov — winterizing
    fall: 'Time to winterize! Protect your system before the freeze. <a href="#contact">Book your blow-out!</a>'
  };

  let season;
  if (month >= 11 || month <= 1) season = 'winter';
  else if (month <= 3) season = 'spring';
  else if (month <= 7) season = 'summer';
  else season = 'fall';

  message.innerHTML = seasons[season];
})();

// Inquiry form with Formspree
(function() {
  const form = document.getElementById('inquiry-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        status.textContent = 'Thank you! We\'ll be in touch soon.';
        status.classList.add('success');
        form.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (err) {
      status.textContent = 'Something went wrong. Please call us at (208) 687-1955.';
      status.classList.add('error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = 'Send Inquiry';
  });
})();

// Service area map with Leaflet
(function() {
  // Center on the North Idaho service area
  const map = L.map('map', {
    scrollWheelZoom: false
  }).setView([47.75, -116.87], 11);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18
  }).addTo(map);

  // Service area polygon covering the main towns
  const serviceArea = L.polygon([
    [47.62, -117.05],  // SW - west of Post Falls
    [47.62, -116.68],  // SE - south of CdA
    [47.68, -116.60],  // east of CdA
    [47.78, -116.65],  // east of Hayden
    [47.85, -116.72],  // NE of Hayden
    [47.97, -116.80],  // Spirit Lake area
    [48.00, -116.92],  // north of Spirit Lake
    [47.90, -117.00],  // NW of Rathdrum
    [47.80, -117.05],  // west of Post Falls
  ], {
    color: '#2d7a3e',
    fillColor: '#2d7a3e',
    fillOpacity: 0.15,
    weight: 2
  }).addTo(map);

  // Town markers
  const towns = [
    { name: "Coeur d'Alene", lat: 47.6777, lng: -116.7805 },
    { name: "Hayden", lat: 47.7660, lng: -116.7866 },
    { name: "Post Falls", lat: 47.7182, lng: -116.9516 },
    { name: "Rathdrum", lat: 47.8122, lng: -116.8953 },
    { name: "Spirit Lake", lat: 47.9664, lng: -116.8669 },
    { name: "Dalton Gardens", lat: 47.7302, lng: -116.7716 },
    { name: "Huetter", lat: 47.7124, lng: -116.8885 }
  ];

  const greenIcon = L.divIcon({
    className: 'town-marker',
    html: '<div style="width:10px;height:10px;background:#1a5c2a;border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.3)"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5]
  });

  towns.forEach(town => {
    L.marker([town.lat, town.lng], { icon: greenIcon })
      .addTo(map)
      .bindPopup(`<strong>${town.name}</strong>`);
  });

  map.fitBounds(serviceArea.getBounds().pad(0.1));
})();

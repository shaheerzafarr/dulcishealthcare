/* ============================================
   DULCIS HEALTH CARE — Main Script
   CurexPK-style interactions
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Product Data with REAL images ─────────────
  // Images are in the assets/ folder
  const products = [
    {
      name: 'Dulcis Glowing Face Wash',
      price: 950,
      cat: 'Skincare',
      ribbon: 'Best Seller',
      ribbonClass: 'ribbon-best',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.27 AM.jpeg'
    },
    {
      name: 'Antiox C — Vitamin C Serum',
      price: 1850,
      cat: 'Serums',
      ribbon: 'Best Seller',
      ribbonClass: 'ribbon-best',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.28 AM.jpeg'
    },
    {
      name: 'Dul-Mela Anti Melasma Serum',
      price: 1750,
      cat: 'Serums',
      ribbon: 'New',
      ribbonClass: 'ribbon-new',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.28 AM (2).jpeg'
    },
    {
      name: 'AgeDefy Anti Aging Serum',
      price: 1650,
      cat: 'Serums',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.29 AM.jpeg'
    },
    {
      name: 'Solar Shield SPF 60 Sunscreen',
      price: 1450,
      cat: 'Sun Care',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.29 AM (1).jpeg'
    },
    {
      name: 'Dul-Mela Serum (with bottle)',
      price: 1750,
      cat: 'Serums',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.29 AM (2).jpeg'
    },
    {
      name: 'Driff Plus Anti Hair Fall Shampoo',
      price: 1250,
      cat: 'Hair Care',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.30 AM.jpeg'
    },
    {
      name: 'Driff Plus Anti Hair Fall Serum',
      price: 1550,
      cat: 'Hair Care',
      ribbon: 'New',
      ribbonClass: 'ribbon-new',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.30 AM (1).jpeg'
    },
    {
      name: 'Acne Dul Anti Acne Face Wash',
      price: 950,
      cat: 'Skincare',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.32 AM.jpeg'
    },
    {
      name: 'Antiox C — Vitamin C Cream SPF 25',
      price: 1650,
      cat: 'Sun Care',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.33 AM.jpeg'
    },
    {
      name: 'Dulcis Glowing Serum',
      price: 1550,
      cat: 'Serums',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.33 AM (1).jpeg'
    },
    {
      name: 'Antiox C Serum (with bottle)',
      price: 1850,
      cat: 'Serums',
      ribbon: 'Best Seller',
      ribbonClass: 'ribbon-best',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.33 AM (2).jpeg'
    },
    {
      name: 'Acne Dul Anti Acne Serum',
      price: 1450,
      cat: 'Serums',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.34 AM.jpeg'
    },
    {
      name: 'Acne Dul Anti Acne Gel',
      price: 950,
      cat: 'Skincare',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.37 AM.jpeg'
    },
    {
      name: 'AgeDefy Serum (with bottle)',
      price: 1650,
      cat: 'Serums',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.37 AM (1).jpeg'
    },
    {
      name: 'Dulcis Glowing Face Wash (with tube)',
      price: 950,
      cat: 'Skincare',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.37 AM (2).jpeg'
    },
    {
      name: 'Driff Plus Shampoo — Lifestyle',
      price: 1250,
      cat: 'Hair Care',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.38 AM.jpeg'
    },
    {
      name: 'Driff Plus Anti Hair Fall Shampoo (Box)',
      price: 1250,
      cat: 'Hair Care',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.28 AM (1).jpeg'
    },
    {
      name: 'Acne Dul Face Wash (full set)',
      price: 950,
      cat: 'Skincare',
      ribbon: '',
      ribbonClass: '',
      img: 'assets/WhatsApp Image 2026-04-01 at 1.35.39 AM.jpeg'
    }
  ];

  const categories = ['All', 'Serums', 'Skincare', 'Sun Care', 'Hair Care'];

  // ── Render Products ───────────────────────────
  const prodGrid = document.getElementById('prodGrid');

  function renderProducts(filter) {
    if (!prodGrid) return;
    const filtered = (!filter || filter === 'All') ? products : products.filter(p => p.cat === filter);
    prodGrid.innerHTML = filtered.map(p => `
      <div class="product-card reveal">
        <div class="pc-img">
          ${p.ribbon ? `<div class="pc-ribbon ${p.ribbonClass}">${p.ribbon}</div>` : ''}
          <img src="${p.img}" alt="${p.name}" loading="lazy">
        </div>
        <div class="pc-info">
          <div class="pc-name">${p.name}</div>
          <div class="pc-price">Rs. ${p.price.toLocaleString()}</div>
        </div>
      </div>
    `).join('');
    observeElements();
  }

  renderProducts('All');

  // ── Collection Dropdown ───────────────────────
  const dropdownToggle = document.getElementById('collectionToggle');
  const dropdownMenu = document.getElementById('collectionDropdown');
  const selectedText = document.getElementById('selectedCollection');

  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownMenu.classList.toggle('open');
    });

    dropdownMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = a.dataset.cat;
        if (selectedText) selectedText.textContent = cat === 'All' ? 'All Collections' : cat;
        dropdownMenu.classList.remove('open');
        renderProducts(cat);
      });
    });

    document.addEventListener('click', () => dropdownMenu.classList.remove('open'));
  }

  // ── Hero Slider ───────────────────────────────
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(i) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (slides[i]) slides[i].classList.add('active');
    if (dots[i]) dots[i].classList.add('active');
    currentSlide = i;
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startSlider() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideInterval);
      goToSlide(parseInt(dot.dataset.i));
      startSlider();
    });
  });

  if (slides.length) startSlider();

  // ── Announcement Bar Slider ───────────────────
  const annSlides = document.querySelectorAll('.ann-slide');
  let annCurrent = 0;

  function nextAnn() {
    annSlides.forEach(s => s.classList.remove('active'));
    annCurrent = (annCurrent + 1) % annSlides.length;
    annSlides[annCurrent].classList.add('active');
  }

  if (annSlides.length) setInterval(nextAnn, 3500);

  document.getElementById('annPrev')?.addEventListener('click', () => {
    annSlides.forEach(s => s.classList.remove('active'));
    annCurrent = (annCurrent - 1 + annSlides.length) % annSlides.length;
    annSlides[annCurrent].classList.add('active');
  });
  document.getElementById('annNext')?.addEventListener('click', nextAnn);

  document.getElementById('closeAnn')?.addEventListener('click', () => {
    document.querySelector('.ann-bar')?.remove();
  });

  // ── Sticky Nav Shadow ─────────────────────────
  const nav = document.querySelector('.main-nav');
  const backTop = document.querySelector('.back-top');

  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
    if (backTop) backTop.classList.toggle('show', window.scrollY > 600);
  });

  backTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Mobile Menu ───────────────────────────────
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const mobileClose = document.querySelector('.mobile-menu-close');

  function toggleMobile(open) {
    hamburger?.classList.toggle('open', open);
    mobileMenu?.classList.toggle('open', open);
    mobileOverlay?.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  hamburger?.addEventListener('click', () => toggleMobile(true));
  mobileClose?.addEventListener('click', () => toggleMobile(false));
  mobileOverlay?.addEventListener('click', () => toggleMobile(false));
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => toggleMobile(false));
  });

  // ── Toast ─────────────────────────────────────
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // ── Scroll Reveal ─────────────────────────────
  function observeElements() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.reveal').forEach(el => {
      if (!el.classList.contains('visible')) {
        observer.observe(el);
      }
    });
  }

  observeElements();

  // ── Newsletter Form ───────────────────────────
  document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Subscribed successfully! ✉️');
    e.target.reset();
  });
});

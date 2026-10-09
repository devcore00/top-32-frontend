/* =========================================================
   TOP32 Dental Clinic — main script (shared by AR + EN pages)
   Behaviour only — all styling lives in asset-front/css.
   ========================================================= */

/* ---------- Site settings ----------
   Edit these once — every page reads them. */
const SITE = {
  // WhatsApp number in international format without "+" (e.g. 9665XXXXXXXX)
  whatsapp: '',
  social: {
    instagram: 'https://www.instagram.com/',
    x: 'https://x.com/',
    tiktok: 'https://www.tiktok.com/',
    snapchat: 'https://www.snapchat.com/',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
  },
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Translations for script-generated text ---------- */
const LANG = document.documentElement.lang === 'en' ? 'en' : 'ar';
const I18N = {
  ar: {
    openMenu: 'فتح القائمة',
    closeMenu: 'إغلاق القائمة',
    openNow: 'مفتوح الآن',
    closedNow: 'مغلق الآن',
    prevSlide: 'الشريحة السابقة',
    nextSlide: 'الشريحة التالية',
    goToSlide: 'الانتقال إلى الشريحة {{index}}',
    reviewThanks: 'شكراً لمشاركتنا تقييمك وتجربتك في عيادات TOP32!',
    contactThanks: 'تم استلام رسالتك بنجاح، وسيتواصل معك فريقنا خلال ساعات العمل.',
    ratings: ['ضعيف', 'مقبول', 'جيد', 'جيد جداً', 'ممتاز'],
  },
  en: {
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    openNow: 'Open now',
    closedNow: 'Closed now',
    prevSlide: 'Previous slide',
    nextSlide: 'Next slide',
    goToSlide: 'Go to slide {{index}}',
    reviewThanks: 'Thank you for sharing your rating and experience at TOP32 Clinics!',
    contactThanks: 'Your message has been received. Our team will contact you during working hours.',
    ratings: ['Poor', 'Fair', 'Good', 'Very good', 'Excellent'],
  },
}[LANG];

/* ---------- Links from SITE settings ---------- */
function initSiteLinks() {
  document.querySelectorAll('[data-social]').forEach((link) => {
    const url = SITE.social[link.dataset.social];
    if (url) link.href = url;
  });

  if (SITE.whatsapp) {
    document.querySelectorAll('[data-whatsapp]').forEach((link) => {
      const text = link.dataset.whatsapp;
      link.href = `https://wa.me/${SITE.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
    });
  }

  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/* ---------- Mobile navigation ---------- */
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('mobile-menu');
  if (!toggle || !menu) return;

  const icon = toggle.querySelector('.material-symbols-outlined');
  const desktopQuery = window.matchMedia('(min-width: 1280px)');

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? I18N.closeMenu : I18N.openMenu);
    if (icon) icon.textContent = open ? 'close' : 'menu';
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      setOpen(false);
    }
  });

  desktopQuery.addEventListener('change', (e) => {
    if (e.matches) setOpen(false);
  });
}

/* ---------- Active nav link while scrolling (home page) ---------- */
function initScrollSpy() {
  const sections = ['about-us', 'services', 'doctors', 'before-and-after', 'branches']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  if (!sections.length) return;

  const links = document.querySelectorAll('.nav-link[data-path]');
  const setActive = (path) => {
    links.forEach((link) => link.classList.toggle('is-active', link.dataset.path === path));
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });

  sections.forEach((section) => observer.observe(section));

  window.addEventListener('scroll', () => {
    if (window.scrollY < 300) setActive('home');
  }, { passive: true });
}

/* ---------- Carousels (Swiper) ---------- */
const CAROUSELS = {
  doctors: {
    0: { slidesPerView: 1.1, spaceBetween: 16 },
    640: { slidesPerView: 2, spaceBetween: 24 },
    1024: { slidesPerView: 3, spaceBetween: 32 },
  },
  cases: {
    0: { slidesPerView: 1.1, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 32 },
  },
  reviews: {
    0: { slidesPerView: 1.1, spaceBetween: 16 },
    768: { slidesPerView: 2, spaceBetween: 32 },
    1280: { slidesPerView: 3, spaceBetween: 32 },
  },
};

function initCarousels() {
  if (typeof Swiper === 'undefined') return;

  document.querySelectorAll('[data-carousel]').forEach((el) => {
    const key = el.dataset.carousel;
    new Swiper(el, {
      grabCursor: true,
      rewind: true,
      speed: 600,
      watchOverflow: true,
      breakpoints: CAROUSELS[key],
      autoplay: prefersReducedMotion ? false : {
        delay: 5000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      keyboard: { enabled: true, onlyInViewport: true },
      navigation: {
        prevEl: `[data-carousel-prev="${key}"]`,
        nextEl: `[data-carousel-next="${key}"]`,
      },
      pagination: {
        el: `[data-carousel-pagination="${key}"]`,
        clickable: true,
      },
      a11y: {
        prevSlideMessage: I18N.prevSlide,
        nextSlideMessage: I18N.nextSlide,
        paginationBulletMessage: I18N.goToSlide,
      },
    });
  });
}

/* ---------- Branch "open now" badges (Riyadh time) ---------- */
function initOpenStatus() {
  const badges = document.querySelectorAll('[data-open-status]');
  if (!badges.length) return;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    weekday: 'short',
    hour: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(new Date());
  const day = parts.find((p) => p.type === 'weekday').value;
  const hour = Number(parts.find((p) => p.type === 'hour').value);
  // Saturday – Thursday, 9:00 AM – 10:00 PM
  const isOpen = day !== 'Fri' && hour >= 9 && hour < 22;

  badges.forEach((badge) => {
    badge.classList.toggle('is-closed', !isOpen);
    const label = badge.querySelector('[data-open-label]');
    if (label) label.textContent = isOpen ? I18N.openNow : I18N.closedNow;
  });
}

/* ---------- Toast message ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span class="material-symbols-outlined">check_circle</span><span></span>`;
  toast.lastElementChild.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => toast.classList.remove('is-visible'), 4500);
}

/* ---------- Star rating input ---------- */
function paintRating(container, value) {
  container.querySelectorAll('[data-value]').forEach((star) => {
    star.classList.toggle('is-off', Number(star.dataset.value) > value);
  });
  const label = container.parentElement.querySelector('[data-rating-label]');
  if (label) label.textContent = `(${value.toFixed(1)} ${I18N.ratings[value - 1]})`;
}

function setRating(container, value) {
  container.querySelector('input[name="rating"]').value = value;
  container.querySelectorAll('[data-value]').forEach((star) => {
    star.setAttribute('aria-pressed', String(Number(star.dataset.value) === value));
  });
  paintRating(container, value);
}

function initRating() {
  document.querySelectorAll('[data-rating]').forEach((container) => {
    const current = () => Number(container.querySelector('input[name="rating"]').value);
    container.querySelectorAll('[data-value]').forEach((star) => {
      star.addEventListener('click', () => setRating(container, Number(star.dataset.value)));
      star.addEventListener('mouseenter', () => paintRating(container, Number(star.dataset.value)));
    });
    container.addEventListener('mouseleave', () => paintRating(container, current()));
  });
}

/* ---------- Forms (front-end only, no backend yet) ---------- */
function initForms() {
  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast(I18N.reviewThanks);
      reviewForm.reset();
      const rating = reviewForm.querySelector('[data-rating]');
      if (rating) setRating(rating, 5);
    });
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    // Pre-select the service when coming from a service card (contact.html?service=implants)
    const service = new URLSearchParams(window.location.search).get('service');
    const select = contactForm.querySelector('select[name="service"]');
    if (service && select && select.querySelector(`option[value="${CSS.escape(service)}"]`)) {
      select.value = service;
    }

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast(I18N.contactThanks);
      contactForm.reset();
    });
  }
}

/* ---------- Branch map switcher (contact page) ---------- */
function initBranchMap() {
  const map = document.getElementById('branch-map');
  if (!map) return;

  const buttons = document.querySelectorAll('[data-map-query]');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      map.src = `https://maps.google.com/maps?q=${encodeURIComponent(btn.dataset.mapQuery)}&z=15&output=embed`;
      buttons.forEach((b) => {
        const active = b === btn;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initSiteLinks();
  initMobileMenu();
  initScrollSpy();
  initCarousels();
  initOpenStatus();
  initRating();
  initForms();
  initBranchMap();
});

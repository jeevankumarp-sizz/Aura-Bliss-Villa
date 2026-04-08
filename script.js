/* ============================================================
   AURA BLISS VILLA — Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────── HERO LOAD ANIMATION ───────────
  const hero = document.querySelector('.hero');
  if (hero) {
    requestAnimationFrame(() => {
      hero.classList.add('loaded');
    });
  }

  // ─────────── SCROLL REVEAL (Intersection Observer) ───────────
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─────────── NAVBAR SCROLL BEHAVIOR ───────────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = scrollY;
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // ─────────── SMOOTH SCROLL FOR NAV LINKS ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Close mobile nav if open
        closeMobileNav();
      }
    });
  });

  // ─────────── MOBILE NAVIGATION ───────────
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');

  function openMobileNav() {
    hamburger.classList.add('active');
    mobileNav.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    hamburger.classList.remove('active');
    mobileNav.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  // Close mobile nav on link click
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });
  }

  // ─────────── CAROUSEL: SPACES ───────────
  const spacesCarousel = document.getElementById('spacesCarousel');
  const spacesPrev = document.getElementById('spacesPrev');
  const spacesNext = document.getElementById('spacesNext');

  if (spacesCarousel && spacesPrev && spacesNext) {
    const scrollAmount = 400;

    spacesPrev.addEventListener('click', () => {
      spacesCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    spacesNext.addEventListener('click', () => {
      spacesCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Touch/swipe support is native via scroll-snap
  }

  // ─────────── CAROUSEL: REVIEWS ───────────
  const reviewsCarousel = document.getElementById('reviewsCarousel');
  const reviewsPrev = document.getElementById('reviewsPrev');
  const reviewsNext = document.getElementById('reviewsNext');

  if (reviewsCarousel && reviewsPrev && reviewsNext) {
    const scrollAmount = 400;

    reviewsPrev.addEventListener('click', () => {
      reviewsCarousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    reviewsNext.addEventListener('click', () => {
      reviewsCarousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // ─────────── GALLERY LIGHTBOX ───────────
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxCounter = document.getElementById('lightboxCounter');

  let currentImageIndex = 0;
  const galleryImages = [];

  // Collect all gallery image sources
  galleryItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (img) {
      galleryImages.push({
        src: img.src,
        alt: img.alt
      });

      item.addEventListener('click', () => {
        openLightbox(index);
      });
    }
  });

  function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxImage() {
    if (galleryImages[currentImageIndex]) {
      lightboxImg.src = galleryImages[currentImageIndex].src;
      lightboxImg.alt = galleryImages[currentImageIndex].alt;
      lightboxCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
    }
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
  }

  function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // Close lightbox on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
        closeLightbox();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightbox();
        break;
      case 'ArrowRight':
        nextImage();
        break;
      case 'ArrowLeft':
        prevImage();
        break;
    }
  });

  // ─────────── PARALLAX-LITE HERO ───────────
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;

      if (scrollY <= heroHeight) {
        const parallaxOffset = scrollY * 0.25;
        heroBg.style.transform = `scale(1.05) translateY(${parallaxOffset}px)`;
      }
    }, { passive: true });
  }

  // ─────────── NAVBAR ACTIVE LINK TRACKING ───────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.opacity = '';
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.style.opacity = '1';
          }
        });
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-80px 0px -50% 0px'
  });

  sections.forEach(section => sectionObserver.observe(section));

  // ─────────── REVIEWS AUTO-SCROLL ───────────
  if (reviewsCarousel) {
    let autoScrollInterval;
    let userInteracted = false;

    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (userInteracted) return;

        const maxScroll = reviewsCarousel.scrollWidth - reviewsCarousel.clientWidth;
        if (reviewsCarousel.scrollLeft >= maxScroll - 10) {
          reviewsCarousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          reviewsCarousel.scrollBy({ left: 400, behavior: 'smooth' });
        }
      }, 5000);
    }

    // Pause on hover or touch
    reviewsCarousel.addEventListener('mouseenter', () => { userInteracted = true; });
    reviewsCarousel.addEventListener('mouseleave', () => { userInteracted = false; });
    reviewsCarousel.addEventListener('touchstart', () => { userInteracted = true; }, { passive: true });
    reviewsCarousel.addEventListener('touchend', () => {
      setTimeout(() => { userInteracted = false; }, 3000);
    }, { passive: true });

    startAutoScroll();
  }

  // ─────────── COUNTER ANIMATION FOR RATINGS ───────────
  const ratingNumbers = document.querySelectorAll('.cat-score, .big-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.textContent);
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 30;
        const isDecimal = target % 1 !== 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? current.toFixed(1) : Math.ceil(current).toString();
        }, 40);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  ratingNumbers.forEach(el => counterObserver.observe(el));

});

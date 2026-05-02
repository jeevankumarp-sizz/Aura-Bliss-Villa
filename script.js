
/* ============================================================
   AURA BLISS VILLA — Premium Interactions & Animations
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────── PRELOADER ───────────
  const preloader = document.getElementById('preloader');
  
  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) {
        preloader.classList.add('loaded');
      }
      // Trigger hero animation after preloader
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.classList.add('loaded');
      }
    }, 1800);
  });

  // Fallback: remove preloader after 3s even if not fully loaded
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('loaded')) {
      preloader.classList.add('loaded');
      const hero = document.querySelector('.hero');
      if (hero) hero.classList.add('loaded');
    }
  }, 3500);

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
    threshold: 0.08,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ─────────── NAVBAR SCROLL BEHAVIOR ───────────
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  function handleNavScroll() {
    const scrollY = window.scrollY;
    if (scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
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
  const spacesDots = document.getElementById('spacesDots');

  if (spacesCarousel && spacesPrev && spacesNext) {
    const cards = spacesCarousel.querySelectorAll('.space-card');
    let currentSpaceIndex = 0;

    // Create dots
    if (spacesDots) {
      cards.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to space ${i + 1}`);
        dot.addEventListener('click', () => scrollToCard(i));
        spacesDots.appendChild(dot);
      });
    }

    function scrollToCard(index) {
      const card = cards[index];
      if (!card) return;
      const scrollLeft = card.offsetLeft - spacesCarousel.offsetLeft - 8;
      spacesCarousel.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      currentSpaceIndex = index;
      updateDots();
    }

    function updateDots() {
      if (!spacesDots) return;
      const dots = spacesDots.querySelectorAll('.carousel-dot');
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSpaceIndex);
      });
    }

    const getScrollAmount = () => {
      const card = spacesCarousel.querySelector('.space-card');
      if (card) return card.offsetWidth + 24;
      return 440;
    };

    spacesPrev.addEventListener('click', () => {
      currentSpaceIndex = Math.max(0, currentSpaceIndex - 1);
      scrollToCard(currentSpaceIndex);
    });

    spacesNext.addEventListener('click', () => {
      currentSpaceIndex = Math.min(cards.length - 1, currentSpaceIndex + 1);
      scrollToCard(currentSpaceIndex);
    });

    // Update dots on scroll
    spacesCarousel.addEventListener('scroll', () => {
      const scrollLeft = spacesCarousel.scrollLeft;
      const cardWidth = getScrollAmount();
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentSpaceIndex && newIndex >= 0 && newIndex < cards.length) {
        currentSpaceIndex = newIndex;
        updateDots();
      }
    }, { passive: true });
  }

  // ─────────── CAROUSEL: REVIEWS ───────────
  const reviewsCarousel = document.getElementById('reviewsCarousel');
  const reviewsPrev = document.getElementById('reviewsPrev');
  const reviewsNext = document.getElementById('reviewsNext');

  if (reviewsCarousel && reviewsPrev && reviewsNext) {
    const getScrollAmount = () => {
      const card = reviewsCarousel.querySelector('.review-card');
      if (card) return card.offsetWidth + 24;
      return 440;
    };

    reviewsPrev.addEventListener('click', () => {
      reviewsCarousel.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    reviewsNext.addEventListener('click', () => {
      reviewsCarousel.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
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

  function closeLightboxFn() {
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

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightboxFn);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

  // Close lightbox on backdrop click
  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-content')) {
        closeLightboxFn();
      }
    });
  }

  // Keyboard navigation for lightbox
  document.addEventListener('keydown', (e) => {
    if (!lightbox || !lightbox.classList.contains('active')) return;

    switch (e.key) {
      case 'Escape':
        closeLightboxFn();
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
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg img');

  if (heroBg && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (hero) {
        const heroHeight = hero.offsetHeight;
        if (scrollY <= heroHeight) {
          const parallaxOffset = scrollY * 0.25;
          heroBg.style.transform = `scale(1.08) translateY(${parallaxOffset}px)`;
        }
      }
    }, { passive: true });
  }

  // ─────────── VISUAL BREAK PARALLAX ───────────
  const visualBreakBg = document.querySelector('.visual-break-bg img');
  const visualBreak = document.querySelector('.visual-break');

  if (visualBreakBg && visualBreak && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const rect = visualBreak.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight && rect.bottom > 0) {
        const progress = (windowHeight - rect.top) / (windowHeight + rect.height);
        const offset = (progress - 0.5) * 70;
        visualBreakBg.style.transform = `translateY(${offset}px) scale(1.08)`;
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
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
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
          const card = reviewsCarousel.querySelector('.review-card');
          const scrollDist = card ? card.offsetWidth + 24 : 440;
          reviewsCarousel.scrollBy({ left: scrollDist, behavior: 'smooth' });
        }
      }, 5000);
    }

    // Pause on hover or touch
    reviewsCarousel.addEventListener('mouseenter', () => { userInteracted = true; });
    reviewsCarousel.addEventListener('mouseleave', () => { userInteracted = false; });
    reviewsCarousel.addEventListener('touchstart', () => { userInteracted = true; }, { passive: true });
    reviewsCarousel.addEventListener('touchend', () => {
      setTimeout(() => { userInteracted = false; }, 4000);
    }, { passive: true });

    startAutoScroll();
  }

  // ─────────── COUNTER ANIMATION FOR RATINGS ───────────
  const ratingNumbers = document.querySelectorAll('.breakdown-val, .score-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.textContent);
        if (isNaN(target)) return;

        let current = 0;
        const increment = target / 50;
        const isDecimal = target % 1 !== 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? current.toFixed(1) : Math.ceil(current).toString();
        }, 30);

        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  ratingNumbers.forEach(el => counterObserver.observe(el));

  // ─────────── WHATSAPP BUTTON DELAY ───────────
  const whatsappFloat = document.getElementById('whatsappFloat');
  if (whatsappFloat) {
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.transform = 'scale(0.5) translateY(20px)';
    whatsappFloat.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

    setTimeout(() => {
      whatsappFloat.style.opacity = '1';
      whatsappFloat.style.transform = 'scale(1) translateY(0)';
    }, 3000);
  }

  // ─────────── QUICK BOOK SIDEBAR (Desktop only) ───────────
  const quickBook = document.getElementById('quickBook');
  if (quickBook && window.innerWidth > 1024) {
    const heroSection = document.querySelector('.hero');
    const ctaSection = document.querySelector('.final-cta');

    window.addEventListener('scroll', () => {
      const heroBottom = heroSection ? heroSection.offsetTop + heroSection.offsetHeight : 600;
      const ctaTop = ctaSection ? ctaSection.offsetTop - window.innerHeight * 0.5 : Infinity;
      const scrollY = window.scrollY;

      if (scrollY > heroBottom && scrollY < ctaTop) {
        quickBook.classList.add('visible');
      } else {
        quickBook.classList.remove('visible');
      }
    }, { passive: true });
  }

  // ─────────── SMOOTH CURSOR GLOW (Desktop only) ───────────
  if (window.innerWidth > 1024) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(198, 169, 107, 0.04), transparent 70%);
      pointer-events: none;
      z-index: 0;
      transition: transform 0.3s ease-out;
      will-change: transform;
    `;
    document.body.appendChild(glow);

    let glowX = 0, glowY = 0;
    let currentX = 0, currentY = 0;

    document.addEventListener('mousemove', (e) => {
      glowX = e.clientX - 150;
      glowY = e.clientY - 150;
    }, { passive: true });

    function animateGlow() {
      currentX += (glowX - currentX) * 0.08;
      currentY += (glowY - currentY) * 0.08;
      glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

});

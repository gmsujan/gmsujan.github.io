/**
 * Sujan Gharti Magar — Portfolio JavaScript
 * Handles: custom cursor, nav scroll, typing effect,
 * scroll reveal, skill bar animation, counter animation,
 * project filtering, theme toggle, particles, contact form
 */

/* ===== CUSTOM CURSOR ===== */
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top = mouseY + 'px';
});

// Smooth trail effect using rAF
function animateTrail() {
  trailX += (mouseX - trailX) * 0.15;
  trailY += (mouseY - trailY) * 0.15;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

// Grow cursor on interactive elements
document.querySelectorAll('a, button, .filter-btn, .project-card, .contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '20px';
    cursor.style.height = '20px';
    cursorTrail.style.width = '48px';
    cursorTrail.style.height = '48px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '10px';
    cursor.style.height = '10px';
    cursorTrail.style.width = '32px';
    cursorTrail.style.height = '32px';
  });
});

// Hide cursor when leaving window
document.addEventListener('mouseleave', () => {
  cursor.style.opacity = '0';
  cursorTrail.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursor.style.opacity = '1';
  cursorTrail.style.opacity = '0.5';
});

/* ===== NAVIGATION SCROLL EFFECT ===== */
const nav = document.getElementById('nav');

function onScroll() {
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Back to top button
  const backToTop = document.getElementById('backToTop');
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

/* ===== TYPING EFFECT ===== */
const roles = [
  'Backend Developer',
  '.NET Specialist',
  'PostgreSQL Engineer',
  'Cloud Developer (AWS)',
  'Full Stack Developer',
  'MIT Graduate — Waikato'
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedEl = document.getElementById('typedText');

function typeEffect() {
  const current = roles[roleIndex];

  if (!isDeleting) {
    typedEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      // Pause at end then start deleting
      setTimeout(() => { isDeleting = true; typeEffect(); }, 2000);
      return;
    }
  } else {
    typedEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  }

  const speed = isDeleting ? 60 : 90;
  setTimeout(typeEffect, speed);
}

// Start typing after page load
setTimeout(typeEffect, 800);

/* ===== FLOATING PARTICLES ===== */
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (Math.random() * 3 + 1) + 'px';
    container.appendChild(p);
  }
}
createParticles();

/* ===== SCROLL REVEAL (Intersection Observer) ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Once visible, trigger skill bars if any
      entry.target.querySelectorAll('.skill-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      // Trigger counters
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        if (!el.dataset.animated) animateCounter(el);
      });
    }
  });
}, {
  threshold: 0.15,
  rootMargin: '0px 0px -60px 0px'
});

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
  revealObserver.observe(el);
});

// Also trigger skills directly when skills section is visible
const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        setTimeout(() => {
          bar.style.width = bar.dataset.width + '%';
        }, i * 100);
      });
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-group').forEach(el => skillsObserver.observe(el));

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  el.dataset.animated = true;
  const target = parseInt(el.dataset.count);
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;

  const update = () => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + (target >= 10 ? '+' : '+');
    if (current < target) requestAnimationFrame(update);
    else el.textContent = target + '+';
  };

  requestAnimationFrame(update);
}

// Observe hero stats
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(el => {
        if (!el.dataset.animated) animateCounter(el);
      });
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.hero-stats').forEach(el => heroObserver.observe(el));

/* ===== PROJECT FILTERING ===== */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.bento-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.category.split(' ');
      if (filter === 'all' || categories.includes(filter)) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ===== THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('sgm-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('sgm-theme', next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  themeToggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '◑' : '◐';
}

/* ===== CONTACT FORM — FORMSPREE ===== */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSpinner = document.getElementById('formSpinner');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Basic client-side validation
    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) {
      // Shake the empty fields
      [['name', name], ['email', email], ['message', message]].forEach(([id, val]) => {
        if (!val) {
          const el = document.getElementById(id);
          el.style.borderColor = 'var(--accent-3)';
          el.style.animation = 'shake 0.4s ease';
          setTimeout(() => { el.style.animation = ''; el.style.borderColor = ''; }, 500);
        }
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const el = document.getElementById('email');
      el.style.borderColor = 'var(--accent-3)';
      setTimeout(() => { el.style.borderColor = ''; }, 2000);
      return;
    }

    // Check Formspree ID has been set
    const action = contactForm.getAttribute('action');
    if (action.includes('YOUR_FORM_ID')) {
      formError.hidden = false;
      formError.querySelector('p').textContent =
        'Form not yet configured — please email sujanmagar6861@gmail.com directly.';
      return;
    }

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.querySelector('.cform-submit-text').textContent = 'Sending...';
    submitBtn.querySelector('.cform-submit-icon').hidden = true;
    formSpinner.hidden = false;
    formSuccess.hidden = true;
    formError.hidden   = true;

    try {
      const response = await fetch(action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(contactForm)
      });

      if (response.ok) {
        // Success
        contactForm.reset();
        formSuccess.hidden = false;
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const data = await response.json();
        throw new Error(data?.errors?.map(e => e.message).join(', ') || 'Submission failed');
      }
    } catch (err) {
      formError.hidden = false;
      console.error('Form error:', err);
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.querySelector('.cform-submit-text').textContent = 'Send Message';
      submitBtn.querySelector('.cform-submit-icon').hidden = false;
      formSpinner.hidden = true;
    }
  });
}

/* ===== SMOOTH SCROLL for all anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ===== ACTIVE NAV LINK HIGHLIGHT ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => activeObserver.observe(s));

/* ===== SUBTLE TILT EFFECT on bento cards ===== */
document.querySelectorAll('.bento-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    card.style.transform = `rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.5s ease, border-color 0.3s, box-shadow 0.3s';
  });

  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.1s ease, border-color 0.3s, box-shadow 0.3s';
  });
});

/* ===== HERO SECTION INITIAL ANIMATIONS ===== */
// Stagger the reveal items in the hero on page load
window.addEventListener('load', () => {
  const heroReveals = document.querySelectorAll('.hero .reveal');
  heroReveals.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 200 + i * 150);
  });
});

console.log('%c Sujan Gharti Magar — Portfolio', 'color: #a5ff64; font-size: 1.2rem; font-weight: bold;');
console.log('%c Built with HTML · CSS · JS', 'color: #64d4ff; font-size: 0.9rem;');
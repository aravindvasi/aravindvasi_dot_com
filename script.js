/* =========================================================
   Aravind V. A. — Portfolio JS
   ========================================================= */

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16)
  };
}

function getCssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* ---------- Footer dates ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('updated').textContent = new Date().toLocaleDateString('en-GB', {
  year: 'numeric', month: 'short', day: '2-digit'
});

/* ---------- Theme toggle ---------- */
const root = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ---------- Scroll progress ---------- */
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.transform = `scaleX(${Math.min(pct, 1)})`;
}, { passive: true });

/* ---------- Nav ---------- */
const navEl      = document.querySelector('.nav');
const navToggleBtn = document.querySelector('.nav-toggle');
const navLinksEl = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

navToggleBtn.addEventListener('click', () => {
  navLinksEl.classList.toggle('open');
});

navLinksEl.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

/* ---------- Active section tracking ---------- */
const sections   = document.querySelectorAll('.section[id]');
const navAnchors = Array.from(navLinksEl.querySelectorAll('a'));

const sectionIO = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => sectionIO.observe(s));

/* ---------- Reveal on scroll (staggered) ---------- */
const revealEls = document.querySelectorAll('.reveal');

revealEls.forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  el.style.transitionDelay = (siblings.indexOf(el) * 80) + 'ms';
});

const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealIO.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealIO.observe(el));

/* ---------- Typewriter tagline ---------- */
const taglineEl   = document.querySelector('.hero-tagline');
const taglineText = taglineEl.dataset.text || taglineEl.textContent.trim();
taglineEl.textContent = '';

let tIdx = 0;
function typeNext() {
  if (tIdx < taglineText.length) {
    taglineEl.textContent += taglineText[tIdx++];
    setTimeout(typeNext, 45 + Math.random() * 35);
  }
}
setTimeout(typeNext, 2000);

/* ---------- Nav hover scramble ---------- */
const SCHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

navAnchors.forEach(a => {
  const orig = a.textContent;
  let stimer = null;

  a.addEventListener('mouseenter', () => {
    let frame = 0;
    const total = orig.length * 4;
    clearInterval(stimer);
    stimer = setInterval(() => {
      const resolved = Math.floor((frame / total) * orig.length);
      a.textContent = orig.split('').map((ch, i) =>
        i < resolved ? ch : SCHARS[Math.floor(Math.random() * SCHARS.length)].toLowerCase()
      ).join('');
      frame++;
      if (frame > total) { a.textContent = orig; clearInterval(stimer); }
    }, 22);
  });

  a.addEventListener('mouseleave', () => {
    clearInterval(stimer);
    a.textContent = orig;
  });
});

/* ---------- Magnetic links ---------- */
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r  = el.getBoundingClientRect();
    const mx = e.clientX - r.left - r.width  / 2;
    const my = e.clientY - r.top  - r.height / 2;
    el.style.transition = '';
    el.style.transform  = `translate(${mx * 0.3}px, ${my * 0.3}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1)';
    el.style.transform  = '';
    setTimeout(() => { el.style.transition = ''; }, 600);
  });
});

/* ---------- 3D card tilt + cursor glow ---------- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x  = (e.clientX - rect.left) / rect.width;
    const y  = (e.clientY - rect.top)  / rect.height;
    const rx = (y - 0.5) * -10;
    const ry = (x - 0.5) *  10;
    card.style.transition = 'border-color 0.4s ease';
    card.style.transform  = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.5s ease, border-color 0.4s ease';
    card.style.transform  = '';
    setTimeout(() => { card.style.transition = ''; }, 500);
  });
});

/* ---------- Particles (theme-aware + mouse-reactive) ---------- */
const canvas = document.getElementById('particles');
const ctx    = canvas.getContext('2d');
let w, h;
let mouseX = -9999;
let mouseY = -9999;

const COUNT      = window.innerWidth < 880 ? 35 : 70;
const LINK_DIST  = 140;
const MOUSE_DIST = 180;
const REPEL_DIST = 100;
const MAX_SPD    = 1.5;

function resize() {
  w = canvas.width  = window.innerWidth  * devicePixelRatio;
  h = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
resize();
window.addEventListener('resize', resize);

window.addEventListener('mousemove', e => {
  mouseX = e.clientX * devicePixelRatio;
  mouseY = e.clientY * devicePixelRatio;
}, { passive: true });

class Particle {
  constructor() {
    this.x  = Math.random() * w;
    this.y  = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.3 * devicePixelRatio;
    this.vy = (Math.random() - 0.5) * 0.3 * devicePixelRatio;
    this.r  = (Math.random() * 1.2 + 0.4) * devicePixelRatio;
  }
  update() {
    const dx = this.x - mouseX;
    const dy = this.y - mouseY;
    const d2 = dx * dx + dy * dy;
    const rp = REPEL_DIST * devicePixelRatio;
    if (d2 < rp * rp && d2 > 0) {
      const d = Math.sqrt(d2);
      const f = (1 - d / rp) * 0.6;
      this.vx += (dx / d) * f;
      this.vy += (dy / d) * f;
    }
    const spd = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    const cap = MAX_SPD * devicePixelRatio;
    if (spd > cap) { this.vx = this.vx / spd * cap; this.vy = this.vy / spd * cap; }
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw(r, g, b) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${r},${g},${b},0.55)`;
    ctx.fill();
  }
}

const pts = Array.from({ length: COUNT }, () => new Particle());
let lastAccent = '';
let accentRgb  = { r: 196, g: 255, b: 62 };

function animateParts() {
  const accent = getCssVar('--accent');
  if (accent !== lastAccent) {
    lastAccent = accent;
    accentRgb  = hexToRgb(accent);
  }
  const { r, g, b } = accentRgb;

  ctx.clearRect(0, 0, w, h);

  const linkPx  = LINK_DIST  * devicePixelRatio;
  const mousePx = MOUSE_DIST * devicePixelRatio;

  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx   = pts[i].x - pts[j].x;
      const dy   = pts[i].y - pts[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < linkPx) {
        ctx.globalAlpha = (1 - dist / linkPx) * 0.18;
        ctx.strokeStyle = `rgb(${r},${g},${b})`;
        ctx.lineWidth   = 0.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.stroke();
      }
    }
  }

  pts.forEach(p => {
    const dx   = p.x - mouseX;
    const dy   = p.y - mouseY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < mousePx) {
      ctx.globalAlpha = (1 - dist / mousePx) * 0.4;
      ctx.strokeStyle = `rgb(${r},${g},${b})`;
      ctx.lineWidth   = 0.8 * devicePixelRatio;
      ctx.beginPath();
      ctx.moveTo(mouseX, mouseY);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  });

  ctx.globalAlpha = 1;
  pts.forEach(p => { p.update(); p.draw(r, g, b); });

  requestAnimationFrame(animateParts);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animateParts();
}

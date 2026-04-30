/* =========================================================
   Aravind V. A. — Portfolio JS
   ========================================================= */

/* ---------- Year + last updated ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
document.getElementById('updated').textContent = new Date().toLocaleDateString('en-GB', {
  year: 'numeric', month: 'short', day: '2-digit'
});

/* ---------- Nav: scrolled state + mobile toggle ---------- */
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* ---------- Reveal on scroll ---------- */
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

reveals.forEach(el => io.observe(el));

/* ---------- Quantum / signal particles ---------- */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let w, h;
const PARTICLE_COUNT = window.innerWidth < 880 ? 35 : 70;
const LINK_DIST = 140;

function resize() {
  w = canvas.width = window.innerWidth * devicePixelRatio;
  h = canvas.height = window.innerHeight * devicePixelRatio;
  canvas.style.width = window.innerWidth + 'px';
  canvas.style.height = window.innerHeight + 'px';
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.vx = (Math.random() - 0.5) * 0.3 * devicePixelRatio;
    this.vy = (Math.random() - 0.5) * 0.3 * devicePixelRatio;
    this.r = (Math.random() * 1.2 + 0.4) * devicePixelRatio;
  }
  step() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(196, 255, 62, 0.55)';
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function tick() {
  ctx.clearRect(0, 0, w, h);

  // Lines
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const linkPx = LINK_DIST * devicePixelRatio;
      if (dist < linkPx) {
        const opacity = (1 - dist / linkPx) * 0.18;
        ctx.strokeStyle = `rgba(196, 255, 62, ${opacity})`;
        ctx.lineWidth = 0.5 * devicePixelRatio;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Points
  particles.forEach(p => { p.step(); p.draw(); });

  requestAnimationFrame(tick);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  tick();
}

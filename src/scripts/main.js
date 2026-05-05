import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './particles.js';

gsap.registerPlugin(ScrollTrigger);

// ---------- Lenis smooth scroll ----------
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0);

// ---------- Footer dates ----------
const yearEl = document.getElementById('year');
const updatedEl = document.getElementById('updated');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (updatedEl) updatedEl.textContent = new Date().toLocaleDateString('en-GB', {
  year: 'numeric', month: 'short', day: '2-digit',
});

// ---------- Theme toggle ----------
const root = document.documentElement;
document.getElementById('theme-toggle')?.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ---------- Scroll progress ----------
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  lenis.on('scroll', ({ progress }) => {
    progressBar.style.transform = `scaleX(${progress})`;
  });
}

// ---------- Nav ----------
const navEl = document.querySelector('.nav');
const navLinksEl = document.querySelector('.nav-links');
const navToggleBtn = document.querySelector('.nav-toggle');

if (navEl) {
  lenis.on('scroll', ({ scroll }) => {
    navEl.classList.toggle('scrolled', scroll > 40);
  });
}

navToggleBtn?.addEventListener('click', () => {
  navLinksEl?.classList.toggle('open');
});

navLinksEl?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinksEl.classList.remove('open'));
});

// ---------- Active section tracking ----------
const navAnchors = Array.from(navLinksEl?.querySelectorAll('a') ?? []);

function setActive(id) {
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });
}

document.querySelectorAll('.section[id]').forEach(section => {
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 40%',
    onEnter: () => setActive(section.id),
    onEnterBack: () => setActive(section.id),
  });
});

// ---------- Initial states (set before any animation so content is invisible until GSAP runs) ----------
gsap.set('.hero-meta', { opacity: 0, y: 20 });
gsap.set('.hero-title .word', { opacity: 0, y: 80 });
gsap.set('.hero-tagline', { opacity: 0, y: 20 });
gsap.set('.hero-scroll', { opacity: 0, y: 20 });
gsap.set('.reveal', { opacity: 0, y: 40 });

// ---------- Hero entrance ----------

const heroTl = gsap.timeline({ delay: 0.15 });
heroTl
  .to('.hero-meta', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' })
  .to('.hero-title .word', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.15 }, '-=0.4')
  .to('.hero-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
  .to('.hero-scroll', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5');

// ---------- Scroll reveal ----------
document.querySelectorAll('.reveal').forEach(el => {
  const siblings = Array.from(el.parentElement.querySelectorAll('.reveal'));
  const delay = siblings.indexOf(el) * 0.08;

  gsap.to(el, {
    scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    opacity: 1,
    y: 0,
    duration: 0.9,
    delay,
    ease: 'power2.out',
  });
});

// ---------- Typewriter tagline ----------
const taglineEl = document.querySelector('.hero-tagline');
if (taglineEl) {
  const taglineText = taglineEl.dataset.text || '';
  taglineEl.textContent = '';
  let tIdx = 0;
  function typeNext() {
    if (tIdx < taglineText.length) {
      taglineEl.textContent += taglineText[tIdx++];
      setTimeout(typeNext, 45 + Math.random() * 35);
    }
  }
  setTimeout(typeNext, 1200);
}

// ---------- Nav hover scramble ----------
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

// ---------- Magnetic links ----------
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    gsap.to(el, {
      x: (e.clientX - r.left - r.width / 2) * 0.3,
      y: (e.clientY - r.top - r.height / 2) * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
  });
});

// ---------- Project card tilt + cursor glow ----------
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    gsap.to(card, {
      rotateX: (y - 0.5) * -10,
      rotateY: (x - 0.5) * 10,
      y: -4,
      transformPerspective: 900,
      duration: 0.3,
      ease: 'power2.out',
    });
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  });

  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotateX: 0, rotateY: 0, y: 0, duration: 0.5, ease: 'power2.out' });
  });
});

// ---------- Project card click ----------
document.querySelectorAll('.project-card[data-href]').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('a')) return;
    window.location.href = card.dataset.href;
  });
});

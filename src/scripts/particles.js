if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // skip entirely for users who prefer reduced motion
} else {
  initParticles();
}

function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const COUNT     = window.innerWidth < 880 ? 35 : 70;
  const LINK_DIST  = 140;
  const MOUSE_DIST = 180;
  const REPEL_DIST = 100;
  const MAX_SPD    = 1.5;

  let w, h, mouseX = -9999, mouseY = -9999;

  function resize() {
    w = canvas.width  = window.innerWidth  * devicePixelRatio;
    h = canvas.height = window.innerHeight * devicePixelRatio;
    canvas.style.width  = window.innerWidth  + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

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
      ctx.fillStyle = `rgba(${r},${g},${b},0.85)`;
      ctx.fill();
    }
  }

  const pts = Array.from({ length: COUNT }, () => new Particle());

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  let lastAccent = '';
  let rgb = { r: 196, g: 255, b: 62 };

  function tick() {
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    if (accent !== lastAccent) { lastAccent = accent; rgb = hexToRgb(accent); }
    const { r, g, b } = rgb;

    ctx.clearRect(0, 0, w, h);

    const linkPx  = LINK_DIST  * devicePixelRatio;
    const mousePx = MOUSE_DIST * devicePixelRatio;

    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx   = pts[i].x - pts[j].x;
        const dy   = pts[i].y - pts[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkPx) {
          ctx.globalAlpha = (1 - dist / linkPx) * 0.45;
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

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

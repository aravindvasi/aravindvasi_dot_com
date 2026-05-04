(function () {
  'use strict';

  const SWING_MS     = 820;
  const CONTACT_MS   = 90;
  const INITIAL_DELAY = 400;
  const MAX_ANGLE    = Math.PI / 4;           // 45°
  const STRING_LEN   = 114;
  const PIVOT_Y      = 54;
  const BALL_R       = 12;
  const BALL_X       = [112, 136, 160, 184, 208];
  const CYCLE        = SWING_MS * 4 + CONTACT_MS * 2; // 3460 ms

  const svg = document.getElementById('loader-svg');
  const NS  = 'http://www.w3.org/2000/svg';

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  const C_BALL   = cssVar('--accent')   || '#c4ff3e';
  const C_STRING = cssVar('--ink-faint') || '#4a4a52';
  const C_FRAME  = cssVar('--ink-dim')  || '#9a9aa0';

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  }

  // Shadow
  svg.appendChild(el('ellipse', { cx: 160, cy: 222, rx: 65, ry: 5, fill: 'rgba(0,0,0,0.25)' }));

  // Frame bar
  svg.appendChild(el('rect', { x: 30, y: 38, width: 260, height: 8, rx: 2, fill: C_FRAME }));

  // Pivot dots
  BALL_X.forEach(px => {
    svg.appendChild(el('circle', { cx: px, cy: PIVOT_Y, r: 2.5, fill: C_FRAME }));
  });

  // Strings (drawn before balls so balls sit on top)
  const strings = BALL_X.map(px => {
    const line = el('line', {
      x1: px, y1: PIVOT_Y,
      x2: px, y2: PIVOT_Y + STRING_LEN,
      stroke: C_STRING, 'stroke-width': 1
    });
    svg.appendChild(line);
    return line;
  });

  // Balls
  const balls = BALL_X.map(px => {
    const circle = el('circle', {
      cx: px, cy: PIVOT_Y + STRING_LEN,
      r: BALL_R, fill: C_BALL
    });
    svg.appendChild(circle);
    return circle;
  });

  function setPos(idx, angle) {
    const px = BALL_X[idx];
    const bx = px + STRING_LEN * Math.sin(angle);
    const by = PIVOT_Y + STRING_LEN * Math.cos(angle);
    balls[idx].setAttribute('cx', bx);
    balls[idx].setAttribute('cy', by);
    strings[idx].setAttribute('x2', bx);
    strings[idx].setAttribute('y2', by);
  }

  // Cosine easing: 1→0 (deceleration into rest)
  function easeIn(t)  { return Math.cos(t * Math.PI / 2); }
  // Sine easing: 0→1 (acceleration away from rest)
  function easeOut(t) { return Math.sin(t * Math.PI / 2); }

  // Phase boundaries within one cycle
  const P1 = SWING_MS;
  const P2 = SWING_MS + CONTACT_MS;
  const P3 = 2 * SWING_MS + CONTACT_MS;
  const P4 = 3 * SWING_MS + CONTACT_MS;
  const P5 = 3 * SWING_MS + 2 * CONTACT_MS;

  function getState(elapsed) {
    const t = elapsed % CYCLE;

    if (t < P1) {
      // Ball 1 swings in: −45° → 0°
      return { a1: -MAX_ANGLE * easeIn(t / SWING_MS), a5: 0 };
    } else if (t < P2) {
      // Contact delay
      return { a1: 0, a5: 0 };
    } else if (t < P3) {
      // Ball 5 swings out: 0° → +45°
      return { a1: 0, a5: MAX_ANGLE * easeOut((t - P2) / SWING_MS) };
    } else if (t < P4) {
      // Ball 5 swings in: +45° → 0°
      return { a1: 0, a5: MAX_ANGLE * easeIn((t - P3) / SWING_MS) };
    } else if (t < P5) {
      // Contact delay
      return { a1: 0, a5: 0 };
    } else {
      // Ball 1 swings out: 0° → −45°
      return { a1: -MAX_ANGLE * easeOut((t - P5) / SWING_MS), a5: 0 };
    }
  }

  // Set initial static position before animation begins
  setPos(0, -MAX_ANGLE);

  let startTime    = null;
  let animStart    = null;
  let rafId;

  function tick(ts) {
    if (!startTime) startTime = ts;

    if (ts - startTime < INITIAL_DELAY) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    if (!animStart) animStart = ts;
    const { a1, a5 } = getState(ts - animStart);
    setPos(0, a1);
    setPos(4, a5);

    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    loader.classList.add('loader-out');
    setTimeout(() => {
      cancelAnimationFrame(rafId);
      loader.remove();
    }, 500);
  });
})();

// ============================================
// WALY DIOUF — INTERACTIVE JS
// ============================================

// 1. CANVAS STARFIELD
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], mouse = { x: 0, y: 0 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildStars(); });

  function buildStars() {
    stars = [];
    const count = Math.floor((W * H) / 5500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        speed: Math.random() * 0.12 + 0.03,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        ox: 0, oy: 0
      });
    }
  }
  buildStars();

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;
    const cx = W / 2, cy = H / 2;
    stars.forEach(s => {
      const tx = (mouse.x - cx) * 0.005 * s.r;
      const ty = (mouse.y - cy) * 0.005 * s.r;
      s.ox += (tx - s.ox) * 0.03;
      s.oy += (ty - s.oy) * 0.03;
      s.twinkle += s.twinkleSpeed;
      const alpha = 0.25 + Math.sin(s.twinkle) * 0.3;
      ctx.beginPath();
      ctx.arc(s.x + s.ox, s.y + s.oy, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,240,${alpha})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > H + 2) { s.y = -2; s.x = Math.random() * W; }
    });
    if (frame % 280 === 0) shootingStar();
    requestAnimationFrame(draw);
  }
  draw();

  function shootingStar() {
    const sx = Math.random() * W;
    const sy = Math.random() * H * 0.4;
    const len = 90 + Math.random() * 110;
    const angle = Math.PI / 5;
    let p = 0;
    const anim = setInterval(() => {
      p += 0.05;
      if (p >= 1) return clearInterval(anim);
      const x = sx + Math.cos(angle) * len * p;
      const y = sy + Math.sin(angle) * len * p;
      const alpha = Math.sin(p * Math.PI);
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(angle)*22, y - Math.sin(angle)*22);
      ctx.lineTo(x, y);
      const g = ctx.createLinearGradient(x-22, y-22, x, y);
      g.addColorStop(0, 'rgba(0,229,255,0)');
      g.addColorStop(1, `rgba(0,229,255,${alpha * 0.85})`);
      ctx.strokeStyle = g;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }, 16);
  }
})();


// 2. CUSTOM CURSOR
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const trail  = document.getElementById('cursor-trail');
  if (!cursor || !trail) return;

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
    trail.style.left  = e.clientX + 'px';
    trail.style.top   = e.clientY + 'px';
  });

  document.querySelectorAll('a, button, .pill, .proj-card, .flip-card, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('expanded'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('expanded'));
  });
})();


// 3. MAGNETIC BUTTONS
document.querySelectorAll('[data-magnetic]').forEach(el => {
  el.addEventListener('mousemove', e => {
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.28;
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => { el.style.transform = ''; });
});


// 4. NAVBAR SCROLL
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 60));


// 5. HAMBURGER
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => navLinks.classList.remove('open')));


// 6. TYPEWRITER
(function initTypewriter() {
  const el = document.getElementById('typed-role');
  if (!el) return;
  const phrases = [
    'Aspiring Space Operations Officer',
    'Cybersecurity Professional',
    'AFROTC Cadet — Space Force EA',
    'IT Student at NJIT',
    'Building Secure Systems'
  ];
  let pi = 0, ci = 0, deleting = false, wait = false;
  function type() {
    if (wait) { wait = false; return setTimeout(type, 1400); }
    const phrase = phrases[pi];
    if (!deleting) {
      el.textContent = phrase.slice(0, ++ci);
      if (ci === phrase.length) { deleting = true; wait = true; }
      setTimeout(type, 65);
    } else {
      el.textContent = phrase.slice(0, --ci);
      if (ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; }
      setTimeout(type, 32);
    }
  }
  setTimeout(type, 900);
})();


// 7. SCROLL REVEAL WITH STAGGER
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.reveal-child').forEach((child, i) => {
      setTimeout(() => child.classList.add('visible'), i * 100);
    });
    revealObs.unobserve(entry.target);
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal-section').forEach(s => revealObs.observe(s));


// 8. ANIMATED COUNTERS
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const numEl = el.querySelector('.stat-num');
      let current = 0;
      const inc = target / 40;
      const timer = setInterval(() => {
        current = Math.min(current + inc, target);
        numEl.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 30);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat[data-count]').forEach(s => obs.observe(s));
})();


// 9. SKILL PILL PROGRESS BARS
(function() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.pill').forEach((pill, i) => {
        setTimeout(() => pill.style.setProperty('--w', (pill.dataset.level || 70) + '%'), i * 60);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.skill-group').forEach(g => obs.observe(g));
})();


// 10. 3D TILT ON PROJECT CARDS
document.querySelectorAll('.proj-card[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top)  / rect.height;
    const rx = (y - 0.5) * -10;
    const ry = (x - 0.5) *  10;
    card.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
    // Glow follows mouse
    card.querySelector('.proj-glow').style.setProperty('--mx', (x * 100) + '%');
    card.querySelector('.proj-glow').style.setProperty('--my', (y * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


// 11. PARALLAX ORBIT SCENE ON MOUSE MOVE
const orbitScene = document.getElementById('orbitScene');
if (orbitScene) {
  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) * 0.008;
    const dy = (e.clientY - cy) * 0.008;
    orbitScene.style.transform = `translate(${dx}px, ${dy}px)`;
  });
}


// 12. FLIP CARDS — touch toggle
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('click', () => card.classList.toggle('flipped'));
  // Add hint label
  const hint = document.createElement('span');
  hint.className = 'flip-card-hint';
  hint.textContent = 'hover to flip';
  card.querySelector('.flip-front').appendChild(hint);
});


// 13. SMOOTH ANCHOR SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
  });
});


// 14. ACTIVE NAV HIGHLIGHT
const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    document.querySelectorAll('.nav-link').forEach(l => l.style.color = '');
    const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
    if (active) active.style.color = 'var(--cyan)';
  });
}, { threshold: 0.5 });
document.querySelectorAll('section[id]').forEach(s => navObs.observe(s));


// CONSOLE EASTER EGG
console.log('%c🛰️ Waly Diouf — NJIT IT | AFROTC | Space Force EA\nBuilt with HTML, CSS & Vanilla JS', 'color:#00e5ff;font-size:14px;font-weight:bold;');

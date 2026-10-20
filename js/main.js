/* ═══════════════════════════════════════════════
   IMPULZIA — Main JavaScript v1.0
   ═══════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════════════
   1. PARTICLE CANVAS — Hero background
   ══════════════════════════════════════════════ */
(function initCosmicConstellations() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  let nodes = [];
  let shootingStars = [];
  let animId;
  let W, H;
  let mouse = { x: -1000, y: -1000, active: false };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function lerp(a, b, t) { return a + (b - a) * t; }

  function getGradientColor(t, alpha) {
    // #1A73E8 (26, 115, 232) → #00D4AA (0, 212, 170)
    const r = Math.round(lerp(26,   0,  t));
    const g = Math.round(lerp(115, 212, t));
    const b = Math.round(lerp(232, 170, t));
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function initUniverse() {
    // 1. Distant twinkling stars (deep space background)
    stars = [];
    const starCount = Math.min(Math.floor((W * H) / 9000), 110);
    for (let i = 0; i < starCount; i++) {
      const isCyan = Math.random() < 0.25;
      const isBlue = Math.random() < 0.25;
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        size: Math.random() * 1.5 + 0.6,
        baseAlpha: Math.random() * 0.45 + 0.2,
        twinkleSpeed: Math.random() * 0.025 + 0.01,
        twinklePhase: Math.random() * Math.PI * 2,
        color: isCyan ? '0,212,170' : (isBlue ? '120,180,255' : '255,255,255'),
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
      });
    }

    // 2. Constellation nodes (prominent interconnected cosmic web)
    nodes = [];
    const nodeCount = Math.min(Math.floor((W * H) / 12000), 75);
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: Math.random() * 2.4 + 1.2,
        isMajor: Math.random() < 0.35, // larger stars with halo
      });
    }
  }

  const MAX_DIST = 175; // Increased connection radius for richer constellations
  let time = 0;

  function addShootingStar() {
    if (Math.random() < 0.008 && shootingStars.length < 2) {
      shootingStars.push({
        x: Math.random() * W * 0.7,
        y: Math.random() * H * 0.3,
        len: Math.random() * 90 + 50,
        speed: Math.random() * 6 + 7,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        opacity: 0.85,
        life: 0,
        maxLife: Math.random() * 35 + 25,
      });
    }
  }

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(canvas);

  function draw() {
    if (isVisible) {
      ctx.clearRect(0, 0, W, H);
      time += 0.02;

      // ── Draw Distant Twinkling Stars ──
      for (const s of stars) {
        s.twinklePhase += s.twinkleSpeed;
        const alpha = Math.max(0.1, s.baseAlpha + Math.sin(s.twinklePhase) * 0.35);
        ctx.fillStyle = `rgba(${s.color},${alpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = W; else if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; else if (s.y > H) s.y = 0;
      }

      // ── Draw Constellation Connections ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx   = nodes[i].x - nodes[j].x;
          const dy   = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist >= MAX_DIST) continue;

          // Enhanced visibility alpha (up to 0.34)
          const normDist = 1 - dist / MAX_DIST;
          const alpha    = normDist * 0.34;
          const t        = (nodes[i].x + nodes[j].x) / (2 * W);

          ctx.strokeStyle = getGradientColor(t, alpha);
          ctx.lineWidth   = normDist * 1.3 + 0.4;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }

        // Connection to mouse cursor if within range
        if (mouse.active) {
          const mdx = nodes[i].x - mouse.x;
          const mdy = nodes[i].y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 180) {
            const malpha = (1 - mdist / 180) * 0.42;
            ctx.strokeStyle = `rgba(0, 212, 170, ${malpha})`;
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // ── Draw Constellation Star Nodes ──
      for (const n of nodes) {
        const t = n.x / W;

        // Halo for major stars
        if (n.isMajor) {
          const glowGrad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.size * 3.8);
          glowGrad.addColorStop(0, getGradientColor(t, 0.4));
          glowGrad.addColorStop(1, 'rgba(0, 212, 170, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.size * 3.8, 0, Math.PI * 2);
          ctx.fill();
        }

        // Star core
        ctx.fillStyle = getGradientColor(t, 0.9);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();

        // Move nodes
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -15 || n.x > W + 15) n.vx *= -1;
        if (n.y < -15 || n.y > H + 15) n.vy *= -1;
      }

      // ── Draw Rare Shooting Stars ──
      addShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const tailX = ss.x - Math.cos(ss.angle) * ss.len;
        const tailY = ss.y - Math.sin(ss.angle) * ss.len;

        const streak = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        streak.addColorStop(0, 'rgba(0, 212, 170, 0)');
        streak.addColorStop(1, `rgba(255, 255, 255, ${ss.opacity})`);

        ctx.strokeStyle = streak;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life++;
        ss.opacity = 0.85 * (1 - ss.life / ss.maxLife);

        if (ss.life >= ss.maxLife) {
          shootingStars.splice(i, 1);
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  // Interactive mouse tracking
  const heroSection = document.getElementById('accueil');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });
    heroSection.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
  }

  resize();
  initUniverse();
  draw();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      initUniverse();
      draw();
    }, 200);
  });
})();


/* ══════════════════════════════════════════════
   2. NAVBAR — scroll glass effect + active link
   ══════════════════════════════════════════════ */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-links li a:not(.nav-cta)');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Glass effect
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link tracking
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.id;
      }
    });
    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ══════════════════════════════════════════════
   3. MOBILE MENU
   ══════════════════════════════════════════════ */
(function initMobileMenu() {
  const burger   = document.getElementById('nav-burger');
  const navLinks = document.getElementById('nav-links');
  if (!burger || !navLinks) return;

  burger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ══════════════════════════════════════════════
   4. SCROLL REVEAL — IntersectionObserver
   ══════════════════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


/* ══════════════════════════════════════════════
   5. STATS COUNTER — animated on first view
   ══════════════════════════════════════════════ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(c => observer.observe(c));
})();


/* ══════════════════════════════════════════════
   6. FAQ ACCORDION
   ══════════════════════════════════════════════ */
(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const q = i.querySelector('.faq-question');
        if (q) q.setAttribute('aria-expanded', 'false');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();


/* ══════════════════════════════════════════════
   7. SMOOTH SCROLL — anchor links
   ══════════════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();


/* ══════════════════════════════════════════════
   8. CONTACT FORM — UX feedback
   ══════════════════════════════════════════════ */
(function initForm() {
  const form   = document.getElementById('contact-form');
  const submit = document.getElementById('submit-btn');
  if (!form || !submit) return;

  form.addEventListener('submit', () => {
    submit.disabled     = true;
    submit.textContent  = 'Envoi en cours...';
    submit.style.opacity = '0.7';
  });
})();


/* ══════════════════════════════════════════════
   9. HERO GRID OVERLAY — subtle CSS grid lines
   ══════════════════════════════════════════════ */
(function initHeroGrid() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const grid = document.createElement('div');
  grid.setAttribute('aria-hidden', 'true');
  grid.style.cssText = `
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(26,115,232,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,115,232,0.04) 1px, transparent 1px);
    background-size: 60px 60px;
    pointer-events: none;
    z-index: 0;
  `;
  hero.appendChild(grid);
})();


/* ══════════════════════════════════════════════
   10. ARTICULATED NEURAL NETWORK
   Smooth kinematic joints & traveling synaptic pulses
   ══════════════════════════════════════════════ */
(function initArticulatedNeuralNetwork() {
  const svg = document.getElementById('neural-svg');
  if (!svg) return;

  const nodeA = document.getElementById('node-a');
  const nodeB = document.getElementById('node-b');
  const nodeC = document.getElementById('node-c');
  const nodeD = document.getElementById('node-d');
  const nodeE = document.getElementById('node-e');

  const lineAB = document.getElementById('link-a-b');
  const lineBC = document.getElementById('link-b-c');
  const lineDB = document.getElementById('link-d-b');
  const lineEB = document.getElementById('link-e-b');
  const lineEC = document.getElementById('link-e-c');

  const pulse1  = document.getElementById('pulse-1');
  const pulse2  = document.getElementById('pulse-2');
  const rippleC = document.getElementById('ripple-c-ring');

  if (!nodeA || !nodeB || !nodeC || !lineAB || !lineBC) return;

  let isVisible = true;
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0.1 });
  observer.observe(svg);

  function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end;
  }

  function frame(timestamp) {
    if (isVisible) {
      const t = timestamp;

      // Kinematic articulation of nodes
      const bx = 180 + Math.sin(t * 0.0011) * 12;
      const by = 180 + Math.cos(t * 0.0009) * 10;

      const ax = 75 + Math.sin(t * 0.0008 + 1.2) * 8;
      const ay = 285 + Math.cos(t * 0.0013 + 0.5) * 7;

      const cx = 270 + Math.sin(t * 0.0014 + 2.1) * 11;
      const cy = 80 + Math.cos(t * 0.0010 + 1.8) * 9;

      const dx = 285 + Math.sin(t * 0.0015 + 3.0) * 12;
      const dy = 230 + Math.cos(t * 0.0012 + 2.5) * 10;

      const ex = 95 + Math.sin(t * 0.0013 + 4.2) * 10;
      const ey = 100 + Math.cos(t * 0.0016 + 3.8) * 8;

      // Transform nodes relative to base
      nodeA.setAttribute('transform', `translate(${ax - 75}, ${ay - 285})`);
      nodeB.setAttribute('transform', `translate(${bx - 180}, ${by - 180})`);
      nodeC.setAttribute('transform', `translate(${cx - 270}, ${cy - 80})`);
      if (nodeD) nodeD.setAttribute('transform', `translate(${dx - 285}, ${dy - 230})`);
      if (nodeE) nodeE.setAttribute('transform', `translate(${ex - 95}, ${ey - 100})`);

      // Articulate connecting lines
      lineAB.setAttribute('x1', ax); lineAB.setAttribute('y1', ay);
      lineAB.setAttribute('x2', bx); lineAB.setAttribute('y2', by);

      lineBC.setAttribute('x1', bx); lineBC.setAttribute('y1', by);
      lineBC.setAttribute('x2', cx); lineBC.setAttribute('y2', cy);

      if (lineDB) {
        lineDB.setAttribute('x1', dx); lineDB.setAttribute('y1', dy);
        lineDB.setAttribute('x2', bx); lineDB.setAttribute('y2', by);
      }
      if (lineEB) {
        lineEB.setAttribute('x1', ex); lineEB.setAttribute('y1', ey);
        lineEB.setAttribute('x2', bx); lineEB.setAttribute('y2', by);
      }
      if (lineEC) {
        lineEC.setAttribute('x1', ex); lineEC.setAttribute('y1', ey);
        lineEC.setAttribute('x2', cx); lineEC.setAttribute('y2', cy);
      }

      // Update ripple position
      if (rippleC) {
        rippleC.setAttribute('cx', cx);
        rippleC.setAttribute('cy', cy);
      }

      // Synaptic energy pulse 1 (A -> B -> C)
      if (pulse1) {
        const p1 = (t * 0.0006) % 2;
        let px1, py1;
        if (p1 < 1) {
          px1 = lerp(ax, bx, p1);
          py1 = lerp(ay, by, p1);
        } else {
          px1 = lerp(bx, cx, p1 - 1);
          py1 = lerp(by, cy, p1 - 1);
        }
        pulse1.setAttribute('cx', px1);
        pulse1.setAttribute('cy', py1);
      }

      // Synaptic energy pulse 2 (E -> B -> D)
      if (pulse2) {
        const p2 = (t * 0.0005 + 0.6) % 2;
        let px2, py2;
        if (p2 < 1) {
          px2 = lerp(ex, bx, p2);
          py2 = lerp(ey, by, p2);
        } else {
          px2 = lerp(bx, dx, p2 - 1);
          py2 = lerp(by, dy, p2 - 1);
        }
        pulse2.setAttribute('cx', px2);
        pulse2.setAttribute('cy', py2);
      }
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
})();

(() => {
  /* Mobile menu */
  const btn = document.querySelector('.menu-toggle'), menu = document.getElementById('menu');
  const setMenu = open => { menu.classList.toggle('open', open); btn.setAttribute('aria-expanded', open); };
  btn.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') setMenu(false); });
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  addEventListener('resize', () => { if (innerWidth > 800) setMenu(false); });

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* Typing line in the hero */
  const typed = document.getElementById('typed');
  const text = 'whoami: software developer';
  if (reduce) typed.textContent = text;
  else { let i = 0; (function t(){ typed.textContent = text.slice(0, ++i); if (i < text.length) setTimeout(t, 70); })(); }

  /* Sakura sky + cursor sparkles */
  const cv = document.getElementById('sky'), ctx = cv.getContext('2d');
  let w, h, dpr = Math.min(devicePixelRatio || 1, 2);
  const mouse = { x: -999, y: -999 };
  const petals = [], sparks = [];

  const resize = () => {
    w = innerWidth; h = innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  addEventListener('resize', resize); resize();

  const mk = (top) => ({
    x: Math.random() * w, y: top ? -20 : Math.random() * h,
    s: 5 + Math.random() * 7, vx: 0, vy: .4 + Math.random() * .6,
    sway: Math.random() * 6.28, r: Math.random() * 6.28, vr: (Math.random() - .5) * .03,
    hue: 275 + Math.random() * 45
  });
  const count = Math.min(60, Math.floor(w / 22));
  for (let i = 0; i < count; i++) petals.push(mk(false));

  addEventListener('mousemove', e => {
    mouse.x = e.clientX; mouse.y = e.clientY;
    if (!reduce && Math.random() < .5)
      sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - .5) * 1.4, vy: (Math.random() - .5) * 1.4, life: 1 });
  });

  function drawPetal(p) {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
    ctx.fillStyle = `hsla(${p.hue},85%,78%,.55)`;
    ctx.beginPath();
    ctx.moveTo(0, -p.s);
    ctx.bezierCurveTo(p.s, -p.s * .6, p.s * .7, p.s * .8, 0, p.s);
    ctx.bezierCurveTo(-p.s * .7, p.s * .8, -p.s, -p.s * .6, 0, -p.s);
    ctx.fill(); ctx.restore();
  }

  function frame() {
    ctx.clearRect(0, 0, w, h);
    for (const p of petals) {
      p.sway += .02;
      const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
      if (d < 140 && d > 0) { const f = (140 - d) / 140; p.vx += dx / d * f * .6; p.vy += dy / d * f * .3; }
      p.vx *= .95; p.vy += (.6 - p.vy) * .02;
      p.x += p.vx + Math.sin(p.sway) * .5; p.y += p.vy; p.r += p.vr;
      if (p.y > h + 20 || p.x < -40 || p.x > w + 40) Object.assign(p, mk(true));
      drawPetal(p);
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.x += s.vx; s.y += s.vy; s.life -= .03;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.fillStyle = `rgba(240,171,252,${s.life})`;
      ctx.shadowColor = '#f0abfc'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(s.x, s.y, 2.2 * s.life, 0, 6.28); ctx.fill();
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) frame();

  /* Custom cursor: dot follows instantly, ring eases behind */
  if (fine) {
    document.body.classList.add('has-cursor');
    const ring = document.querySelector('.cursor-ring'), dot = document.querySelector('.cursor-dot');
    let rx = 0, ry = 0;
    (function move() {
      rx += (mouse.x - rx) * .18; ry += (mouse.y - ry) * .18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      dot.style.transform = `translate(${mouse.x}px,${mouse.y}px)`;
      requestAnimationFrame(move);
    })();
    document.querySelectorAll('a,button,.card').forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hot'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hot'));
    });
  }
})();

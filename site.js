/* Ethan Dvir Motorsport — shared nav/footer + interactions (multi-page) */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var page = document.body.getAttribute('data-page') || 'home';

  // ---------- inject NAV ----------
  var NAV_LINKS = [
    { href: 'index.html', label: 'Home', page: 'home' },
    { href: 'about.html', label: 'About', page: 'about' },
    { href: 'career.html', label: 'Career', page: 'career' },
    { href: 'partner.html', label: 'Partners', page: 'partner' },
    { href: 'contact.html', label: 'Contact', page: 'contact' }
  ];
  var linksHtml = NAV_LINKS.map(function (l) {
    return '<a href="' + l.href + '"' + (l.page === page ? ' class="active"' : '') + '>' + l.label + '</a>';
  }).join('');

  var nav = document.createElement('nav');
  nav.className = 'nav';
  nav.id = 'nav';
  nav.innerHTML =
    '<a class="brand" href="index.html" aria-label="Ethan Dvir home">' +
      '<span class="brand-logo"><img src="assets/logo-mark.png" alt="ED" /></span>' +
      '<span class="brand-name">Ethan Dvir<small>Motorsport</small></span>' +
    '</a>' +
    '<div class="nav-links" id="navLinks">' + linksHtml +
      '<a class="btn btn-primary nav-cta" href="partner.html">Partner with me <span class="arr">&#8594;</span></a>' +
    '</div>' +
    '<button class="nav-burger" id="burger" aria-label="Menu"><span></span><span></span><span></span></button>';
  document.body.insertBefore(nav, document.body.firstChild);

  // progress bar
  var progress = document.createElement('div');
  progress.className = 'progress';
  progress.id = 'progress';
  document.body.insertBefore(progress, document.body.firstChild);

  // ---------- inject FOOTER ----------
  var footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML =
    '<div class="footer-row">' +
      '<a class="brand" href="index.html">' +
        '<span class="brand-logo"><img src="assets/logo-mark.png" alt="ED" /></span>' +
        '<span class="brand-name">Ethan Dvir<small>Motorsport</small></span>' +
      '</a>' +
      '<div class="footer-meta">' +
        '<a href="about.html">About</a><a href="career.html">Career</a>' +
        '<a href="partner.html">Partners</a>' +
        '<a href="contact.html">Contact</a>' +
        '<a href="https://www.instagram.com/ethandvir/" target="_blank" rel="noopener">Instagram</a>' +
      '</div>' +
    '</div>' +
    '<p class="footer-fine">&copy; 2026 Ethan Dvir Motorsport. British GT racing driver, 14 &mdash; racing in Spain, building toward a 2027 GR Cup Spain campaign. Partnership enquiries welcome. Liveries and logos shown are from testing and do not represent current commercial partnerships.</p>';
  document.body.appendChild(footer);

  // ---------- nav scrolled + progress ----------
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (y > 24) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
    var h = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- mobile menu ----------
  var burger = document.getElementById('burger');
  var links = document.getElementById('navLinks');
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);
  function closeMenu() {
    links.classList.remove('open');
    burger.classList.remove('open');
    overlay.classList.remove('show');
    document.body.classList.remove('menu-open');
  }
  function openMenu() {
    links.classList.add('open');
    burger.classList.add('open');
    overlay.classList.add('show');
    document.body.classList.add('menu-open');
  }
  burger.addEventListener('click', function () {
    if (links.classList.contains('open')) closeMenu(); else openMenu();
  });
  overlay.addEventListener('click', closeMenu);
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  // ---------- smooth scroll for same-page anchors ----------
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 10, behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  // ---------- reveal ----------
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  var vh0 = window.innerHeight || document.documentElement.clientHeight;
  document.querySelectorAll('.reveal').forEach(function (el) {
    var r = el.getBoundingClientRect();
    if (r.top < vh0 && r.bottom > 0) {
      // already on screen at load — show instantly, no fade-in flash
      el.classList.add('in', 'insta');
    } else {
      io.observe(el);
    }
  });
  // re-enable transitions for the settled elements after first paint
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.querySelectorAll('.reveal.insta').forEach(function (el) { el.classList.remove('insta'); });
    });
  });

  // ---------- count-up ----------
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = target; return; }
    var dur = 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(eased * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  // ---------- parallax ----------
  var heroMedia = document.getElementById('heroMedia');
  var ppMedia = Array.prototype.slice.call(document.querySelectorAll('[data-parallax] .band-media, .pagehead-media'));
  var ticking = false;
  function parallax() {
    if (window.__noParallax || reduce) { ticking = false; return; }
    var vh = window.innerHeight;
    if (heroMedia) heroMedia.style.transform = 'translate3d(0,' + (window.scrollY * 0.28) + 'px,0)';
    ppMedia.forEach(function (m) {
      var host = m.parentElement;
      var r = host.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      var prog = (r.top + r.height / 2 - vh / 2) / vh;
      m.style.transform = 'translate3d(0,' + (prog * -55) + 'px,0)';
    });
    ticking = false;
  }
  function reqP() { if (!ticking) { ticking = true; requestAnimationFrame(parallax); } }
  window.addEventListener('scroll', reqP, { passive: true });
  window.addEventListener('resize', reqP, { passive: true });
  parallax();
  window.__refreshParallax = reqP;

  // ---------- interactive career timeline ----------
  var ctl = document.querySelector('[data-ctl]');
  if (ctl) {
    var nodes = Array.prototype.slice.call(ctl.querySelectorAll('.tl[data-key]'));
    var imgs = {};
    ctl.querySelectorAll('.ctl-img img').forEach(function (im) { imgs[im.getAttribute('data-key')] = im; });
    var yrEl = ctl.querySelector('.ctl-yr');
    var tagEl = ctl.querySelector('.ctl-tag');
    var hEl = ctl.querySelector('.ctl-h');
    var pEl = ctl.querySelector('.ctl-p');
    function select(key) {
      nodes.forEach(function (n) { n.classList.toggle('sel', n.getAttribute('data-key') === key); });
      Object.keys(imgs).forEach(function (k) { imgs[k].classList.toggle('on', k === key); });
      var src = nodes.filter(function (n) { return n.getAttribute('data-key') === key; })[0];
      if (!src) return;
      if (yrEl) yrEl.textContent = src.getAttribute('data-yr');
      if (tagEl) { tagEl.textContent = src.getAttribute('data-tag'); }
      if (hEl) hEl.textContent = src.getAttribute('data-h');
      if (pEl) pEl.textContent = src.getAttribute('data-p');
      if (yrEl) { yrEl.classList.remove('flash'); void yrEl.offsetWidth; yrEl.classList.add('flash'); }
    }
    nodes.forEach(function (n) {
      n.addEventListener('click', function () { select(n.getAttribute('data-key')); });
      n.addEventListener('mouseenter', function () { select(n.getAttribute('data-key')); });
    });
    select(ctl.getAttribute('data-ctl') || nodes[0].getAttribute('data-key'));
  }

  // ---------- compare slider (drag) ----------
  var cmp = document.querySelector('.compare');
  if (cmp) {
    var dragging = false;
    function setSplit(clientX) {
      var r = cmp.getBoundingClientRect();
      var pct = ((clientX - r.left) / r.width) * 100;
      pct = Math.max(4, Math.min(96, pct));
      cmp.style.setProperty('--split', pct + '%');
    }
    cmp.addEventListener('pointerdown', function (e) { dragging = true; cmp.setPointerCapture(e.pointerId); setSplit(e.clientX); });
    cmp.addEventListener('pointermove', function (e) { if (dragging) setSplit(e.clientX); });
    cmp.addEventListener('pointerup', function () { dragging = false; });
    cmp.addEventListener('pointercancel', function () { dragging = false; });
    // subtle auto-hint on first view
    var hinted = false;
    var hio = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting && !hinted && !reduce) {
          hinted = true;
          var v = 50, dir = -1, steps = 0;
          var iv = setInterval(function () {
            v += dir * 2; steps++;
            if (v <= 38 || v >= 62) dir *= -1;
            cmp.style.setProperty('--split', v + '%');
            if (steps > 24) { clearInterval(iv); cmp.style.setProperty('--split', '50%'); }
          }, 28);
        }
      });
    }, { threshold: 0.5 });
    hio.observe(cmp);
  }

  // ---------- interactive car map (partner page) ----------
  var carmap = document.getElementById('carmap');
  if (carmap) {
    var infoWrap = carmap.closest('.carmap-wrap');
    function selectZone(zone) {
      carmap.querySelectorAll('.hot').forEach(function (h) {
        h.classList.toggle('on', h.getAttribute('data-zone') === zone);
      });
      infoWrap.querySelectorAll('.carmap-zone').forEach(function (z) {
        z.classList.toggle('on', z.getAttribute('data-zone') === zone);
      });
      infoWrap.querySelectorAll('.carmap-tabs button').forEach(function (b) {
        b.classList.toggle('on', b.getAttribute('data-zone') === zone);
      });
    }
    carmap.querySelectorAll('.hot').forEach(function (h) {
      h.addEventListener('click', function () { selectZone(h.getAttribute('data-zone')); });
      h.addEventListener('mouseenter', function () { selectZone(h.getAttribute('data-zone')); });
    });
    infoWrap.querySelectorAll('.carmap-tabs button').forEach(function (b) {
      b.addEventListener('click', function () { selectZone(b.getAttribute('data-zone')); });
    });
  }

  // ---------- active nav for in-page sections (home only) ----------
  if (page === 'home') {
    var map = {};
    ['about', 'career', 'partner'].forEach(function (id) {
      var a = nav.querySelector('.nav-links a[href="' + id + '.html"]');
      if (a) map[id] = a;
    });
  }
})();

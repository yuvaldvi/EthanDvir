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
  function fmtCount(el, n) {
    var r = Math.round(n);
    var s = (el.getAttribute('data-format') === 'comma') ? r.toLocaleString('en-US') : String(r);
    return (el.getAttribute('data-prefix') || '') + s + (el.getAttribute('data-suffix') || '');
  }
  function animateCount(el) {
    if (el.__counted) return; el.__counted = true;
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    if (reduce) { el.textContent = fmtCount(el, target); return; }
    var dur = parseInt(el.getAttribute('data-dur'), 10) || 1400, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmtCount(el, eased * target);
      if (p < 1) requestAnimationFrame(step); else el.textContent = fmtCount(el, target);
    }
    requestAnimationFrame(step);
    // safety: guarantee the final value lands even if rAF is throttled/stalled
    setTimeout(function () { el.textContent = fmtCount(el, target); }, dur + 120);
  }
  // Trigger when scrolled into view. Polls via timer + listens to scroll: the
  // timer is the guarantee (scroll events / IntersectionObserver can be throttled
  // or not fire on programmatic scroll, which left the headline number at "0").
  var counters = Array.prototype.slice.call(document.querySelectorAll('[data-count]'));
  function checkCounters() {
    if (!counters.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    counters = counters.filter(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > vh * 0.1) { animateCount(el); return false; }
      return true;
    });
    if (!counters.length) {
      window.removeEventListener('scroll', checkCounters);
      window.removeEventListener('resize', checkCounters);
    } else {
      setTimeout(checkCounters, 350);
    }
  }
  window.addEventListener('scroll', checkCounters, { passive: true });
  window.addEventListener('resize', checkCounters, { passive: true });
  checkCounters();

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

  // ---------- page transition (logo wipe) ----------
  (function () {
    var LOGO = 'assets/logo-mark.png';
    function panelHtml() {
      return '<div class="pt-panel"></div>' +
        '<div class="pt-logo"><img src="' + LOGO + '" alt="" />' +
        '<span class="pt-word">Ethan Dvir</span><span class="pt-bar"></span></div>';
    }

    // ARRIVAL: the head script injected an OPAQUE-container cover so the very
    // first paint is fully covered (no inter-page flash). Hold until the new
    // page is actually painted, then turn the container transparent (the panel
    // still covers) and wipe the panel off to the left to reveal the page.
    var arrive = document.getElementById('pt');
    if (arrive && arrive.classList.contains('pt-in')) {
      try { sessionStorage.removeItem('ed-pt'); } catch (e) {}
      var cleared = false, wiped = false;
      var panel = arrive.querySelector('.pt-panel');
      var clearArrive = function () {
        if (cleared) return; cleared = true;
        if (arrive && arrive.parentNode) arrive.parentNode.removeChild(arrive);
      };
      var wipe = function () {
        if (wiped) return; wiped = true;
        arrive.style.background = 'transparent'; // panel still fully covers
        if (panel && !reduce) panel.addEventListener('animationend', clearArrive, { once: true });
        void arrive.offsetWidth; // reflow so the wipe animates from the covered state
        arrive.classList.add('go');
        if (reduce) clearArrive();
        setTimeout(clearArrive, 800); // safety once the wipe is running
      };
      // Hold the cover until the incoming hero image has decoded (capped), so the
      // page doesn't visibly "pop" as the wipe reveals it — that pop is the flicker.
      // Cached pages reveal in a frame; first visits hold at most ~260ms.
      if (reduce) { wipe(); }
      else {
        var begun = false;
        var begin = function () {
          if (begun) return; begun = true;
          requestAnimationFrame(function () { requestAnimationFrame(wipe); });
        };
        var hero = document.querySelector('.pagehead-media img, .hero-media img, .band-media img');
        if (hero && !(hero.complete && hero.naturalWidth)) {
          if (hero.decode) { hero.decode().then(begin).catch(begin); }
          else { hero.addEventListener('load', begin, { once: true }); hero.addEventListener('error', begin, { once: true }); }
        } else { begin(); }
        setTimeout(begin, 150); // cap: keep the black hold between the two wipes short
      }
      setTimeout(wipe, 1400); // absolute safety so it can never stick
    }

    // EXIT: intercept internal navigations, wipe the panel in to cover, navigate once covered.
    var curFile = (location.pathname.split('/').pop() || 'index.html');
    function internalTarget(a) {
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return null;
      var href = a.getAttribute('href') || '';
      if (!href || href.charAt(0) === '#') return null;
      if (/^(https?:|mailto:|tel:)/i.test(href)) return null;
      if (!/\.html(\?|#|$)/.test(href)) return null;
      return href;
    }
    var leaving = false;
    function playExit(url) {
      if (leaving) return;
      leaving = true;
      var o = document.createElement('div');
      o.id = 'pt';
      o.className = 'pt pt-out';
      o.innerHTML = panelHtml();
      document.body.appendChild(o);
      try { sessionStorage.setItem('ed-pt', '1'); } catch (e) {}
      var gone = false;
      var panel = o.querySelector('.pt-panel');
      var go = function () {
        if (gone) return; gone = true;
        if (panel) panel.style.transform = 'skewX(-12deg) translateX(0)'; // panel fully covers
        o.style.background = '#0c0b0a'; // opaque container too — a solid frame to hold across the seam (no sliver, no flash)
        window.location.href = url;
      };
      // navigate the instant the panel has fully covered — the next page is pre-covered
      if (panel && !reduce) panel.addEventListener('animationend', go, { once: true });
      setTimeout(go, reduce ? 120 : 500); // fallback if animationend doesn't fire
    }
    document.addEventListener('click', function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest ? e.target.closest('a') : null;
      if (!a) { var n = e.target; while (n && n.tagName !== 'A') { n = n.parentNode; } a = n; }
      var href = internalTarget(a);
      if (!href) return;
      var destFile = href.split('#')[0].split('?')[0].split('/').pop();
      e.preventDefault();
      if (destFile === curFile) return; // same page — no transition, no reload
      playExit(href);
    }, true);

    // restore on back/forward cache so a stale overlay never sticks
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) {
        var stuck = document.getElementById('pt');
        if (stuck) stuck.parentNode.removeChild(stuck);
      }
    });
  })();

  // ---------- lazy-load the Tweaks panel (React + Babel) off the critical path ----------
  // It's purely the Tweaks UI — every visual setting it controls is already applied by the
  // early <head> script — so loading it eagerly only added a main-thread stall on every page
  // load, which made the page-transition sweep stutter. Deferred until the page is idle.
  (function () {
    var started = false;
    function loadScript(src, integrity) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        if (integrity) { s.integrity = integrity; s.crossOrigin = 'anonymous'; }
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    function loadTweaks() {
      if (started) return; started = true;
      loadScript('https://unpkg.com/react@18.3.1/umd/react.development.js', 'sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L')
        .then(function () { return loadScript('https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js', 'sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm'); })
        .then(function () { return loadScript('https://unpkg.com/@babel/standalone@7.29.0/babel.min.js', 'sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y'); })
        .then(function () {
          var panel = document.createElement('script');
          panel.type = 'text/babel'; panel.setAttribute('data-presets', 'react'); panel.src = 'tweaks-panel.jsx';
          document.body.appendChild(panel);
          var app = document.createElement('script');
          app.type = 'text/babel'; app.setAttribute('data-presets', 'react'); app.src = 'tweaks-app.jsx';
          document.body.appendChild(app);
          if (window.Babel && Babel.transformScriptTags) Babel.transformScriptTags();
        })
        .catch(function () {});
    }
    function schedule() {
      if ('requestIdleCallback' in window) requestIdleCallback(loadTweaks, { timeout: 2500 });
      else setTimeout(loadTweaks, 1200);
    }
    if (document.readyState === 'complete') schedule();
    else window.addEventListener('load', schedule, { once: true });
  })();

  // ---------- racing stripe — fast sweep on every page load ----------
  (function () {
    var s = document.createElement('div');
    s.className = 'racestripe';
    document.body.appendChild(s);
    setTimeout(function () { if (s.parentNode) s.parentNode.removeChild(s); }, 1200);
  })();
})();

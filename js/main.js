(function () {
  'use strict';
  var cfg = window.ICFR || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---- fill values from config.js ---- */
  $$('[data-cfg]').forEach(function (el) {
    var v = cfg[el.getAttribute('data-cfg')];
    if (!v) return;
    el.classList.remove('upd');
    var type = el.getAttribute('data-cfg');
    if (type === 'email') { el.innerHTML = ''; var a = document.createElement('a'); a.href = 'mailto:' + v; a.textContent = v; el.appendChild(a); }
    else if (type === 'phone') { el.innerHTML = ''; var p = document.createElement('a'); p.href = 'tel:' + v.replace(/[^+\d]/g, ''); p.textContent = v; el.appendChild(p); }
    else { el.textContent = v; }
  });
  $$('[data-cfg-href]').forEach(function (a) {
    var v = cfg[a.getAttribute('data-cfg-href')];
    if (!v) return;
    a.href = v; a.target = '_blank'; a.rel = 'noopener';
    a.classList.remove('is-disabled'); a.removeAttribute('aria-disabled');
    if (a.getAttribute('data-label')) a.textContent = a.getAttribute('data-label');
  });

  /* ---- header: shadow, mobile menu, More dropdown ---- */
  var header = $('.site-header');
  var toTop = $('.to-top');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('scrolled', y > 8);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (toTop) toTop.addEventListener('click', function () { window.scrollTo({ top: 0 }); });

  var toggle = $('.menu-toggle'), nav = $('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? 'Close' : 'Menu';
    });
  }
  var moreBtn = $('.more-btn'), moreMenu = $('.more-menu');
  if (moreBtn && moreMenu) {
    var closeMore = function () { moreMenu.classList.remove('open'); moreBtn.setAttribute('aria-expanded', 'false'); };
    moreBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var o = moreMenu.classList.toggle('open');
      moreBtn.setAttribute('aria-expanded', o ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) { if (!moreMenu.contains(e.target)) closeMore(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeMore(); moreBtn.focus(); } });
  }

  /* ---- countdown ---- */
  $$('.countdown').forEach(function (box) {
    var target = new Date(box.getAttribute('data-target')).getTime();
    var parts = { d: $('[data-u="d"]', box), h: $('[data-u="h"]', box), m: $('[data-u="m"]', box), s: $('[data-u="s"]', box) };
    var msg = $('.cd-msg');
    function pad(n) { return n < 10 ? '0' + n : '' + n; }
    function tick() {
      var diff = target - Date.now();
      if (diff <= 0) {
        parts.d.textContent = parts.h.textContent = parts.m.textContent = parts.s.textContent = '00';
        if (msg) msg.textContent = 'The conference is under way or has concluded. Thank you for being part of ICFR-2027.';
        return;
      }
      var s = Math.floor(diff / 1000);
      parts.d.textContent = Math.floor(s / 86400);
      parts.h.textContent = pad(Math.floor(s % 86400 / 3600));
      parts.m.textContent = pad(Math.floor(s % 3600 / 60));
      parts.s.textContent = pad(s % 60);
    }
    tick(); setInterval(tick, 1000);
  });

  /* ---- tabs ---- */
  $$('[data-tabs]').forEach(function (wrap) {
    var tabs = $$('[role="tab"]', wrap), panels = $$('[role="tabpanel"]', wrap);
    function select(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        panels[n].hidden = !on;
      });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); select((i + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); select((i - 1 + tabs.length) % tabs.length, true); }
      });
    });
    select(0);
  });

  /* ---- reveal on scroll ---- */
  var rv = $$('.reveal');
  if ('IntersectionObserver' in window && rv.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('in'); }); }

  /* ---- contact form (opens the visitor's email app) ---- */
  var form = $('#contact-form');
  if (form) {
    var out = $('#form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(form);
      if (!cfg.email) {
        out.hidden = false;
        out.textContent = 'The conference email address will be published soon. Please check back shortly.';
        return;
      }
      var body = 'Name: ' + f.get('name') + '\nEmail: ' + f.get('email') + '\nAffiliation: ' + (f.get('org') || '-') + '\n\n' + f.get('message');
      window.location.href = 'mailto:' + cfg.email + '?subject=' + encodeURIComponent('[ICFR-2027] ' + f.get('topic')) + '&body=' + encodeURIComponent(body);
      out.hidden = false;
      out.textContent = 'Your email app should open with the message ready to send.';
    });
  }
})();

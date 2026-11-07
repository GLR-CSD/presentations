/* GLR Media Creative — gedeelde reveal.js-plugins/controllers (offline)
   Vanilla JS, geen externe libs. Wordt als klassiek <script> geladen na
   reveal.js. Detecteert zelf de aanwezige componenten in de presentatie.

   Componenten
   -----------
   1. Les-timer   <div class="timer" data-timer="30:00"> ... </div>
      met daarin .t-dial (svg met .t-track/.t-prog), .t-time, .t-start, .t-reset
   2. Kleurenwiel <span class="harm-wheel" data-hues="0,6" data-shades="0"></span>
   3. Diagram     <div class="glr-diagram" data-diagram-layout="linear-h"
                       data-flow-anim="none|stream|packets|ping-pong" data-draw-anim="true">
      (gegenereerd door admin/src/blocks/diagram.js; hier alleen de animatielagen:
      datastroom, reizende pakketjes, fragment-sync en SMIL-pauze buiten de actieve slide)

   Zowel een klassieke IIFE (auto-init op DOMContentLoaded) als een
   programmatische API via window.GLRPlugins. */
(function () {
  'use strict';

  /* ------------------------------------------------------------ timer --- */
  function parseTime(t) {
    var parts = String(t || '20:00').split(':');
    var m = parseInt(parts[0], 10) || 0;
    var s = parts[1] ? parseInt(parts[1], 10) : 0;
    return m * 60 + s;
  }

  function formatTime(sec) {
    sec = Math.max(0, sec);
    var m = Math.floor(sec / 60);
    var s = sec % 60;
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  function initTimer(el) {
    if (el.dataset.glrTimerReady === '1') return;
    el.dataset.glrTimerReady = '1';

    var total = parseTime(el.getAttribute('data-timer'));
    var remaining = total;
    var running = false;
    var tick = null;
    var prog = el.querySelector('.t-prog');
    var timeEl = el.querySelector('.t-time');
    var btnStart = el.querySelector('.t-start');
    var btnReset = el.querySelector('.t-reset');
    var R = 54;
    var C = 2 * Math.PI * R;
    if (prog) prog.style.strokeDasharray = C.toFixed(1);

    function render() {
      if (timeEl) timeEl.textContent = formatTime(remaining);
      var frac = total > 0 ? remaining / total : 0;
      if (prog) prog.style.strokeDashoffset = (C * (1 - frac)).toFixed(1);
    }

    function stop() {
      if (tick) { clearInterval(tick); tick = null; }
      running = false;
      if (btnStart) btnStart.textContent = 'Start';
    }

    function start() {
      if (running || remaining <= 0) return;
      running = true;
      if (btnStart) btnStart.textContent = 'Pauze';
      tick = setInterval(function () {
        remaining -= 1;
        render();
        if (remaining <= 0) { stop(); el.classList.add('t-done'); }
      }, 1000);
    }

    if (btnStart) btnStart.addEventListener('click', function () { running ? stop() : start(); });
    if (btnReset) btnReset.addEventListener('click', function () {
      stop();
      remaining = total;
      el.classList.remove('t-done');
      render();
    });
    render();
  }

  /* -------------------------------------------------------- kleurenwiel --- */
  var WHEEL_N = 12;
  var WHEEL_R = 33;

  function wheelPoint(i, r) {
    var a = (i * 30 - 90) * Math.PI / 180;
    return [50 + r * Math.cos(a), 50 + r * Math.sin(a)];
  }

  function buildWheel(el) {
    if (el.dataset.glrWheelReady === '1') return;
    el.dataset.glrWheelReady = '1';

    var shades = el.getAttribute('data-shades') === '1';
    var hues = (el.getAttribute('data-hues') || '').split(',')
      .map(function (s) { return parseInt(s, 10); })
      .filter(function (n) { return !isNaN(n); });
    var svg = '<svg viewBox="0 0 100 100" aria-hidden="true">';
    svg += '<circle cx="50" cy="50" r="' + WHEEL_R + '" fill="none" stroke="#E5E7EB" stroke-width="7"/>';
    if (!shades && hues.length > 1) {
      var d = hues.map(function (i, k) {
        var p = wheelPoint(i, WHEEL_R);
        return (k ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1);
      }).join(' ');
      svg += '<path d="' + d + ' Z" fill="none" stroke="rgba(17,17,17,.30)" stroke-width="1.6"/>';
    }
    for (var i = 0; i < WHEEL_N; i++) {
      var p = wheelPoint(i, WHEEL_R);
      var fill;
      var selected;
      if (shades) {
        var l = 24 + (i / (WHEEL_N - 1)) * 54;
        fill = 'hsl(210,58%,' + l.toFixed(0) + '%)';
        selected = (i % 3 === 0);
      } else {
        fill = 'hsl(' + (i * 30) + ',68%,55%)';
        selected = hues.indexOf(i) >= 0;
      }
      svg += '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' +
        (selected ? 7.5 : 5) + '" fill="' + fill + '"' +
        (selected ? ' stroke="#111111" stroke-width="2.4"' : ' opacity="0.5"') + '/>';
    }
    svg += '</svg>';
    el.innerHTML = svg;
  }

  /* ------------------------------------------------------------ diagram --- */
  var SVGNS = 'http://www.w3.org/2000/svg';

  function svgEl(name, attrs) {
    var e = document.createElementNS(SVGNS, name);
    for (var k in attrs) { if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]); }
    return e;
  }

  /* Reizend pakketje langs pad `d`. kp/kt = keyPoints/keyTimes van de beweging
     (0 = begin, 1 = einde van het pad); ov/ot = zichtbaarheid (opacity). */
  function packet(cls, d, to, period, begin, kp, kt, ov, ot) {
    var c = svgEl('circle', { 'class': cls, r: 7, 'data-to': to, opacity: 0 });
    var common = { dur: period + 's', begin: begin + 's', repeatCount: 'indefinite', calcMode: 'linear' };
    var motion = svgEl('animateMotion', common);
    motion.setAttribute('path', d);
    motion.setAttribute('keyPoints', kp);
    motion.setAttribute('keyTimes', kt);
    var fade = svgEl('animate', common);
    fade.setAttribute('attributeName', 'opacity');
    fade.setAttribute('values', ov);
    fade.setAttribute('keyTimes', ot);
    c.appendChild(motion);
    c.appendChild(fade);
    return c;
  }

  function pathLen(p) {
    try { return p.getTotalLength(); } catch (e) { return 300; }
  }

  /* Alleen diagrammen op de actieve slide animeren (SMIL pauzeren elders). */
  function applyPause(svg) {
    if (!window.Reveal || typeof svg.pauseAnimations !== 'function') return;
    var sec = svg.closest('section');
    try {
      if (sec && sec.classList.contains('present')) svg.unpauseAnimations(); else svg.pauseAnimations();
    } catch (e) { /* noop */ }
  }

  var pauseWired = false;
  function wirePause() {
    if (pauseWired || !window.Reveal || typeof window.Reveal.on !== 'function') return;
    pauseWired = true;
    var update = function () {
      Array.prototype.forEach.call(document.querySelectorAll('.glr-diagram svg.glr-dedges'), applyPause);
    };
    window.Reveal.on('slidechanged', update);
    window.Reveal.on('ready', update);
  }

  function initDiagram(el) {
    if (el.dataset.glrDiagramReady === '1') return;
    var svg = el.querySelector('svg.glr-dedges');
    if (!svg) return;
    el.dataset.glrDiagramReady = '1';

    var mode = el.getAttribute('data-flow-anim') || 'none';
    var edges = Array.prototype.slice.call(svg.querySelectorAll('.glr-dedge'));

    edges.forEach(function (edge, idx) {
      var d = edge.getAttribute('d');
      var to = edge.getAttribute('data-to');
      var travel = Math.min(3, Math.max(1, pathLen(edge) / 240));
      var begin = (idx * 0.4).toFixed(1);
      if (mode === 'stream') {
        var flow = edge.cloneNode(false);
        flow.setAttribute('class', 'glr-dflow');
        flow.removeAttribute('pathLength');
        svg.appendChild(flow);
      } else if (mode === 'packets') {
        svg.appendChild(packet('glr-flow-packet', d, to, (travel / 0.85).toFixed(2), begin,
          '0;1;1', '0;0.85;1', '0;1;1;0;0', '0;0.06;0.8;0.85;1'));
      } else if (mode === 'ping-pong') {
        var period = (travel / 0.45).toFixed(2);
        svg.appendChild(packet('glr-flow-packet', d, to, period, begin,
          '0;1;1', '0;0.45;1', '0;1;1;0;0', '0;0.04;0.41;0.45;1'));
        svg.appendChild(packet('glr-flow-packet glr-flow-packet--response', d, to, period, begin,
          '1;1;0;0', '0;0.5;0.95;1', '0;0;1;1;0;0', '0;0.5;0.54;0.91;0.95;1'));
      }
    });

    /* Fragment-knooppunten: pijlen/pakketjes verschijnen pas mét het knooppunt. */
    var frags = Array.prototype.slice.call(el.querySelectorAll('.glr-dnode.fragment'));
    if (frags.length) {
      var sync = function () {
        frags.forEach(function (n) {
          var hidden = !n.classList.contains('visible');
          Array.prototype.forEach.call(svg.querySelectorAll('[data-to="' + n.getAttribute('data-i') + '"]'), function (x) {
            x.classList.toggle('is-frag-hidden', hidden);
          });
        });
      };
      sync();
      if (window.MutationObserver) {
        var mo = new MutationObserver(sync);
        frags.forEach(function (n) { mo.observe(n, { attributes: true, attributeFilter: ['class'] }); });
      }
    }

    wirePause();
    applyPause(svg);
  }

  /* ---------------------------------------------------------------- api --- */
  function initAll(scope) {
    var ctx = scope || document;
    Array.prototype.forEach.call(ctx.querySelectorAll('.timer'), initTimer);
    Array.prototype.forEach.call(ctx.querySelectorAll('.harm-wheel'), buildWheel);
    Array.prototype.forEach.call(ctx.querySelectorAll('.glr-diagram'), initDiagram);
  }

  window.GLRPlugins = { initTimers: initTimer, initWheels: buildWheel, initDiagrams: initDiagram, initAll: initAll };

  function boot() { initAll(document); }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

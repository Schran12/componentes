/**
 * HUELINE — shared UI (Lenis, nav, commerce, overlays, media fallbacks).
 */
(function () {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STORAGE_BAG = 'hl_bag_v1';
  const STORAGE_SAVED = 'hl_saved_v1';
  const STORAGE_PIN = 'hl_pincode_v1';

  let lenis = null;
  let overlayStack = [];
  let lastFocus = null;

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function $$(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  function lockScroll(on) {
    document.body.classList.toggle('is-locked', on);
    if (lenis) {
      if (on) lenis.stop();
      else lenis.start();
    }
  }

  function openOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');
    overlayStack.push(id);
    lockScroll(true);
    const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();
  }

  function closeOverlay(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');
    overlayStack = overlayStack.filter((x) => x !== id);
    if (!overlayStack.length) lockScroll(false);
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  function closeTopOverlay() {
    const id = overlayStack[overlayStack.length - 1];
    if (id) closeOverlay(id);
  }

  /* ——— Storage ——— */
  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function getBag() {
    return readJSON(STORAGE_BAG, []);
  }
  function setBag(items) {
    writeJSON(STORAGE_BAG, items);
    updateBadges();
    renderDrawerPanel('bag');
  }

  function getSaved() {
    return readJSON(STORAGE_SAVED, []);
  }
  function setSaved(items) {
    writeJSON(STORAGE_SAVED, items);
    updateBadges();
    renderDrawerPanel('saved');
  }

  function updateBadges() {
    const bag = getBag();
    const saved = getSaved();
    const bagEl = $('[data-badge="bag"]');
    const savedEl = $('[data-badge="saved"]');
    if (bagEl) {
      bagEl.textContent = bag.length ? String(bag.length) : '';
      bagEl.hidden = !bag.length;
    }
    if (savedEl) {
      savedEl.textContent = saved.length ? String(saved.length) : '';
      savedEl.hidden = !saved.length;
    }
  }

  function addToBag(product, size) {
    const bag = getBag();
    bag.push({
      code: product.code,
      size: size || 'M',
      ts: Date.now(),
    });
    setBag(bag);
  }

  function toggleSaved(product) {
    let saved = getSaved();
    const i = saved.indexOf(product.code);
    if (i >= 0) saved.splice(i, 1);
    else saved.push(product.code);
    setSaved(saved);
  }

  function isSaved(code) {
    return getSaved().includes(code);
  }

  /* ——— Media ——— */
  function dyeHex(colour) {
    return (window.HL && HL.PALETTE[colour]) || '#6a6773';
  }

  function mediaImg(asset, product, alt, className) {
    const wrap = document.createElement('div');
    wrap.className = className || 'hl-media-wrap';
    const img = document.createElement('img');
    img.alt = alt || '';
    img.loading = 'lazy';
    img.decoding = 'async';
    const fb = document.createElement('div');
    fb.className = 'hl-media-fallback';
    fb.style.setProperty('--fb', product ? dyeHex(product.colour) : '#2b3fd6');
    fb.textContent = product ? product.colour : 'Hueline';
    fb.hidden = true;

    const tryAsset = asset || (product && product.images && product.images[0]);
    if (tryAsset && HL.ASSETS.includes(tryAsset)) {
      img.src = HL.src(tryAsset, 'jpg');
      img.onerror = () => {
        img.hidden = true;
        fb.hidden = false;
      };
    } else {
      img.hidden = true;
      fb.hidden = false;
      fb.style.setProperty('--fb', product ? dyeHex(product.colour) : '#2b3fd6');
    }
    wrap.appendChild(img);
    wrap.appendChild(fb);
    return wrap;
  }

  function fillMediaSlot(slot, asset, product, alt) {
    slot.innerHTML = '';
    const node = mediaImg(asset, product, alt);
    slot.appendChild(node.firstChild.tagName === 'IMG' ? node.firstChild : node);
    if (node.children.length > 1) slot.appendChild(node.lastChild);
  }

  function cardElement(product) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hl-card';
    btn.dataset.product = product.code;
    btn.style.setProperty('--cc', product.colourHex);
    btn.setAttribute('data-cursor', 'color');

    const media = document.createElement('div');
    media.className = 'hl-card-media';
    const mainWrap = mediaImg(product.images[0], product, product.name);
    while (mainWrap.firstChild) media.appendChild(mainWrap.firstChild);

    const hover = document.createElement('div');
    hover.className = 'hl-card-hover';
    const v2 = product.views[1] || product.views[0];
    if (v2 && HL.ASSETS.includes(v2.asset)) {
      const hImg = document.createElement('img');
      hImg.alt = '';
      hImg.src = HL.src(v2.asset, 'jpg');
      hImg.style.objectPosition = v2.pos;
      hImg.onerror = () => {
        const f = document.createElement('div');
        f.className = 'hl-media-fallback';
        f.style.setProperty('--fb', product.colourHex);
        hImg.replaceWith(f);
      };
      hover.appendChild(hImg);
    } else {
      const f = document.createElement('div');
      f.className = 'hl-media-fallback';
      f.style.setProperty('--fb', product.colourHex);
      hover.appendChild(f);
    }
    media.appendChild(hover);

    const body = document.createElement('div');
    body.className = 'hl-card-body';
    body.innerHTML = `<p class="hl-card-name">${product.name}</p>
      <p class="hl-card-fabric">${product.fabric}</p>
      <div class="hl-card-meta"><span class="t-price">${HL.formatPrice(product.price)}</span>
      <span class="hl-dye-dot" style="--dot:${product.colourHex}"></span></div>`;

    btn.append(media, body);
    return btn;
  }

  /* ——— Toast ——— */
  function toast(msg) {
    let el = $('#hl-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'hl-toast';
      el.className = 'hl-toast';
      el.setAttribute('role', 'status');
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('is-show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('is-show'), 2800);
  }

  /* ——— Footer ——— */
  function buildFooter() {
    const mount = $('#hl-footer-mount');
    if (!mount) return;
    mount.innerHTML = `<footer class="hl-footer" id="shop">
      <div class="hl-footer-top">
        <div>
          <p class="hl-footer-mark t-cond">HUE<span class="t-display" style="font-size:.85em">line</span></p>
          <p style="max-width:32ch;color:var(--mute);font-size:.95rem;margin-top:1rem">Saturation SS27 — womenswear dyed by hand in Bagru, cut in Jaipur.</p>
        </div>
        <div class="hl-footer-col"><h3>Explore</h3><ul>
          <li><a href="#wardrobe">Wardrobe</a></li>
          <li><a href="#lookbook">Lookbook</a></li>
          <li><a href="#colour">Colour</a></li>
          <li><a href="#shop-grid">Shop</a></li>
        </ul></div>
        <div class="hl-footer-col"><h3>Help</h3><ul>
          <li><a href="#" data-action="size-chart">Size chart</a></li>
          <li><a href="#">Shipping</a></li>
          <li><a href="#">Returns</a></li>
        </ul></div>
        <div class="hl-footer-col"><h3>Newsletter</h3>
          <p style="font-size:.9rem;color:var(--mute)">Drop notes — no spam, only colour.</p>
          <form class="hl-newsletter" id="hl-newsletter"><input type="email" placeholder="Email" aria-label="Email" required />
          <button type="submit">Join</button></form>
        </div>
      </div>
      <p class="hl-footer-small">© Hueline Studio · SS27 Saturation · Crafted without a build step</p>
    </footer>`;
    $('#hl-newsletter')?.addEventListener('submit', (e) => {
      e.preventDefault();
      toast('Welcome to the dye list');
      e.target.reset();
    });
  }

  /* ——— Nav ——— */
  function initNav() {
    const nav = $('.hl-nav');
    if (!nav) return;
    const hero = $('.hl-hero');
    if (hero) nav.classList.add('is-hero');

    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      nav.classList.toggle('is-solid', y > 80);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    $('[data-action="search"]')?.addEventListener('click', () => openOverlay('hl-search'));
    $('[data-action="bag"]')?.addEventListener('click', () => openOverlay('hl-drawer'));
    $('[data-action="saved"]')?.addEventListener('click', () => {
      openOverlay('hl-drawer');
      setDrawerTab('saved');
    });
    $('[data-action="menu"]')?.addEventListener('click', () => openOverlay('hl-mobile-menu'));
    $$('.hl-nav-links a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (target) {
          e.preventDefault();
          if (lenis) lenis.scrollTo(target, { offset: -64 });
          else target.scrollIntoView({ behavior: 'smooth' });
          closeOverlay('hl-mobile-menu');
        }
      });
    });
  }

  /* ——— Drawer ——— */
  function setDrawerTab(tab) {
    $$('.hl-drawer-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.tab === tab));
    $$('[data-drawer-panel]').forEach((p) => {
      p.hidden = p.dataset.drawerPanel !== tab;
    });
  }

  function renderDrawerPanel(which) {
    const panel = $(`[data-drawer-panel="${which}"]`);
    if (!panel) return;
    panel.innerHTML = '';
    const codes = which === 'bag' ? getBag().map((x) => x.code) : getSaved();
    if (!codes.length) {
      panel.innerHTML = `<p class="t-mono" style="color:var(--mute)">${which === 'bag' ? 'Your bag is empty' : 'Nothing saved yet'}</p>`;
      return;
    }
    const list = which === 'bag' ? getBag() : getSaved().map((c) => ({ code: c, size: 'M' }));
    list.forEach((entry) => {
      const p = HL.byCode(entry.code);
      const row = document.createElement('div');
      row.className = 'hl-drawer-item';
      const thumb = mediaImg(p.images[0], p, p.name);
      row.appendChild(thumb);
      const meta = document.createElement('div');
      meta.innerHTML = `<p class="t-mono">${p.styleLabel} · ${p.colour}</p><p>${p.name}</p><p class="t-price">${HL.formatPrice(p.price)}</p>`;
      row.appendChild(meta);
      const link = document.createElement('a');
      link.href = `product.html?code=${encodeURIComponent(p.code)}`;
      link.className = 't-mono';
      link.textContent = 'View';
      row.appendChild(link);
      panel.appendChild(row);
    });
  }

  function initDrawer() {
    $$('.hl-drawer-tab').forEach((tab) => {
      tab.addEventListener('click', () => setDrawerTab(tab.dataset.tab));
    });
    $('[data-close="drawer"]')?.addEventListener('click', () => closeOverlay('hl-drawer'));
    renderDrawerPanel('bag');
    renderDrawerPanel('saved');
  }

  /* ——— Search ——— */
  function initSearch() {
    const input = $('#hl-search-input');
    const results = $('#hl-search-results');
    if (!input || !results) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      results.innerHTML = '';
      if (!q) return;
      HL.ALL.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q) ||
          p.colour.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q)
      )
        .slice(0, 12)
        .forEach((p) => {
          const a = document.createElement('a');
          a.href = `product.html?code=${encodeURIComponent(p.code)}`;
          a.className = 't-mono';
          a.textContent = `${p.code} — ${p.name}`;
          results.appendChild(a);
        });
    });
    $('[data-close="search"]')?.addEventListener('click', () => closeOverlay('hl-search'));
  }

  /* ——— Quick view ——— */
  function openQuickView(code) {
    const p = HL.byCode(code);
    const qv = $('#hl-qv');
    if (!qv || !p) return;
    $('#hl-qv-body').innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'hl-qv-grid';
    const left = document.createElement('div');
    left.appendChild(mediaImg(p.images[0], p, p.name));
    const right = document.createElement('div');
    right.style.padding = 'clamp(1.25rem,4vw,2rem)';
    right.innerHTML = `<p class="t-mono">${p.styleLabel} · ${p.colour}</p>
      <h2 class="t-cond" style="font-size:1.5rem;margin:.35rem 0">${p.name}</h2>
      <p style="color:var(--mute)">${p.fabric}</p>
      <p class="t-price" style="margin:1rem 0">${HL.formatPrice(p.price)}</p>
      <div class="hl-pdp-actions">
        <button type="button" class="hl-btn-primary" data-qv-bag>Add to bag</button>
        <a class="hl-btn-ghost" href="product.html?code=${encodeURIComponent(p.code)}">Full details</a>
      </div>`;
    grid.append(left, right);
    $('#hl-qv-body').appendChild(grid);
    $('[data-qv-bag]', qv)?.addEventListener('click', () => {
      addToBag(p, 'M');
      toast('Added to bag');
      setTimeout(() => openOverlay('hl-drawer'), 650);
    });
    openOverlay('hl-qv');
  }

  function initQuickView() {
    document.addEventListener('click', (e) => {
      const card = e.target.closest('[data-product]');
      if (card && !e.target.closest('a')) {
        e.preventDefault();
        openQuickView(card.dataset.product);
      }
    });
    $('[data-close="qv"]')?.addEventListener('click', () => closeOverlay('hl-qv'));
  }

  /* ——— Cursor ——— */
  function initCursor() {
    if (REDUCED || !window.matchMedia('(hover: hover)').matches) return;
    const ring = document.createElement('div');
    ring.className = 'hl-cursor';
    const dot = document.createElement('div');
    dot.className = 'hl-cursor-dot';
    const label = document.createElement('div');
    label.className = 'hl-cursor-label';
    document.body.append(ring, dot, label);

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    document.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });
    function tick() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      label.style.transform = `translate(${mx}px, ${my + 22}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    document.addEventListener('mouseover', (e) => {
      const t = e.target.closest('a, button, [data-product], [data-cursor]');
      ring.classList.toggle('is-big', !!t);
      const col = t && getComputedStyle(t).getPropertyValue('--cc').trim();
      if (col) ring.style.borderColor = col;
      const lbl = t && t.getAttribute('data-cursor-label');
      label.textContent = lbl || '';
      label.classList.toggle('is-on', !!lbl);
    });
  }

  /* ——— Magnetic buttons ——— */
  function initMagnetic() {
    if (REDUCED) return;
    $$('.hl-pill, .hl-btn-primary, [data-magnetic]').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  /* ——— Lenis + ScrollTrigger ——— */
  function initSmoothScroll() {
    if (typeof Lenis === 'undefined' || typeof gsap === 'undefined') return;
    lenis = new Lenis({ lerp: REDUCED ? 1 : 0.08, smoothWheel: !REDUCED });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ——— Reveal helpers ——— */
  function initReveals() {
    if (REDUCED || typeof gsap === 'undefined') {
      $$('[data-lines]').forEach((el) => {
        el.innerHTML = el.textContent;
      });
      return;
    }
    $$('.mask-line').forEach((line) => {
      const inner = line.querySelector('span');
      if (inner) {
        gsap.from(inner, {
          yPercent: 110,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: line, start: 'top 88%' },
        });
      }
    });
    $$('[data-lines]').forEach((el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(' ');
      gsap.to(el.querySelectorAll('.w'), {
        opacity: 1,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });
    $$('[data-reveal="img"]').forEach((wrap) => {
      gsap.from(wrap, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.2,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: wrap, start: 'top 80%' },
      });
      const media = wrap.querySelector('img, video, .hl-media-fallback');
      if (media) {
        gsap.from(media, {
          scale: 1.35,
          duration: 1.4,
          ease: 'power2.out',
          scrollTrigger: { trigger: wrap, start: 'top 80%' },
        });
      }
    });
  }

  /* ——— Loader + Hero (index) ——— */
  function initLoaderHero() {
    const loader = $('#hl-loader');
    const hero = $('.hl-hero');
    if (!hero) return;

    const title = $('.hl-hero-title');
    if (title && !title.dataset.split) {
      title.dataset.split = '1';
      title.querySelectorAll('.hl-hero-line-1, .hl-hero-line-3').forEach((line) => {
        const text = line.textContent;
        line.textContent = '';
        text.split('').forEach((c) => {
          const s = document.createElement('span');
          s.className = 'char';
          s.textContent = c === ' ' ? '\u00a0' : c;
          line.appendChild(s);
        });
      });
    }

    if (REDUCED || !loader || typeof gsap === 'undefined') {
      loader?.remove();
      return;
    }

    if (lenis) lenis.stop();
    const countEl = $('.hl-loader-count');
    const bands = $$('.hl-loader-band');
    const obj = { v: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        loader.remove();
        if (lenis) lenis.start();
      },
    });

    tl.to(bands, {
      scaleY: 1,
      duration: 0.9,
      stagger: 0.08,
      ease: 'expo.inOut',
      transformOrigin: 'bottom center',
    })
      .to(
        obj,
        {
          v: 100,
          duration: 1.8,
          ease: 'power1.inOut',
          onUpdate: () => {
            if (countEl) countEl.textContent = String(Math.round(obj.v)).padStart(3, '0');
          },
        },
        0
      )
      .to(countEl, { opacity: 0, duration: 0.35 }, '-=0.4')
      .to(
        bands,
        {
          yPercent: -100,
          duration: 0.85,
          stagger: { each: 0.07, from: 'center' },
          ease: 'expo.inOut',
        },
        '-=0.85'
      );

    const heroTl = gsap.timeline({ delay: 0.35 });
    heroTl
      .to('.hl-hero-media', {
        clipPath: 'inset(0% 0% 0% 0% round 0px)',
        scale: 1,
        duration: 1.6,
        ease: 'expo.out',
      })
      .from(
        '.hl-hero-title .char',
        { yPercent: 115, rotation: 6, opacity: 1, duration: 0.9, stagger: 0.025, ease: 'power3.out' },
        '-=1.1'
      )
      .to('.hl-hero-eyebrow, .hl-hero-foot', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.6');

    const video = $('.hl-hero-media video');
    if (video) {
      video.addEventListener('playing', () => video.removeAttribute('poster'));
    }

    const pin = $('.hl-hero-pin');
    if (pin && ScrollTrigger) {
      const archWide = 'inset(13% 34% 9% 34% round 600px 600px 18px 18px)';
      const archNarrow = 'inset(16% 18% 14% 18% round 420px 420px 18px 18px)';
      const mm = gsap.matchMedia();
      mm.add('(min-width: 700px)', () => {
        ScrollTrigger.create({
          trigger: pin,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 1,
          animation: gsap
            .timeline()
            .to('.hl-hero-media', { clipPath: archWide, scale: 1, duration: 1 })
            .to('.hl-hero-ground', { opacity: 1, duration: 0.4 }, 0)
            .to('.hl-hero-line-1', { xPercent: -120, opacity: 0, duration: 0.5 }, 0.2)
            .to('.hl-hero-line-3', { xPercent: 120, opacity: 0, duration: 0.5 }, 0.2)
            .to('.hl-hero-colour', { scale: 0.6, opacity: 0, duration: 0.45 }, 0.25)
            .to('.hl-hero-pane', { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, 0.45)
            .to('.hl-hero-arch-note', { opacity: 1, duration: 0.5 }, 0.55),
        });
      });
      mm.add('(max-width: 699px)', () => {
        ScrollTrigger.create({
          trigger: pin,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 1,
          animation: gsap.timeline().to('.hl-hero-media', { clipPath: archNarrow, scale: 1, duration: 1 }),
        });
      });
    }
  }

  /* ——— Index sections ——— */
  function initIndex() {
    if (!$('#hl-page-home')) return;

    /* Arches */
    const archData = HL.STYLES.map((s, i) => ({
      style: s,
      asset: ['look-01', 'look-02', 'look-03', 'look-04', 'look-05', 'look-06'][i],
    }));
    const archMount = $('#hl-arches');
    archData.forEach(({ style, asset }) => {
      const el = document.createElement('article');
      el.className = 'hl-arch';
      const imgWrap = document.createElement('div');
      imgWrap.dataset.reveal = 'img';
      imgWrap.style.height = '100%';
      const prod = HL.ALL.find((p) => p.styleCode === style.code);
      imgWrap.appendChild(mediaImg(asset, prod, `${style.label} arch`));
      el.appendChild(imgWrap);
      const cap = document.createElement('div');
      cap.className = 'hl-arch-cap';
      cap.innerHTML = `<p class="t-cond">${style.label}</p><p class="t-mono">${style.items.length} pieces</p>`;
      el.appendChild(cap);
      archMount.appendChild(el);
    });

    if (!REDUCED && typeof gsap !== 'undefined') {
      gsap.to('.hl-arch', {
        clipPath: 'inset(0% 0% 0% 0)',
        duration: 1.1,
        stagger: 0.08,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: archMount, start: 'top 75%' },
      });
      $$('.hl-arch').forEach((arch, i) => {
        const y = [-50, 40, -80, 30, -40, 60][i];
        gsap.to(arch, {
          y,
          ease: 'none',
          scrollTrigger: { trigger: archMount, scrub: true, start: 'top bottom', end: 'bottom top' },
        });
      });
    }

    initWardrobe();
    initRails();
    initLookbook();
    initColourStory();
    initShop();
    initFilmBand();
    initAtelier();
  }

  function initWardrobe() {
    const stage = $('#hl-wardrobe-stage');
    const ring = $('#hl-wardrobe-ring');
    const cap = $('#hl-wardrobe-cap');
    if (!stage || !ring) return;

    let styleCode = 'T';
    let rot = 0;
    let target = 0;
    let dragging = false;
    let lastX = 0;
    const CARD_COUNT = 14;

    function productsForStyle(code) {
      return HL.ALL.filter((p) => p.styleCode === code);
    }

    function buildRing() {
      ring.innerHTML = '';
      const items = productsForStyle(styleCode);
      const list = [];
      while (list.length < CARD_COUNT) list.push(...items);
      const cardW = ring.parentElement.clientWidth < 700 ? 100 : 168;
      const R = (cardW / 2) / Math.tan(Math.PI / CARD_COUNT) * 1.12;

      list.slice(0, CARD_COUNT).forEach((p, i) => {
        const card = document.createElement('div');
        card.className = 'hl-wardrobe-card';
        card.dataset.code = p.code;
        const inner = document.createElement('div');
        inner.className = 'hl-wardrobe-card-inner';
        inner.appendChild(mediaImg(p.images[0], p, p.name));
        card.appendChild(inner);
        const angle = (i * 360) / CARD_COUNT;
        card.style.transform = `rotateY(${angle}deg) translateZ(-${R}px)`;
        ring.appendChild(card);
      });
      ring.dataset.radius = String(R);
      updateCaption();
    }

    function updateCaption() {
      if (!cap) return;
      const cards = $$('.hl-wardrobe-card', ring);
      let best = null;
      let bestAngle = Infinity;
      const current = ((rot % 360) + 360) % 360;
      cards.forEach((c, i) => {
        const a = (i * 360) / CARD_COUNT;
        let diff = Math.abs(a - current);
        if (diff > 180) diff = 360 - diff;
        if (diff < bestAngle) {
          bestAngle = diff;
          best = c;
        }
        const visible = diff <= 58 ? 1 : diff >= 84 ? 0 : 1 - (diff - 58) / 26;
        c.style.opacity = visible;
        c.querySelector('.hl-wardrobe-card-inner').style.filter = `brightness(${0.55 + visible * 0.45})`;
      });
      if (best && cap.dataset.code !== best.dataset.code) {
        cap.dataset.code = best.dataset.code;
        const p = HL.byCode(best.dataset.code);
        cap.innerHTML = `<p class="t-mono">${p.styleLabel} · ${p.colour}</p>
          <p class="t-cond" style="font-size:1.1rem;margin:.25rem 0">${p.name}</p>
          <p style="color:var(--mute);font-size:.9rem">${p.fabric}</p>
          <p class="t-price">${HL.formatPrice(p.price)}</p>`;
        if (!REDUCED && typeof gsap !== 'undefined') {
          gsap.from(cap, { y: 12, opacity: 0, duration: 0.45, ease: 'power2.out' });
        }
      }
    }

    function render() {
      const R = parseFloat(ring.dataset.radius || '400');
      ring.style.transform = `translate(-50%, -50%) translateZ(${R * 0.55}px) rotateY(${rot}deg)`;
      updateCaption();
    }

    function loop() {
      target -= 0.035;
      rot += (target - rot) * 0.085;
      render();
      requestAnimationFrame(loop);
    }

    stage.addEventListener('pointerdown', (e) => {
      dragging = true;
      lastX = e.clientX;
      stage.setPointerCapture(e.pointerId);
      stage.classList.add('is-dragging');
    });
    stage.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      target += dx * 0.14;
    });
    stage.addEventListener('pointerup', () => {
      dragging = false;
      stage.classList.remove('is-dragging');
    });

    $$('.hl-wardrobe-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.hl-wardrobe-tab').forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        styleCode = tab.dataset.style;
        buildRing();
      });
    });

    buildRing();
    requestAnimationFrame(loop);

    if (ScrollTrigger) {
      ScrollTrigger.create({
        onUpdate: (self) => {
          target += self.getVelocity() * 0.0008;
        },
      });
    }
  }

  function initRailTrack(track) {
    let x = 0;
    let vx = 0;
    let dragging = false;
    let startX = 0;
    let startTx = 0;
    const speed = REDUCED ? 0 : 0.35;

    function width() {
      return track.scrollWidth / 2;
    }

    function duplicate() {
      const kids = Array.from(track.children);
      kids.forEach((k) => track.appendChild(k.cloneNode(true)));
    }
    duplicate();

    function tick() {
      if (!dragging) {
        x -= speed + vx;
        vx *= 0.92;
        const w = width();
        if (x <= -w) x += w;
        if (x > 0) x -= w;
      }
      track.style.transform = `translateX(${x}px)`;
      requestAnimationFrame(tick);
    }

    track.addEventListener('pointerdown', (e) => {
      dragging = true;
      startX = e.clientX;
      startTx = x;
      track.classList.add('is-dragging');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      x = startTx + (e.clientX - startX);
    });
    track.addEventListener('pointerup', (e) => {
      dragging = false;
      track.classList.remove('is-dragging');
      vx = (e.clientX - startX) * 0.08;
    });
    track.addEventListener('mouseenter', () => {
      if (!REDUCED) track.dataset.pause = '1';
    });
    track.addEventListener('mouseleave', () => {
      track.dataset.pause = '0';
    });
    requestAnimationFrame(tick);
  }

  function initRails() {
    $$('.hl-rail-track').forEach((track) => {
      const styleCode = track.dataset.style;
      HL.ALL.filter((p) => p.styleCode === styleCode).forEach((p) => {
        track.appendChild(cardElement(p));
      });
      initRailTrack(track);
    });
  }

  function initLookbook() {
    const pin = $('.hl-lookbook-pin');
    const track = $('.hl-lookbook-track');
    if (!pin || !track || typeof gsap === 'undefined') return;

    if (REDUCED || window.innerWidth < 700) return;

    const panels = $$('.hl-look-panel', track);
    gsap.to(track, {
      x: () => -(track.scrollWidth - window.innerWidth),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        pin: true,
        scrub: 1,
        end: () => '+=' + track.scrollWidth,
      },
    });
    panels.forEach((panel) => {
      const frame = $('.hl-look-frame', panel);
      gsap.to(frame, {
        clipPath: 'inset(0 0% 0 0)',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: gsap.getById?.('lookScroll'),
          start: 'left 80%',
          end: 'left 40%',
          scrub: true,
        },
      });
    });
  }

  function initColourStory() {
    const section = $('#hl-colour');
    if (!section || typeof ScrollTrigger === 'undefined') return;
    const roll = $('.hl-colour-roll-inner');
    HL.DYE_SWATCHES.forEach((sw, i) => {
      ScrollTrigger.create({
        trigger: $(`#swatch-${sw.key}`, section),
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setColour(sw, 1),
        onEnterBack: () => setColour(sw, -1),
      });
    });

    function setColour(sw, dir) {
      section.style.setProperty('--sbg', sw.bg);
      section.style.setProperty('--sfg', sw.fg);
      if (roll && !REDUCED) {
        gsap.fromTo(
          roll,
          { yPercent: dir > 0 ? 100 : -100 },
          { yPercent: 0, duration: 0.6, ease: 'power3.out' }
        );
        roll.textContent = sw.name;
      } else if (roll) roll.textContent = sw.name;
      const ref = $('#hl-colour-ref');
      const rec = $('#hl-colour-recipe-text');
      if (ref) ref.textContent = sw.ref;
      if (rec) rec.textContent = sw.recipe;
    }
  }

  function initShop() {
    const grid = $('#hl-shop-grid');
    if (!grid) return;
    let filter = 'all';
    let sort = 'featured';
    let showAll = false;

    function renderShop() {
      let list = HL.ALL.slice();
      if (filter !== 'all') list = list.filter((p) => p.styleCode === filter);
      if (sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));

      const visible = showAll ? list : list.slice(0, 12);
      const prev = Array.from(grid.children);
      const state = prev.length && typeof Flip !== 'undefined' ? Flip.getState(prev) : null;
      grid.innerHTML = '';
      visible.forEach((p) => grid.appendChild(cardElement(p)));
      const count = $('#hl-shop-count');
      if (count) count.textContent = `Showing ${visible.length} of ${list.length} pieces`;

      if (state && typeof Flip !== 'undefined' && !REDUCED) {
        Flip.from(state, {
          duration: 0.8,
          ease: 'expo.inOut',
          stagger: 0.02,
          absolute: true,
          scale: true,
          onEnter: (els) =>
            gsap.from(els, { opacity: 0, scale: 0.85, duration: 0.5, ease: 'power2.out' }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.92, duration: 0.35 }),
        });
      }
    }

    $$('.hl-shop-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        $$('.hl-shop-tab').forEach((t) => t.classList.remove('is-active'));
        tab.classList.add('is-active');
        filter = tab.dataset.filter;
        renderShop();
      });
    });
    $('#hl-shop-sort')?.addEventListener('change', (e) => {
      sort = e.target.value;
      renderShop();
    });
    $('#hl-shop-toggle')?.addEventListener('click', () => {
      showAll = !showAll;
      const btn = $('#hl-shop-toggle');
      if (btn) btn.textContent = showAll ? 'Show fewer pieces' : 'Show all 24 pieces';
      renderShop();
    });

    renderShop();
  }

  function initFilmBand() {
    const frame = $('.hl-film-frame');
    const video = $('video', frame);
    if (!frame || typeof gsap === 'undefined' || REDUCED) return;
    gsap.to(frame, {
      clipPath: 'inset(0 0% round 18px)',
      scale: 1,
      ease: 'none',
      scrollTrigger: { trigger: frame, scrub: true, start: 'top 80%', end: 'bottom 40%' },
    });
    if (video) {
      ScrollTrigger.create({
        trigger: frame,
        start: 'top 90%',
        end: 'bottom 10%',
        onEnter: () => video.play().catch(() => {}),
        onEnterBack: () => video.play().catch(() => {}),
        onLeave: () => video.pause(),
        onLeaveBack: () => video.pause(),
      });
    }
  }

  function initAtelier() {
    const photo = $('.hl-atelier-photo');
    if (photo && !REDUCED && typeof gsap !== 'undefined') {
      gsap.to(photo, {
        clipPath: 'inset(0% 0% 0% 0)',
        duration: 1.2,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: photo, start: 'top 80%' },
      });
    }
    $$('[data-count]').forEach((el) => {
      const end = parseInt(el.dataset.count, 10);
      if (REDUCED) {
        el.textContent = String(end);
        return;
      }
      const obj = { v: 0 };
      gsap.to(obj, {
        v: end,
        duration: 1.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%' },
        onUpdate: () => {
          el.textContent = String(Math.round(obj.v));
        },
      });
    });
  }

  /* ——— Product page ——— */
  function initProductPage() {
    const root = $('#hl-page-product');
    if (!root) return;
    const params = new URLSearchParams(location.search);
    const code = params.get('code') || 'HL-T-01';
    const p = HL.byCode(code);
    document.documentElement.style.setProperty('--accent', p.colourHex);

    const title = $('#hl-pdp-title');
    if (title) title.textContent = p.name;
    $('#hl-pdp-style') && ($('#hl-pdp-style').textContent = `${p.styleLabel} · ${p.colour}`);
    $('#hl-pdp-fabric') && ($('#hl-pdp-fabric').textContent = p.fabric);
    $('#hl-pdp-price') && ($('#hl-pdp-price').textContent = HL.formatPrice(p.price));

    const main = $('#hl-pdp-main');
    const thumbs = $('#hl-pdp-thumbs');
    let active = 0;

    function showView(i) {
      active = i;
      const v = p.views[i];
      main.innerHTML = '';
      const img = document.createElement('img');
      img.alt = p.name;
      if (HL.ASSETS.includes(v.asset)) {
        img.src = HL.src(v.asset, 'jpg');
        img.style.objectPosition = v.pos;
        img.onerror = () => {
          main.innerHTML = '';
          const f = document.createElement('div');
          f.className = 'hl-media-fallback';
          f.style.setProperty('--fb', p.colourHex);
          main.appendChild(f);
        };
      } else {
        const f = document.createElement('div');
        f.className = 'hl-media-fallback';
        f.style.setProperty('--fb', p.colourHex);
        main.appendChild(f);
        return;
      }
      main.appendChild(img);
      $$('.hl-pdp-thumb').forEach((t, idx) => t.classList.toggle('is-active', idx === i));
    }

    p.views.forEach((v, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hl-pdp-thumb' + (i === 0 ? ' is-active' : '');
      const img = document.createElement('img');
      img.alt = '';
      if (HL.ASSETS.includes(v.asset)) {
        img.src = HL.src(v.asset, 'jpg');
        img.style.objectPosition = v.pos;
      } else {
        btn.appendChild(
          Object.assign(document.createElement('div'), {
            className: 'hl-media-fallback',
            style: `--fb:${p.colourHex}`,
          })
        );
      }
      if (img.src) btn.appendChild(img);
      btn.addEventListener('click', () => showView(i));
      thumbs.appendChild(btn);
    });
    showView(0);

    main?.addEventListener('mousemove', (e) => {
      if (!main.classList.contains('is-zoom')) return;
      const r = main.getBoundingClientRect();
      const zx = ((e.clientX - r.left) / r.width) * 100;
      const zy = ((e.clientY - r.top) / r.height) * 100;
      main.style.setProperty('--zx', zx + '%');
      main.style.setProperty('--zy', zy + '%');
    });
    main?.addEventListener('click', () => main.classList.toggle('is-zoom'));

    const swRow = $('#hl-swatches-row');
    Object.entries(HL.PALETTE).forEach(([name, hex]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'hl-dye-dot';
      b.style.setProperty('--dot', hex);
      b.title = name;
      b.addEventListener('click', () => document.documentElement.style.setProperty('--accent', hex));
      swRow?.appendChild(b);
    });

    let size = 'M';
    $$('.hl-size-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        $$('.hl-size-chip').forEach((c) => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        size = chip.dataset.size;
        const chart = $('#hl-size-chart-text');
        const map = {
          XS: '80 / 62 / 88',
          S: '84 / 66 / 92',
          M: '88 / 70 / 96',
          L: '92 / 74 / 100',
          XL: '96 / 78 / 104',
        };
        if (chart) chart.textContent = `Size ${size} — bust / waist / hip (cm): ${map[size]}`;
      });
    });

    $('#hl-add-bag')?.addEventListener('click', () => {
      addToBag(p, size);
      toast('Added to bag');
      setTimeout(() => openOverlay('hl-drawer'), 650);
    });
    $('#hl-save')?.addEventListener('click', () => {
      toggleSaved(p);
      toast(isSaved(p.code) ? 'Saved' : 'Removed from saved');
    });

    initPincode();

    const related = HL.ALL.filter((x) => x.styleCode === p.styleCode && x.code !== p.code).slice(0, 4);
    const relGrid = $('#hl-related-grid');
    related.forEach((rp) => relGrid?.appendChild(cardElement(rp)));
  }

  function initPincode() {
    const input = $('#hl-pincode-input');
    const out = $('#hl-pincode-result');
    if (!input || !out) return;
    const saved = localStorage.getItem(STORAGE_PIN);
    if (saved) {
      input.value = saved;
      compute(saved);
    }
    input.addEventListener('change', () => {
      const v = input.value.replace(/\D/g, '').slice(0, 6);
      input.value = v;
      if (v.length === 6) {
        localStorage.setItem(STORAGE_PIN, v);
        compute(v);
      }
    });

    function addWorkingDays(from, days) {
      const d = new Date(from);
      let left = days;
      while (left > 0) {
        d.setDate(d.getDate() + 1);
        if (d.getDay() !== 0) left--;
      }
      return d;
    }

    function compute(pin) {
      const prefix2 = pin.slice(0, 2);
      let transit = 5;
      if (/^3[0-4]/.test(pin)) transit = 2;
      else if (['11', '12', '40', '41', '50', '56', '60', '70'].includes(prefix2)) transit = 3;
      const arrive = addWorkingDays(new Date(), transit);
      const fmt = arrive.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
      const free = HL.byCode(new URLSearchParams(location.search).get('code') || 'HL-T-01').price >= 25000;
      out.innerHTML = `Arrives by ${fmt}. ${free ? 'Free shipping on this piece.' : 'Free shipping over ₹25,000.'} Transit excludes Sundays.`;
    }
  }

  /* ——— Global keyboard ——— */
  function initGlobal() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTopOverlay();
    });
    $$('[data-close-overlay]').forEach((btn) => {
      btn.addEventListener('click', () => closeTopOverlay());
    });
    $('#hl-mobile-menu')?.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => closeOverlay('hl-mobile-menu'));
    });
    updateBadges();
  }

  function initVideoFallbacks() {
    $$('video').forEach((video) => {
      const fb = video.nextElementSibling;
      video.addEventListener('error', () => {
        video.hidden = true;
        if (fb && fb.classList.contains('hl-media-fallback')) fb.hidden = false;
      });
      if (REDUCED) {
        video.pause();
        video.removeAttribute('autoplay');
      }
    });
    const heroFb = $('.hl-hero-fallback');
    const heroVid = $('.hl-hero-media video');
    if (heroVid && heroFb) {
      heroVid.addEventListener('error', () => {
        heroVid.hidden = true;
        heroFb.style.display = 'block';
      });
    }
  }

  function boot() {
    buildFooter();
    initVideoFallbacks();
    initNav();
    initDrawer();
    initSearch();
    initQuickView();
    initCursor();
    initMagnetic();
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger, Flip);
    }
    initSmoothScroll();
    initReveals();
    initLoaderHero();
    initIndex();
    initProductPage();
    initGlobal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.HLUI = {
    toast,
    addToBag,
    openOverlay,
    closeOverlay,
    mediaImg,
  };
})();

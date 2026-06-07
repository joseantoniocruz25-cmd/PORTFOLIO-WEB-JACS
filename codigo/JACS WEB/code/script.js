const heroSection = document.querySelector('.hero-section');
const fullName    = document.getElementById('fullName');
const logoMark    = document.getElementById('logoMark');
const scrollCue   = document.getElementById('scrollCue');
const siteNav     = document.getElementById('siteNav');
const slogan      = document.getElementById('slogan');

document.getElementById('year').textContent = new Date().getFullYear();

// Split slogan into per-character spans for the bounce wave
slogan.innerHTML = [...slogan.textContent].map((char, i) =>
  char === ' '
    ? '<span class="slogan__space">&nbsp;</span>'
    : `<span class="slogan__char" style="animation-delay:${(i * 0.08).toFixed(2)}s">${char}</span>`
).join('');

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function mapRange(val, inMin, inMax, outMin, outMax) {
  const clamped = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)));
  return outMin + (outMax - outMin) * clamped;
}

let scrollReady = false;

fullName.addEventListener('animationend', () => {
  scrollReady = true;
  fullName.style.animation = 'none';
  fullName.style.opacity   = '1';
  fullName.style.transform = 'translateY(0) scale(1)';
});

function update() {
  const rect       = heroSection.getBoundingClientRect();
  const scrollable = heroSection.offsetHeight - window.innerHeight;
  const scrolled   = -rect.top;
  const raw        = Math.max(0, Math.min(1, scrolled / scrollable));

  if (scrollReady) {
    const nameOut = easeInOut(mapRange(raw, 0, 0.45, 0, 1));
    fullName.style.opacity   = String(1 - nameOut);
    fullName.style.transform = `translateY(${-nameOut * 32}px) scale(${1 - nameOut * 0.04})`;
  }

  const logoIn = easeInOut(mapRange(raw, 0.28, 0.90, 0, 1));
  logoMark.style.opacity   = String(logoIn);
  logoMark.style.transform = `scale(${0.65 + logoIn * 0.35})`;

  scrollCue.style.opacity = String(Math.max(0, 1 - raw * 7));

  const sloganIn  = easeInOut(mapRange(raw, 0.42, 0.80, 0, 1));
  const sloganOut = easeInOut(mapRange(raw, 0.88, 1.00, 0, 1));
  slogan.style.opacity = String(sloganIn * (1 - sloganOut));

  siteNav.classList.toggle('scrolled',     -rect.top > window.innerHeight * 0.8);
  siteNav.classList.toggle('logo-visible', logoIn > 0.5);
}

window.addEventListener('scroll', update, { passive: true });
update();
  /* ══════════════════════════════════════
       PROYECTOS — filtro con slide animado
       Cartelería / Ilustraciones: muestran galería
       de imágenes en lugar de filtrar el bento grid.
    ══════════════════════════════════════ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.bento-card');
    const bentoGrid  = document.getElementById('bentoGrid');
    const HIDE_MS    = 380;
    const SLIDE_MS   = 480;
    const STAGGER_MS = 75;

    /* ── Galerías especiales (clave = valor de data-filter) ── */
    const specialGalleries = {
      'Cartelería':    { el: document.getElementById('ctGallery'),    visible: false },
      'Ilustraciones': { el: document.getElementById('ilGallery'),    visible: false },
      'Fotografía':    { el: document.getElementById('fotGallery'),   visible: false },
      /* "Otros" se organiza en bloques (article), por eso usa display:block */
      'Otros':         { el: document.getElementById('otrosGallery'), visible: false, display: 'block' },
    };

    /* ── Aplicar filtro normal al bento grid ── */
    function applyBentoFilter(filter) {
      let visibleIdx = 0;

      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;

        if (match) {
          const idx = visibleIdx++;
          card.style.display = '';
          card.classList.remove('hidden');
          card.classList.add('in-view');
          card.style.animation = 'none';

          requestAnimationFrame(() => {
            card.style.animation =
              `filterSlideIn ${SLIDE_MS}ms cubic-bezier(0.16,1,0.3,1) ${idx * STAGGER_MS}ms both`;
            card.addEventListener('animationend', () => {
              card.style.animation         = '';
              card.style.animationDelay    = '';
              card.style.animationDuration = '';
            }, { once: true });
          });

        } else {
          card.style.animation = '';
          card.classList.add('hidden');
          setTimeout(() => {
            if (card.classList.contains('hidden')) card.style.display = 'none';
          }, HIDE_MS);
        }
      });
    }

    /* ── Animar entrada de una galería especial ── */
    function _revealGallery(g) {
      g.el.style.display = g.display || 'grid';
      g.el.querySelectorAll('.ct-cell').forEach((cell, i) => {
        cell.style.animationDelay = `${Math.min(i * 0.04, 0.9)}s`;
      });
      requestAnimationFrame(() => g.el.classList.add('ct-visible'));
      g.visible = true;
    }

    /* ── Mostrar una galería especial (oculta las otras) ── */
    function showSpecialGallery(key) {
      const target = specialGalleries[key];
      if (target.visible) return;

      /* Galerías especiales actualmente visibles (distintas al target) */
      const othersVisible = Object.values(specialGalleries).filter(g => g !== target && g.visible);

      if (othersVisible.length) {
        /* Otro panel especial está abierto: cerrar primero, luego abrir target */
        othersVisible.forEach(g => { g.el.classList.remove('ct-visible'); g.visible = false; });
        setTimeout(() => {
          othersVisible.forEach(g => { g.el.style.display = 'none'; });
          _revealGallery(target);
        }, HIDE_MS);
      } else {
        /* Solo el bento está visible: ocultarlo y abrir target */
        bentoGrid.classList.add('ct-hiding');
        setTimeout(() => {
          bentoGrid.style.display = 'none';
          _revealGallery(target);
        }, HIDE_MS);
      }
    }

    /* ── Ocultar todas las galerías especiales, restaurar bento ── */
    function hideAllSpecialGalleries(filter) {
      const visibles = Object.values(specialGalleries).filter(g => g.visible);

      if (!visibles.length) {
        applyBentoFilter(filter);
        return;
      }

      visibles.forEach(g => { g.el.classList.remove('ct-visible'); g.visible = false; });

      setTimeout(() => {
        visibles.forEach(g => { g.el.style.display = 'none'; });
        bentoGrid.style.display = '';
        bentoGrid.classList.remove('ct-hiding');
        applyBentoFilter(filter);
      }, HIDE_MS);
    }

    /* ── Listener de filtros ── */
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {

        /* Actualiza estado de botones */
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;

        if (filter in specialGalleries) {
          showSpecialGallery(filter);
        } else {
          hideAllSpecialGalleries(filter);
        }
      });
    });

    /* ── Tarjetas que abren un filtro en lugar de navegar ── */
    cards.forEach(card => {
      const href = card.getAttribute('href') || '';
      if (!href.startsWith('#')) return;
      const target = href.slice(1); // e.g. "Cartelería"
      const matchBtn = [...filterBtns].find(b => b.dataset.filter === target);
      if (!matchBtn) return;

      card.addEventListener('click', e => {
        e.preventDefault();
        matchBtn.click();

        /* Si la tarjeta apunta a un bloque concreto (data-goto),
           esperamos a que la galería se revele y hacemos scroll a él. */
        const goto = card.dataset.goto;
        if (goto) {
          setTimeout(() => {
            const block = document.getElementById(goto);
            if (block) block.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, HIDE_MS + 140);
        } else {
          document.getElementById('proyectos').scrollIntoView({ behavior: 'smooth' });
        }
      });
    });


    /* ══════════════════════════════════════
       LIGHTBOX CARTELERÍA
    ══════════════════════════════════════ */
    (function initCtLightbox() {
      const lb      = document.getElementById('ctLightbox');
      if (!lb) return;

      const lbImg   = document.getElementById('ctLbImg');
      const lbCtr   = document.getElementById('ctLbCounter');
      const cells   = () => [...document.querySelectorAll('#ctGallery .ct-cell')];
      let cur = 0, trigger = null;

      function imgs() { return cells().map(c => c.querySelector('img')); }

      function update() {
        const img = imgs()[cur];
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCtr.textContent = `${cur + 1} / ${imgs().length}`;
      }

      function goTo(idx, anim = true) {
        cur = (idx + imgs().length) % imgs().length;
        if (anim) {
          lbImg.classList.add('switching');
          setTimeout(() => { update(); lbImg.classList.remove('switching'); }, 200);
        } else update();
      }

      function openLb(idx) {
        goTo(idx, false);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.getElementById('ctLbClose').focus();
      }

      function closeLb() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        if (trigger) { trigger.focus(); trigger = null; }
      }

      /* Delegación de eventos en el grid (funciona con celdas dinámicas) */
      const grid = document.getElementById('ctGallery');
      if (grid) {
        grid.addEventListener('click', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          trigger = cell;
          openLb(cells().indexOf(cell));
        });
        grid.addEventListener('keydown', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger = cell;
            openLb(cells().indexOf(cell));
          }
        });
      }

      document.getElementById('ctLbClose').addEventListener('click', closeLb);
      document.getElementById('ctLbPrev').addEventListener('click', () => goTo(cur - 1));
      document.getElementById('ctLbNext').addEventListener('click', () => goTo(cur + 1));

      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

      document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLb();
        if (e.key === 'ArrowLeft')  goTo(cur - 1);
        if (e.key === 'ArrowRight') goTo(cur + 1);
      });

      /* Swipe táctil */
      let tX = 0;
      lb.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        const d = tX - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) goTo(d > 0 ? cur + 1 : cur - 1);
      });

      /* Focus trap */
      lb.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const fs = [...lb.querySelectorAll('button')];
        const first = fs[0], last = fs[fs.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    })();


    /* ══════════════════════════════════════
       LIGHTBOX ILUSTRACIONES
    ══════════════════════════════════════ */
    (function initIlLightbox() {
      const lb    = document.getElementById('ilLightbox');
      if (!lb) return;

      const lbImg = document.getElementById('ilLbImg');
      const lbCtr = document.getElementById('ilLbCounter');
      const cells = () => [...document.querySelectorAll('#ilGallery .ct-cell')];
      let cur = 0, trigger = null;

      function imgs() { return cells().map(c => c.querySelector('img')); }

      function update() {
        const img = imgs()[cur];
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCtr.textContent = `${cur + 1} / ${imgs().length}`;
      }

      function goTo(idx, anim = true) {
        cur = (idx + imgs().length) % imgs().length;
        if (anim) {
          lbImg.classList.add('switching');
          setTimeout(() => { update(); lbImg.classList.remove('switching'); }, 200);
        } else update();
      }

      function openLb(idx) {
        goTo(idx, false);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.getElementById('ilLbClose').focus();
      }

      function closeLb() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        if (trigger) { trigger.focus(); trigger = null; }
      }

      const grid = document.getElementById('ilGallery');
      if (grid) {
        grid.addEventListener('click', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          trigger = cell;
          openLb(cells().indexOf(cell));
        });
        grid.addEventListener('keydown', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger = cell;
            openLb(cells().indexOf(cell));
          }
        });
      }

      document.getElementById('ilLbClose').addEventListener('click', closeLb);
      document.getElementById('ilLbPrev').addEventListener('click', () => goTo(cur - 1));
      document.getElementById('ilLbNext').addEventListener('click', () => goTo(cur + 1));

      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

      document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLb();
        if (e.key === 'ArrowLeft')  goTo(cur - 1);
        if (e.key === 'ArrowRight') goTo(cur + 1);
      });

      let tX = 0;
      lb.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        const d = tX - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) goTo(d > 0 ? cur + 1 : cur - 1);
      });

      lb.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const fs = [...lb.querySelectorAll('button')];
        const first = fs[0], last = fs[fs.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    })();


    /* ══════════════════════════════════════
       LIGHTBOX FOTOGRAFÍA
    ══════════════════════════════════════ */
    (function initFotLightbox() {
      const lb    = document.getElementById('fotLightbox');
      if (!lb) return;

      const lbImg = document.getElementById('fotLbImg');
      const lbCtr = document.getElementById('fotLbCounter');
      const cells = () => [...document.querySelectorAll('#fotGallery .ct-cell')];
      let cur = 0, trigger = null;

      function imgs() { return cells().map(c => c.querySelector('img')); }

      function update() {
        const img = imgs()[cur];
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCtr.textContent = `${cur + 1} / ${imgs().length}`;
      }

      function goTo(idx, anim = true) {
        cur = (idx + imgs().length) % imgs().length;
        if (anim) {
          lbImg.classList.add('switching');
          setTimeout(() => { update(); lbImg.classList.remove('switching'); }, 200);
        } else update();
      }

      function openLb(idx) {
        goTo(idx, false);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.getElementById('fotLbClose').focus();
      }

      function closeLb() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        if (trigger) { trigger.focus(); trigger = null; }
      }

      const grid = document.getElementById('fotGallery');
      if (grid) {
        grid.addEventListener('click', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          trigger = cell;
          openLb(cells().indexOf(cell));
        });
        grid.addEventListener('keydown', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger = cell;
            openLb(cells().indexOf(cell));
          }
        });
      }

      document.getElementById('fotLbClose').addEventListener('click', closeLb);
      document.getElementById('fotLbPrev').addEventListener('click', () => goTo(cur - 1));
      document.getElementById('fotLbNext').addEventListener('click', () => goTo(cur + 1));

      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

      document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLb();
        if (e.key === 'ArrowLeft')  goTo(cur - 1);
        if (e.key === 'ArrowRight') goTo(cur + 1);
      });

      let tX = 0;
      lb.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        const d = tX - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) goTo(d > 0 ? cur + 1 : cur - 1);
      });

      lb.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const fs = [...lb.querySelectorAll('button')];
        const first = fs[0], last = fs[fs.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    })();


    /* ══════════════════════════════════════
       LIGHTBOX OTROS
       Recorre todas las fotos de #otrosGallery,
       sin importar el bloque al que pertenezcan.
    ══════════════════════════════════════ */
    (function initOtrosLightbox() {
      const lb    = document.getElementById('otrosLightbox');
      if (!lb) return;

      const lbImg = document.getElementById('otrosLbImg');
      const lbCtr = document.getElementById('otrosLbCounter');
      const cells = () => [...document.querySelectorAll('#otrosGallery .ct-cell')];
      let cur = 0, trigger = null;

      function imgs() { return cells().map(c => c.querySelector('img')); }

      function update() {
        const img = imgs()[cur];
        lbImg.src = img.src; lbImg.alt = img.alt;
        lbCtr.textContent = `${cur + 1} / ${imgs().length}`;
      }

      function goTo(idx, anim = true) {
        cur = (idx + imgs().length) % imgs().length;
        if (anim) {
          lbImg.classList.add('switching');
          setTimeout(() => { update(); lbImg.classList.remove('switching'); }, 200);
        } else update();
      }

      function openLb(idx) {
        goTo(idx, false);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
        document.getElementById('otrosLbClose').focus();
      }

      function closeLb() {
        lb.classList.remove('open');
        document.body.style.overflow = '';
        if (trigger) { trigger.focus(); trigger = null; }
      }

      const grid = document.getElementById('otrosGallery');
      if (grid) {
        grid.addEventListener('click', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          trigger = cell;
          openLb(cells().indexOf(cell));
        });
        grid.addEventListener('keydown', e => {
          const cell = e.target.closest('.ct-cell');
          if (!cell) return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            trigger = cell;
            openLb(cells().indexOf(cell));
          }
        });
      }

      document.getElementById('otrosLbClose').addEventListener('click', closeLb);
      document.getElementById('otrosLbPrev').addEventListener('click', () => goTo(cur - 1));
      document.getElementById('otrosLbNext').addEventListener('click', () => goTo(cur + 1));

      lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });

      document.addEventListener('keydown', e => {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape')     closeLb();
        if (e.key === 'ArrowLeft')  goTo(cur - 1);
        if (e.key === 'ArrowRight') goTo(cur + 1);
      });

      let tX = 0;
      lb.addEventListener('touchstart', e => { tX = e.touches[0].clientX; }, { passive: true });
      lb.addEventListener('touchend', e => {
        const d = tX - e.changedTouches[0].clientX;
        if (Math.abs(d) > 50) goTo(d > 0 ? cur + 1 : cur - 1);
      });

      lb.addEventListener('keydown', e => {
        if (e.key !== 'Tab') return;
        const fs = [...lb.querySelectorAll('button')];
        const first = fs[0], last = fs[fs.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      });
    })();


    /* ══════════════════════════════════════
       PROYECTOS — reveal al scroll (IntersectionObserver)
       Las tarjetas entran con stagger escalonado
    ══════════════════════════════════════ */
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card  = entry.target;
          const index = [...cards].indexOf(card);
          /* Stagger: 60 ms entre cada tarjeta */
          setTimeout(() => card.classList.add('in-view'), index * 60);
          revealObserver.unobserve(card);
        }
      });
    }, { threshold: 0.08 });
 
    cards.forEach(card => revealObserver.observe(card));


    /* ══════════════════════════════════════
       SOBRE MÍ / CONTACTO — reveal genérico al scroll
       Anima cualquier elemento .reveal-up al entrar en viewport
    ══════════════════════════════════════ */
    const revealUpEls = document.querySelectorAll('.reveal-up');
    const revealUpObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealUpObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealUpEls.forEach(el => revealUpObserver.observe(el));
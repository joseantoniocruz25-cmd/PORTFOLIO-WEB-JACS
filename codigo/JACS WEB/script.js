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
    ══════════════════════════════════════ */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.bento-card');
    const HIDE_MS    = 400;  /* duración fade-out — coincide con transition CSS */
    const SLIDE_MS   = 480;  /* duración slide-in por tarjeta               */
    const STAGGER_MS = 75;   /* retardo escalonado entre tarjetas            */

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {

        /* Actualiza botones activos */
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filter = btn.dataset.filter;
        let visibleIdx = 0;

        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;

          if (match) {
            const idx = visibleIdx++;

            /* Restaura el espacio en el grid y garantiza estado base visible */
            card.style.display = '';
            card.classList.remove('hidden');
            card.classList.add('in-view');

            /* Fuerza reset de animación antes de reasignarla */
            card.style.animation = 'none';

            requestAnimationFrame(() => {
              card.style.animationDelay    = `${idx * STAGGER_MS}ms`;
              card.style.animationDuration = `${SLIDE_MS}ms`;
              card.style.animation =
                `filterSlideIn ${SLIDE_MS}ms cubic-bezier(0.16,1,0.3,1) ${idx * STAGGER_MS}ms both`;

              /* Tras la animación, devuelve el control a las clases CSS */
              card.addEventListener('animationend', () => {
                card.style.animation         = '';
                card.style.animationDelay    = '';
                card.style.animationDuration = '';
              }, { once: true });
            });

          } else {
            /* Cancela cualquier animación en curso y oculta */
            card.style.animation = '';
            card.classList.add('hidden');

            setTimeout(() => {
              if (card.classList.contains('hidden')) card.style.display = 'none';
            }, HIDE_MS);
          }
        });
      });
    });
 
 
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
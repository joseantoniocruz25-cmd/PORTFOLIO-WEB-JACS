/* ══════════════════════════════════════
      VIEW TRANSITION — conecta hero con tarjeta
   ══════════════════════════════════════ */
   const slug    = document.body.dataset.slug;
   const heroImg = document.querySelector('.project-hero__img');
   if (slug && heroImg) heroImg.style.viewTransitionName = `project-${slug}`;

   const yr = new Date().getFullYear();
   const yrEl = document.getElementById('year');
   if (yrEl) { yrEl.textContent = yr; yrEl.setAttribute('datetime', yr); }


   /* ══════════════════════════════════════
      REVEAL AL SCROLL
   ══════════════════════════════════════ */
   const revealObs = new IntersectionObserver((entries) => {
     entries.forEach(e => {
       if (e.isIntersecting) {
         e.target.classList.add('in-view');
         revealObs.unobserve(e.target);
       }
     });
   }, { threshold: 0.07 });

   document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


   /* ══════════════════════════════════════
      LIGHTBOX + SLIDER
   ══════════════════════════════════════ */
   const lightbox    = document.getElementById('lightbox');
   const lbImg       = document.getElementById('lbImg');
   const lbCounter   = document.getElementById('lbCounter');
   const lbThumbs    = document.getElementById('lbThumbs');
   const galleryImgs = [...document.querySelectorAll('.gallery-item img')];
   let current   = 0;
   let triggerEl = null; // elemento que abrió el lightbox (restaura foco al cerrar)

   /* Construye los thumbnails una sola vez — <li><button> para semántica correcta */
   galleryImgs.forEach((img, i) => {
     const li    = document.createElement('li');
     const thumb = document.createElement('button');
     thumb.className = 'lightbox__thumb' + (i === 0 ? ' active' : '');
     thumb.setAttribute('aria-label', img.alt || `Imagen ${i + 1}`);
     thumb.innerHTML = `<img src="${img.src}" alt="" aria-hidden="true">`;
     thumb.addEventListener('click', () => goTo(i));
     li.appendChild(thumb);
     lbThumbs.appendChild(li);
   });

   function updateLightbox() {
     const img = galleryImgs[current];
     lbImg.src = img.src;
     lbImg.alt = img.alt;
     lbCounter.textContent = `${current + 1} / ${galleryImgs.length}`;

     /* Actualiza aria-label del diálogo con la imagen activa */
     lightbox.setAttribute('aria-label', img.alt || 'Visualizador de imágenes');

     /* Actualiza thumbnail activo */
     [...lbThumbs.querySelectorAll('.lightbox__thumb')].forEach((t, i) => {
       t.classList.toggle('active', i === current);
     });

     /* Scroll al thumb activo */
     const activeThumb = lbThumbs.querySelectorAll('.lightbox__thumb')[current];
     if (activeThumb) {
       activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
     }
   }

   function goTo(idx, animate = true) {
     current = (idx + galleryImgs.length) % galleryImgs.length;
     if (animate) {
       lbImg.classList.add('switching');
       setTimeout(() => {
         updateLightbox();
         lbImg.classList.remove('switching');
       }, 200);
     } else {
       updateLightbox();
     }
   }

   function openLightbox(idx) {
     goTo(idx, false);
     lightbox.classList.add('open');
     document.body.style.overflow = 'hidden';
     document.getElementById('lbClose').focus();
   }

   function closeLightbox() {
     lightbox.classList.remove('open');
     document.body.style.overflow = '';
     if (triggerEl) { triggerEl.focus(); triggerEl = null; }
   }

   /* Abrir al clic en galería — guarda el trigger para restaurar foco */
   document.querySelectorAll('.gallery-item').forEach((item, i) => {
     item.addEventListener('click', () => { triggerEl = item; openLightbox(i); });
     item.addEventListener('keydown', e => {
       if (e.key === 'Enter' || e.key === ' ') {
         e.preventDefault();
         triggerEl = item;
         openLightbox(i);
       }
     });
   });

   document.getElementById('lbClose').addEventListener('click', closeLightbox);
   document.getElementById('lbPrev').addEventListener('click', () => goTo(current - 1));
   document.getElementById('lbNext').addEventListener('click', () => goTo(current + 1));

   /* Teclado */
   document.addEventListener('keydown', e => {
     if (!lightbox.classList.contains('open')) return;
     if (e.key === 'Escape')     closeLightbox();
     if (e.key === 'ArrowLeft')  goTo(current - 1);
     if (e.key === 'ArrowRight') goTo(current + 1);
   });

   /* Clic en fondo oscuro */
   lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

   /* Swipe táctil */
   let touchStartX = 0;
   lightbox.addEventListener('touchstart', e => {
     touchStartX = e.touches[0].clientX;
   }, { passive: true });
   lightbox.addEventListener('touchend', e => {
     const diff = touchStartX - e.changedTouches[0].clientX;
     if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
   });


   /* ══════════════════════════════════════
      ACCESIBILIDAD — Focus trap en lightbox
      Mantiene el foco dentro del diálogo
      mientras está abierto.
   ══════════════════════════════════════ */
   (function initFocusTrap() {
     if (!lightbox) return;

     const FOCUSABLE = [
       'button:not([disabled])',
       'a[href]',
       '[tabindex]:not([tabindex="-1"])',
     ].join(',');

     lightbox.addEventListener('keydown', e => {
       if (e.key !== 'Tab') return;

       const focusable = [...lightbox.querySelectorAll(FOCUSABLE)];
       const first = focusable[0];
       const last  = focusable[focusable.length - 1];

       if (e.shiftKey) {
         if (document.activeElement === first) { e.preventDefault(); last.focus(); }
       } else {
         if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
       }
     });
   })();

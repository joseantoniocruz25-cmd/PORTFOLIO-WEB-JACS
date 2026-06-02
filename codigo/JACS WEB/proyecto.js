/* ══════════════════════════════════════
   VIEW TRANSITION — conecta la imagen hero
   con la tarjeta del grid usando el slug
══════════════════════════════════════ */
const slug    = document.body.dataset.slug;
const heroImg = document.querySelector('.project-hero__img');
if (slug && heroImg) {
  heroImg.style.viewTransitionName = `project-${slug}`;
}

document.getElementById('year').textContent = new Date().getFullYear();


/* ══════════════════════════════════════
   REVEAL AL SCROLL
══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in-view');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08 });

revealEls.forEach(el => revealObs.observe(el));


/* ══════════════════════════════════════
   LIGHTBOX
══════════════════════════════════════ */
const lightbox    = document.getElementById('lightbox');
const lbImg       = document.getElementById('lbImg');
const lbCounter   = document.getElementById('lbCounter');
const galleryImgs = [...document.querySelectorAll('.gallery-item img')];
let currentIdx    = 0;

function openLightbox(idx) {
  currentIdx = idx;
  const img  = galleryImgs[idx];
  lbImg.src  = img.dataset.full || img.src;
  lbImg.alt  = img.alt;
  lbCounter.textContent = `${idx + 1} / ${galleryImgs.length}`;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function navigate(dir) {
  currentIdx = (currentIdx + dir + galleryImgs.length) % galleryImgs.length;
  const img  = galleryImgs[currentIdx];
  lbImg.src  = img.dataset.full || img.src;
  lbImg.alt  = img.alt;
  lbCounter.textContent = `${currentIdx + 1} / ${galleryImgs.length}`;
}

document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lbPrev').addEventListener('click', () => navigate(-1));
document.getElementById('lbNext').addEventListener('click', () => navigate(1));

lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowLeft')  navigate(-1);
  if (e.key === 'ArrowRight') navigate(1);
});

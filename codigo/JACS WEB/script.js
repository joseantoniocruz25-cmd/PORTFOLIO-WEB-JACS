const heroSection = document.querySelector('.hero-section');
const fullName    = document.getElementById('fullName');
const logoMark    = document.getElementById('logoMark');
const scrollCue   = document.getElementById('scrollCue');
const siteNav     = document.getElementById('siteNav');

document.getElementById('year').textContent = new Date().getFullYear();

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

  siteNav.classList.toggle('scrolled',     -rect.top > window.innerHeight * 0.8);
  siteNav.classList.toggle('logo-visible', logoIn > 0.5);
}

window.addEventListener('scroll', update, { passive: true });
update();

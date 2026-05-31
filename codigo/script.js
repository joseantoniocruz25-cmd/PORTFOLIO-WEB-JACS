

    // Dos elementos: un punto que sigue exactamente al ratón,
    // y un anillo que lo persigue con inercia (efecto lag suave).
    const cursor = document.getElementById('cursor');
    const ring   = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    function animCursor() {
      cursor.style.transform = `translate(${mx - 6}px, ${my - 6}px)`;
      // Interpolación lineal: avanza un 12% de lo que falta cada frame → lag suave
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      requestAnimationFrame(animCursor);
    }
    animCursor();

    // Efecto hover: el anillo se expande al pasar sobre elementos interactivos
    document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform += ' scale(1.8)';
        ring.style.width  = '60px';
        ring.style.height = '60px';
        ring.style.opacity = '0.3';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '36px';
        ring.style.height = '36px';
        ring.style.opacity = '0.5';
      });
    });


    // ════════════════════════════════════════════
    // 2. MENÚ HAMBURGUESA (MÓVIL)
    // ════════════════════════════════════════════
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobile-menu');

    ham.addEventListener('click', () => {
      const isOpen = ham.classList.toggle('open');
      mob.classList.toggle('open');
      ham.setAttribute('aria-expanded', isOpen);
      mob.setAttribute('aria-hidden', !isOpen);
      ham.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });
    // Cierra el menú al hacer clic en cualquier enlace interior
    document.querySelectorAll('.mob-link').forEach(a => {
      a.addEventListener('click', () => {
        ham.classList.remove('open');
        mob.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
        mob.setAttribute('aria-hidden', 'true');
        ham.setAttribute('aria-label', 'Abrir menú de navegación');
      });
    });


    // ════════════════════════════════════════════
    // 3. SCROLL REVEAL (con variantes de dirección)
    // ════════════════════════════════════════════
    // IntersectionObserver avisa cuando un elemento entra en el viewport.
    // Es mucho más eficiente que escuchar el evento 'scroll' en cada frame.
    const allRevealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
    const revealEls = document.querySelectorAll(allRevealClasses.join(','));

    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          // Una vez visible, dejamos de observarlo para no gastar recursos
          revealObserver.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealObserver.observe(el));


    // ════════════════════════════════════════════
    // 4. TIMELINE REVEAL ESCALONADO
    // ════════════════════════════════════════════
    // Cada elemento de la timeline aparece 120ms después del anterior,
    // creando una entrada en cascada que guía el ojo de arriba a abajo.
    const timelineItems = document.querySelectorAll('.timeline-item');
    const tlObserver = new IntersectionObserver(entries => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add('visible'), i * 120);
        }
      });
    }, { threshold: 0.1 });
    timelineItems.forEach(el => tlObserver.observe(el));


    // ════════════════════════════════════════════
    // 5. SKILL CARDS — ANIMACIÓN ESCALONADA
    // ════════════════════════════════════════════
    // Cuando la cuadrícula de skills entra en pantalla,
    // asignamos un --delay CSS a cada tarjeta y la hacemos visible.
    const skillsGrid = document.querySelector('.skills-grid');
    if (skillsGrid) {
      const skillCardsObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll('.skill-card').forEach((card, i) => {
            // La variable CSS --delay escala la transición de cada tarjeta
            card.style.setProperty('--delay', `${i * 80}ms`);
            // Pequeño timeout extra para que el CSS tenga tiempo de aplicar el delay
            setTimeout(() => card.classList.add('visible'), i * 80 + 10);
          });
          skillCardsObs.disconnect();
        }
      }, { threshold: 0.05 });
      skillCardsObs.observe(skillsGrid);
    }


    // ════════════════════════════════════════════
    // 6. PROJECT CARDS — ANIMACIÓN ESCALONADA
    // ════════════════════════════════════════════
    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      const projCardsObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          document.querySelectorAll('.project-card').forEach((card, i) => {
            card.style.setProperty('--delay', `${i * 90}ms`);
            setTimeout(() => card.classList.add('visible'), i * 90 + 10);
          });
          projCardsObs.disconnect();
        }
      }, { threshold: 0.05 });
      projCardsObs.observe(projectsGrid);
    }


    // ════════════════════════════════════════════
    // 7. CONTADOR ANIMADO para la badge "7+ Años"
    // ════════════════════════════════════════════
    // Cuando la badge entra en pantalla, el número cuenta desde 0 hasta 7
    // usando una función de easing ease-out para que acelere al inicio y
    // desacelere al final, dándole un efecto de "aterrizaje" natural.
    function animateCounter(el, target, suffix = '') {
      let startTime = null;
      const duration = 1400; // milisegundos totales del conteo

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cúbico: empieza rápido y frena al final
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    const badgeStrong = document.querySelector('.about-badge strong');
    if (badgeStrong) {
      const badgeObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          animateCounter(badgeStrong, 7, '+');
          badgeObs.disconnect();
        }
      }, { threshold: 0.6 });
      badgeObs.observe(badgeStrong.closest('.about-badge'));
    }


    // ════════════════════════════════════════════
    // 8. PARALLAX EN EL HERO (efecto de profundidad)
    // ════════════════════════════════════════════
    // La ilusión de profundidad se crea moviendo distintas capas del hero
    // a velocidades diferentes al hacer scroll. Las más "lejanas" (fondo)
    // se mueven más despacio, y las más "cercanas" (contenido) más rápido.
    //
    // Capa 1 — grid de fondo:           factor 0.10 (casi fija)
    // Capa 2 — logo JACS decorativo:    factor 0.08 (la más lenta de todas)
    // Capa 3 — blob de luz:             factor 0.40 (velocidad media-alta)
    // Capa 4 — contenido del hero:      factor 0.25 (entre fondo y primer plano)
    //
    // El resultado es que al bajar el scroll el logo JACS "se queda atrás",
    // el blob se va hacia abajo más rápido, y el texto flota a velocidad intermedia.

    const heroGrid      = document.getElementById('hero-grid');
    const heroParLogo   = document.getElementById('hero-parallax-logo');
    const heroBlob      = document.getElementById('hero-blob');
    const heroContent   = document.querySelector('.hero-content');
    const heroScroll    = document.querySelector('.hero-scroll');
    const heroSection   = document.getElementById('hero');

    function handleParallax() {
      const y = window.scrollY;

      // Solo aplicamos el parallax mientras el hero es visible en pantalla
      // para no desperdiciar cálculos cuando el usuario ya scrolleó lejos.
      if (y > window.innerHeight * 1.2) return;

      if (heroGrid)    heroGrid.style.transform    = `translateY(${y * 0.10}px)`;
      if (heroParLogo) heroParLogo.style.transform = `translateY(${y * 0.08}px)`;
      if (heroBlob)    heroBlob.style.transform    = `translateY(${y * 0.40}px)`;
      if (heroContent) heroContent.style.transform = `translateY(${y * 0.25}px)`;

      // El indicador "Scroll" desaparece conforme bajamos
      if (heroScroll) heroScroll.style.opacity = Math.max(0, 1 - y / 180);
    }

    // { passive: true } le dice al navegador que este listener nunca llama
    // preventDefault(), lo que permite que optimice el scroll en GPU.
    // Nav compacta: reduce el padding cuando el usuario baja más de 60px
    const navEl = document.querySelector('nav');
    function handleNavShrink() { navEl.classList.toggle('scrolled', window.scrollY > 60); }
    window.addEventListener('scroll', handleNavShrink, { passive: true });

    window.addEventListener('scroll', handleParallax, { passive: true });
    handleParallax(); // Ejecutar una vez al cargar por si la página no empieza en top


    // ════════════════════════════════════════════
    // 9. BARRA DE PROGRESO DE SCROLL
    // ════════════════════════════════════════════
    const progressBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
      const total    = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / total) * 100;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });


    // ════════════════════════════════════════════
    // 10. NAV ACTIVE — sección resaltada según scroll
    // ════════════════════════════════════════════
    const sections = document.querySelectorAll('section[id]');
    const navLinks  = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
      let current = '';
      sections.forEach(s => {
        if (window.scrollY >= s.offsetTop - 200) current = s.id;
      });
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--white)' : '';
      });
    }, { passive: true });
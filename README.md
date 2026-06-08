# JACS — Portfolio web

Portfolio personal de José Antonio Cruz Segura («JACS»): diseño gráfico, branding, cartelería, ilustración y modelado 3D. *Píxeles, polígonos y actitud.*

Sitio estático en HTML, CSS y JavaScript vanilla, sin dependencias de build.

## Estructura

```
index.html              Página principal (proyectos, sobre mí, contacto)
proyecto-*.html/css/js  Páginas individuales de cada proyecto
styles.css              Estilos globales
animations.css          Animaciones y efectos de scroll
script.js               Lógica del sitio (filtros, galería, lightbox, modelos 3D…)
proyectos/              Imágenes, logos e iconos de los proyectos
fonts/                  Tipografías locales
recursos-tfm/           Material de apoyo del TFM (no forma parte del sitio publicado)
```

## Ver el sitio en local

Al ser un sitio estático basta con servir la carpeta raíz, por ejemplo:

```
npx serve .
```

y abrir la URL que indique en el navegador.

## Publicación

El sitio está pensado para servirse directamente desde la raíz del repositorio (p. ej. GitHub Pages, rama `main`).

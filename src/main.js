import './styles.css';
import { usuarioActual, cerrarSesion, esc, PLANES } from './auth.js';
import { renderInicio } from './views/inicio.js';
import { renderRecetas } from './views/recetas.js';
import { renderReceta } from './views/receta.js';
import { renderConsejos } from './views/consejos.js';
import { renderClases } from './views/clases.js';
import { renderNutricion } from './views/nutricion.js';
import { renderPlanes } from './views/planes.js';
import { renderEncuesta } from './views/encuesta.js';
import { renderAuth } from './views/auth.js';

const app = document.getElementById('app');

app.innerHTML = `
  <header class="nav" id="nav">
    <div class="container nav-inner">
      <a class="brand" href="#/">
        <span class="brand-mark" aria-hidden="true">🍃</span>
        Met-Life <strong>Diabéticos</strong>
      </a>
      <div class="nav-right">
        <nav class="nav-links" id="nav-links" aria-label="Navegación principal"></nav>
        <div class="nav-account" id="nav-account"></div>
      </div>
    </div>
  </header>

  <main id="view" class="container" tabindex="-1"></main>

  <footer class="footer">
    <div class="container">
      <p class="footer-brand">Met-Life Diabéticos · Alerce, Puerto Montt</p>
      <p class="footer-note">
        Este sitio tiene fines educativos. La información que contiene no reemplaza la
        consulta con un médico o nutricionista, ni constituye indicaciones de tratamiento.
        Antes de cambiar tu alimentación, coméntalo con tu equipo de salud.
      </p>
      <p class="footer-note">© 2026 Met-Life Diabéticos · Todos los derechos reservados</p>
    </div>
  </footer>
`;

const navLinks = document.getElementById('nav-links');
const navAccount = document.getElementById('nav-account');
const viewEl = document.getElementById('view');

const MENU_PUBLICO = [
  { href: '#/', label: 'Inicio' },
  { href: '#/planes', label: 'Planes' },
];

const MENU_SESION = [
  { href: '#/recetas', label: 'Recetas' },
  { href: '#/consejos', label: 'Consejos' },
  { href: '#/clases', label: 'Clases' },
  { href: '#/nutricion', label: 'Nutrición' },
  { href: '#/planes', label: 'Planes' },
  { href: '#/encuesta', label: 'Encuesta' },
];

function pintarNav() {
  const user = usuarioActual();
  const menu = user ? MENU_SESION : MENU_PUBLICO;

  navLinks.innerHTML = menu
    .map((m) => `<a href="${m.href}">${m.label}</a>`)
    .join('');

  navAccount.innerHTML = user
    ? `<span class="nav-user">Hola, <strong>${esc(user.nombre)}</strong> · ${PLANES[user.plan].nombre}</span>
       <button class="link-btn" id="btn-salir" type="button">Salir</button>`
    : `<a class="btn btn-nav" href="#/ingresar">Ingresar</a>`;

  const salir = document.getElementById('btn-salir');
  if (salir) {
    salir.addEventListener('click', () => {
      cerrarSesion();
      const ruta = location.hash.replace(/^#/, '').split('?')[0];
      const protegida = ['/recetas', '/consejos', '/clases', '/nutricion', '/encuesta'].some(
        (p) => ruta === p || ruta.startsWith(`${p}/`)
      );
      if (protegida) location.hash = '#/';
      else window.dispatchEvent(new Event('app:refresh'));
    });
  }
}

const routes = [
  { re: /^\/$/, view: () => renderInicio() },
  { re: /^\/recetas$/, view: () => renderRecetas() },
  { re: /^\/recetas\/([\w-]+)$/, view: (m) => renderReceta(m[1]) },
  { re: /^\/consejos$/, view: () => renderConsejos() },
  { re: /^\/clases$/, view: () => renderClases() },
  { re: /^\/nutricion$/, view: () => renderNutricion() },
  { re: /^\/planes$/, view: () => renderPlanes() },
  { re: /^\/encuesta$/, view: () => renderEncuesta() },
  { re: /^\/ingresar$/, view: (_m, params) => renderAuth(params) },
];

let observerReveal = null;

function prepararReveal() {
  if (observerReveal) observerReveal.disconnect();
  const nodos = viewEl.querySelectorAll('.reveal');
  if (!nodos.length) return;

  const sinAnimacion =
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (sinAnimacion) {
    nodos.forEach((n) => n.classList.add('reveal-on'));
    return;
  }

  observerReveal = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-on');
          observerReveal.unobserve(e.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  nodos.forEach((n) => observerReveal.observe(n));
}

function render() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();

  const user = usuarioActual();
  const raw = location.hash.replace(/^#/, '') || '/';
  const [rutaBase] = raw.split('?');

  if (user && rutaBase === '/') {
    location.hash = '#/recetas';
    return;
  }

  const [path, query = ''] = raw.split('?');
  const params = new URLSearchParams(query);
  const route = routes.find((r) => r.re.test(path));

  if (!route) {
    viewEl.innerHTML = `
      <section class="section center">
        <h1 class="h1">Página no encontrada</h1>
        <p class="lead">La ruta <code>${esc(path)}</code> no existe.</p>
        <a class="btn btn-primary" href="#/">Volver al inicio</a>
      </section>`;
  } else {
    const match = path.match(route.re);
    const out = route.view(match, params);
    viewEl.innerHTML = out.html;
    if (typeof out.mount === 'function') out.mount();
  }

  document.querySelectorAll('#nav-links a').forEach((a) => {
    const href = a.getAttribute('href');
    const activo = href === `#${path}` || (path === '/' && href === '#/');
    a.classList.toggle('active', activo);
    if (activo) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  pintarNav();
  prepararReveal();
  window.scrollTo({ top: 0 });
}

window.addEventListener('hashchange', render);
window.addEventListener('app:refresh', render);

const nav = document.getElementById('nav');
window.addEventListener(
  'scroll',
  () => nav.classList.toggle('nav-sombra', window.scrollY > 8),
  { passive: true }
);

render();

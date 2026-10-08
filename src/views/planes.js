import { recetas } from '../data/recetas.js';
import { usuarioActual, cambiarPlan, esc } from '../auth.js';

const planes = [
  {
    id: 'basico',
    nombre: 'Plan Básico',
    precio: '$5.990',
    para: 'Para empezar con una rutina de recetas clara.',
    destacado: false,
    features: [
      '25 recetas con ingredientes fáciles de conseguir',
      'Técnicas de cocción con menos grasa',
      'Clases de selección de alimentos',
    ],
  },
  {
    id: 'pro',
    nombre: 'Plan Pro',
    precio: '$8.990',
    para: 'Para quienes cocinan seguido y quieren más variedad.',
    destacado: true,
    features: [
      '55 recetas divididas por dificultad baja, media y superior',
      'Información extra de nutrición en videos y audios',
      'Clases de selección de alimentos',
      '10 recetas de bebidas saludables',
    ],
  },
];

let mensaje = '';

function accionPlan(p, user) {
  if (!user) {
    return `<a class="btn ${p.destacado ? 'btn-primary' : 'btn-ghost'}" href="#/ingresar?plan=${p.id}">
      Crear cuenta con ${p.nombre}
    </a>`;
  }
  if (user.plan === p.id) {
    return `<span class="plan-actual">✓ Este es tu plan actual</span>`;
  }
  return `<button class="btn ${p.destacado ? 'btn-primary' : 'btn-ghost'}" data-cambiar="${p.id}" type="button">
    Cambiar a ${p.nombre}
  </button>`;
}

export function renderPlanes() {
  const user = usuarioActual();
  const pro = recetas.filter((r) => r.plan === 'pro');
  const vistaPrevia = [
    ...pro.filter((r) => r.tipo !== 'bebida').slice(0, 4),
    ...pro.filter((r) => r.tipo === 'bebida').slice(0, 2),
  ];

  const html = `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Modelo de negocio</p>
        <h1 class="h1">Planes de suscripción</h1>
        <p class="lead">
          El sitio funciona con suscripción mensual. Elige el plan según cuántas recetas y
          material de apoyo necesites. ${user ? `Ahora mismo tienes el <strong>${esc(
            user.plan === 'pro' ? 'Plan Pro' : 'Plan Básico'
          )}</strong>.` : 'Crea una cuenta para guardarlo.'}
        </p>
        <div id="aviso-plan" aria-live="polite">
          ${mensaje ? `<div class="callout callout-ok"><p>${mensaje}</p></div>` : ''}
        </div>
      </div>

      <div class="plans-grid">
        ${planes
          .map(
            (p) => `
          <article class="plan ${p.destacado ? 'plan-destacado' : ''} ${user && user.plan === p.id ? 'plan-mio' : ''}">
            ${p.destacado ? '<span class="plan-flag">Más elegido</span>' : ''}
            <h2 class="h3">${p.nombre}</h2>
            <p class="plan-para">${p.para}</p>
            <p class="price">${p.precio}<span> / mes</span></p>
            <ul class="plan-list">
              ${p.features.map((f) => `<li>${f}</li>`).join('')}
            </ul>
            ${accionPlan(p, user)}
          </article>`
          )
          .join('')}
      </div>

      <div class="callout">
        <h2 class="h3">Cómo se compara el contenido</h2>
        <div class="table-wrap">
          <table class="nutri">
            <thead>
              <tr><th>Contenido</th><th>Básico</th><th>Pro</th></tr>
            </thead>
            <tbody>
              <tr><td>Recetas</td><td>25</td><td>55</td></tr>
              <tr><td>Dificultades de las recetas</td><td>Básicas</td><td>Baja, media y superior</td></tr>
              <tr><td>Técnicas de cocción</td><td>Incluidas</td><td>Incluidas</td></tr>
              <tr><td>Clases de selección de alimentos</td><td>Incluidas</td><td>Incluidas</td></tr>
              <tr><td>Guías de alimentación (10 consejos)</td><td>Incluidas</td><td>Incluidas</td></tr>
              <tr><td>Videos y audios de nutrición</td><td>—</td><td>Incluidos</td></tr>
              <tr><td>Bebidas saludables</td><td>—</td><td>10 recetas</td></tr>
              <tr><td>Valores nutricionales por porción</td><td>Incluidos</td><td>Incluidos</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <section class="section">
        <div class="section-head">
          <p class="eyebrow">Vista previa</p>
          <h2 class="h2">Recetas del Plan Pro</h2>
          <p class="lead">
            Una muestra de las ${pro.length} recetas del plan: platos de todos los días y las
            10 bebidas saludables.
          </p>
        </div>
        <div class="grid-3">
          ${vistaPrevia
            .map(
              (r) => `
            <a class="card card-link" href="#/recetas/${r.slug}">
              <div class="card-emoji" aria-hidden="true">${r.emoji}</div>
              <div class="card-body">
                <div class="card-tags">
                  <span class="tag tag-pro">Plan Pro</span>
                  <span class="tag">${r.tiempo} min</span>
                </div>
                <h3 class="card-title">${r.nombre}</h3>
                <p class="card-text">${r.resumen}</p>
              </div>
            </a>`
            )
            .join('')}
        </div>
        <p class="center micro-note" style="margin-top:18px">
          Te quedan ${pro.length - vistaPrevia.length} recetas más por descubrir dentro del
          plan.
        </p>
      </section>

      <div class="callout">
        <p class="micro-note">
          Los precios son en pesos chilenos (CLP) e incluyen IVA. La suscripción se renueva
          mensualmente y puedes cancelarla en cualquier momento desde tu cuenta, sin
          costos adicionales.
        </p>
      </div>
    </section>
  `;

  const mount = () => {
    mensaje = '';
    document.querySelectorAll('[data-cambiar]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const plan = btn.dataset.cambiar;
        if (cambiarPlan(plan)) {
          mensaje =
            plan === 'pro'
              ? 'Listo: tu cuenta ahora tiene el Plan Pro. Todas sus recetas están desbloqueadas.'
              : 'Listo: tu cuenta ahora tiene el Plan Básico.';
          window.dispatchEvent(new Event('app:refresh'));
        }
      });
    });
  };

  return { html, mount };
}

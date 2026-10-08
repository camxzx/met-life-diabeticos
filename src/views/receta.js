import { recetas, tiposComida } from '../data/recetas.js';
import { usuarioActual, tieneAcceso, esc } from '../auth.js';
import { gate } from './gate.js';

function mensajeBloqueo(user, r) {
  if (!user) {
    return `
      <div class="callout callout-pro" role="alert">
        <p><strong>${esc(r.nombre)} es una receta del Plan Pro.</strong></p>
        <p class="callout-sub">
          Crea tu cuenta o ingresa con la tuya para desbloquear las 55 recetas del Plan Pro.
        </p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/ingresar?plan=pro">Crear cuenta Plan Pro</a>
          <a class="btn btn-ghost" href="#/planes">Comparar los planes</a>
        </div>
      </div>`;
  }

  return `
    <div class="callout callout-pro" role="alert">
      <p><strong>Tu Plan Básico no incluye esta receta.</strong></p>
      <p class="callout-sub">
        Las recetas del Plan Pro están disponibles en el plan superior, junto con videos de
        nutrición y recetas de bebidas. Puedes cambiar cuando quieras.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#/planes">Subir a Plan Pro</a>
        <a class="btn btn-ghost" href="#/recetas">Seguir con mis recetas</a>
      </div>
    </div>`;
}

export function renderReceta(slug) {
  const user = usuarioActual();
  const r = recetas.find((x) => x.slug === slug);
  if (!r) {
    return {
      html: `
        <section class="section center">
          <h1 class="h1">Receta no encontrada</h1>
          <p class="lead">Puede que la receta haya cambiado de nombre.</p>
          <a class="btn btn-primary" href="${user ? '#/recetas' : '#/'}">${user ? 'Volver al recetario' : 'Volver al inicio'}</a>
        </section>`,
    };
  }

  if (!user && !r.muestra) {
    return {
      html: gate({
        titulo: 'Inicia sesión para ver esta receta',
        texto:
          'Las recetas están disponibles para usuarios con cuenta. Ingresa o crea la tuya para ver ingredientes, preparación y valores nutricionales.',
        redir: `/recetas/${slug}`,
      }),
    };
  }

  const tipo = tiposComida.find((t) => t.id === r.tipo);
  const esPro = r.plan === 'pro';
  const acceso = tieneAcceso(r, user);
  const bloqueada = esPro && !acceso;

  const html = `
    <section class="section">
      <a class="back-link" href="${user ? '#/recetas' : '#/'}">← ${user ? 'Volver al recetario' : 'Volver al inicio'}</a>

      <article class="recipe">
        <header class="recipe-head">
          <div class="recipe-emoji" aria-hidden="true">${r.emoji}</div>
          <div>
            <div class="card-tags">
              <span class="tag">${tipo ? tipo.label : r.tipo}</span>
              <span class="tag">${r.dificultad === 'baja' ? 'Fácil' : r.dificultad === 'media' ? 'Media' : 'Exigente'}</span>
              <span class="tag">${r.tiempo} min</span>
              <span class="tag">${r.porciones} ${r.porciones === 1 ? 'porción' : 'porciones'}</span>
              ${
                esPro
                  ? acceso
                    ? '<span class="tag tag-pro">Plan Pro · incluida en tu plan</span>'
                    : '<span class="tag tag-pro">Plan Pro</span>'
                  : '<span class="tag tag-soft">Plan Básico · acceso libre</span>'
              }
              ${r.muestra ? `<span class="tag tag-soft">${user ? 'Destacada' : 'Receta de ejemplo'}</span>` : ''}
            </div>
            <h1 class="h1">${r.nombre}</h1>
            <p class="lead">${r.resumen}</p>
            <div class="tag-row">
              ${r.etiquetas.map((e) => `<span class="tag tag-soft">${e}</span>`).join('')}
            </div>
          </div>
        </header>

        ${bloqueada ? mensajeBloqueo(user, r) : ''}

        ${
          bloqueada
            ? `<div class="locked-grid">
                <div class="locked-box"><h2 class="h3">Ingredientes</h2><p>Disponibles con el Plan Pro.</p></div>
                <div class="locked-box"><h2 class="h3">Preparación</h2><p>Disponible con el Plan Pro.</p></div>
              </div>`
            : `
        <div class="recipe-cols">
          <section class="recipe-panel">
            <h2 class="h3">Ingredientes</h2>
            <ul class="ingredientes">
              ${r.ingredientes.map((i) => `<li>${i}</li>`).join('')}
            </ul>
          </section>

          <section class="recipe-panel">
            <h2 class="h3">Preparación</h2>
            <ol class="steps">
              ${r.pasos.map((p) => `<li>${p}</li>`).join('')}
            </ol>
          </section>
        </div>`
        }

        ${
          bloqueada
            ? ''
            : `<div class="callout">
          <h2 class="h3">Por qué te conviene esta receta</h2>
          <p>${r.consejo}</p>
        </div>`
        }

        <section class="recipe-panel">
          <h2 class="h3">Valores nutricionales de referencia</h2>
          <table class="nutri">
            <thead>
              <tr><th>Por porción</th><th>Cantidad aprox.</th></tr>
            </thead>
            <tbody>
              <tr><td>Energía</td><td>${r.kcal} kcal</td></tr>
              <tr><td>Carbohidratos</td><td>${r.carb} g</td></tr>
              <tr><td>Proteínas</td><td>${r.prot} g</td></tr>
              <tr><td>Grasas totales</td><td>${r.grasas} g</td></tr>
            </tbody>
          </table>
          <p class="micro-note">
            Valores aproximados calculados con porciones caseras; varían según las marcas y
            cantidades exactas. No son indicaciones médicas.
          </p>
        </section>
      </article>
    </section>
  `;

  return { html };
}

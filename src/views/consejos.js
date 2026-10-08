import { consejos, fuentes } from '../data/consejos.js';
import { usuarioActual } from '../auth.js';
import { gate } from './gate.js';

export function renderConsejos() {
  const user = usuarioActual();

  if (!user) {
    return {
      html: gate({
        titulo: 'Inicia sesión para leer los consejos',
        texto:
          'Los 10 consejos de alimentación, sus fuentes y las guías prácticas están disponibles para usuarios con cuenta. En el inicio puedes ver uno de ellos.',
        redir: '/consejos',
      }),
    };
  }

  const categorias = [...new Set(consejos.map((c) => c.categoria))];

  const html = `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Guía práctica</p>
        <h1 class="h1">Consejos para el día a día</h1>
        <p class="lead">
          Diez consejos cortos, ordenados por categoría, con la fuente de cada uno.
          Despliega el que te interese para ver los detalles.
        </p>
      </div>

      <div class="consejo-filters">
        <button class="chip active" data-cat="todas" type="button">Todas</button>
        ${categorias.map((c) => `<button class="chip" data-cat="${c}" type="button">${c}</button>`).join('')}
      </div>

      <div class="consejo-list" id="consejo-list">
        ${consejos
          .map(
            (c) => `
          <details class="consejo" data-cat="${c.categoria}">
            <summary>
              <span class="consejo-cat">${c.categoria}</span>
              <span class="consejo-title">${c.titulo}</span>
              <span class="consejo-res">${c.resumen}</span>
            </summary>
            <div class="consejo-body">
              <ul>
                ${c.puntos.map((p) => `<li>${p}</li>`).join('')}
              </ul>
              <p class="micro-note">Fuente: ${c.fuente}</p>
            </div>
          </details>`
          )
          .join('')}
      </div>

      <div class="callout">
        <h2 class="h3">Fuentes utilizadas</h2>
        <ul class="mini-list">
          ${fuentes.map((f) => `<li><strong>${f.nombre}</strong>: ${f.detalle}</li>`).join('')}
        </ul>
        <p class="micro-note">
          Si algo de este sitio contradice lo que te indicó tu equipo de salud, sigue siempre
          la indicación profesional.
        </p>
      </div>
    </section>
  `;

  const mount = () => {
    const chips = document.querySelectorAll('.consejo-filters .chip');
    const items = document.querySelectorAll('#consejo-list .consejo');

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.cat;
        items.forEach((item) => {
          item.style.display = cat === 'todas' || item.dataset.cat === cat ? '' : 'none';
        });
      });
    });
  };

  return { html, mount };
}

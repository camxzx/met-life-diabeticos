import { clases } from '../data/clases.js';
import { usuarioActual } from '../auth.js';
import { gate } from './gate.js';

export function renderClases() {
  if (!usuarioActual()) {
    return {
      html: gate({
        titulo: 'Inicia sesión para ver las clases',
        texto:
          'Las clases de selección de alimentos están incluidas en el Plan Básico y en el Plan Pro. En el inicio puedes ver un ejemplo.',
        redir: '/clases',
      }),
    };
  }

  const categorias = [...new Set(clases.map((c) => c.categoria))];

  const html = `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Clases de selección de alimentos</p>
        <h1 class="h1">Aprende a elegir lo que compras</h1>
        <p class="lead">
          Seis clases cortas, incluidas en los dos planes, con la fuente oficial de cada una.
          Despliega la que te interese para ver todos los puntos.
        </p>
      </div>

      <div class="consejo-filters">
        <button class="chip active" data-cat="todas" type="button">Todas</button>
        ${categorias.map((c) => `<button class="chip" data-cat="${c}" type="button">${c}</button>`).join('')}
      </div>

      <div class="consejo-list" id="clase-list">
        ${clases
          .map(
            (c) => `
          <details class="consejo clase" data-cat="${c.categoria}">
            <summary>
              <span class="consejo-cat">${c.categoria}</span>
              <span class="consejo-title">${c.titulo}</span>
              <span class="consejo-res">${c.resumen}</span>
              <span class="tag tag-soft clase-duracion">⏱ ${c.duracion}</span>
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
        <p class="micro-note">
          Las clases son educativas y no reemplazan la indicación de tu equipo de salud.
          Si algo contradice lo que te indicaron, sigue siempre la indicación profesional.
        </p>
      </div>
    </section>
  `;

  const mount = () => {
    const chips = document.querySelectorAll('.consejo-filters .chip');
    const items = document.querySelectorAll('#clase-list .consejo');

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

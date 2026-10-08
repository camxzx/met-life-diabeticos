import { recetas, tiposComida, dificultades } from '../data/recetas.js';
import { usuarioActual } from '../auth.js';
import { gate } from './gate.js';

function etiquetaDificultad(id) {
  const d = dificultades.find((x) => x.id === id);
  return d ? d.label : id;
}

const state = {
  tipo: 'todos',
  dificultad: 'todas',
  tiempo: 'todos',
  busqueda: '',
  soloBasico: false,
};

export function filtradas(esPro) {
  return recetas.filter((r) => {
    if (!esPro && r.plan === 'pro') return false;
    if (state.tipo !== 'todos' && r.tipo !== state.tipo) return false;
    if (state.dificultad !== 'todas' && r.dificultad !== state.dificultad) return false;
    if (state.tiempo !== 'todos') {
      const max = Number(state.tiempo);
      if (r.tiempo > max) return false;
    }
    if (esPro && state.soloBasico && r.plan !== 'basico') return false;
    if (state.busqueda) {
      const q = state.busqueda.toLowerCase();
      const texto = `${r.nombre} ${r.resumen} ${r.ingredientes.join(' ')}`.toLowerCase();
      if (!texto.includes(q)) return false;
    }
    return true;
  });
}

function card(r) {
  const tipo = tiposComida.find((t) => t.id === r.tipo);
  return `
    <a class="card card-link" href="#/recetas/${r.slug}">
      <div class="card-emoji" aria-hidden="true">${r.emoji}</div>
      <div class="card-body">
        <div class="card-tags">
          <span class="tag">${tipo ? tipo.label : r.tipo}</span>
          <span class="tag">${etiquetaDificultad(r.dificultad)}</span>
          ${r.plan === 'pro' ? '<span class="tag tag-pro">Plan Pro</span>' : ''}
        </div>
        <h3 class="card-title">${r.nombre}</h3>
        <p class="card-text">${r.resumen}</p>
        <p class="card-meta">${r.tiempo} min · ${r.porciones} ${r.porciones === 1 ? 'porción' : 'porciones'} · ${r.kcal} kcal por porción</p>
      </div>
    </a>`;
}

export function renderRecetas() {
  const user = usuarioActual();

  if (!user) {
    return {
      html: gate({
        titulo: 'Inicia sesión para ver las recetas',
        texto:
          'El recetario completo está disponible para usuarios con cuenta. Dentro encontrarás las recetas de tu plan, con ingredientes, pasos y valores nutricionales.',
        redir: '/recetas',
      }),
    };
  }

  const esPro = user.plan === 'pro';
  const tiposVisibles = esPro ? tiposComida : tiposComida.filter((t) => t.id !== 'bebida');

  const html = `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Recetario</p>
        <h1 class="h1">Recetas para diabetes tipo 2</h1>
        <p class="lead">
          Filtra por el momento del día, la dificultad o el tiempo que tengas disponible.
          Los valores nutricionales son aproximados por porción.
        </p>
      </div>

      <div class="plan-banner ${esPro ? 'plan-banner-pro' : ''}">
        <div class="plan-banner-texto">
          <span class="tag ${esPro ? 'tag-pro' : ''}">Tu plan</span>
          <strong>${esPro ? 'Plan Pro' : 'Plan Básico'}</strong>
          <span>${
            esPro
              ? 'Tienes las 55 recetas desbloqueadas, incluidas las de dificultad superior y las 10 bebidas saludables.'
              : 'Tu Plan Básico incluye 25 recetas, con ingredientes, preparación y valores nutricionales por porción.'
          }</span>
        </div>
        <a class="btn btn-ghost" href="#/planes">${esPro ? 'Ver mi plan' : 'Cambiar de plan'}</a>
      </div>

      <div class="filters" role="search">
        <div class="filter-row">
          <span class="filter-label">Momento del día</span>
          <div class="chips" id="chips-tipo">
            <button class="chip active" data-tipo="todos" type="button">Todos</button>
            ${tiposVisibles
              .map((t) => `<button class="chip" data-tipo="${t.id}" type="button">${t.icono} ${t.label}</button>`)
              .join('')}
          </div>
        </div>

        <div class="filter-row">
          <label class="filter-label" for="f-dificultad">Dificultad</label>
          <select class="select" id="f-dificultad">
            <option value="todas">Todas</option>
            ${dificultades.map((d) => `<option value="${d.id}">${d.label}</option>`).join('')}
          </select>

          <label class="filter-label" for="f-tiempo">Tiempo máximo</label>
          <select class="select" id="f-tiempo">
            <option value="todos">Cualquiera</option>
            <option value="20">20 minutos</option>
            <option value="30">30 minutos</option>
            <option value="45">45 minutos</option>
            <option value="60">60 minutos</option>
          </select>

          <label class="filter-label" for="f-busqueda">Buscar</label>
          <input class="input" id="f-busqueda" type="search" placeholder="Ej: lentejas, pollo, manzana..." />
        </div>

        <div class="filter-row">
          ${
            esPro
              ? `<label class="check">
            <input type="checkbox" id="f-basico" />
            Mostrar solo recetas del Plan Básico
          </label>`
              : ''
          }
          <button class="link-btn" id="f-reset" type="button">Limpiar filtros</button>
        </div>
      </div>

      <p class="result-count" id="result-count" aria-live="polite"></p>
      <div class="grid-3" id="recipe-grid"></div>
    </section>
  `;

  const mount = () => {
    const grid = document.getElementById('recipe-grid');
    const count = document.getElementById('result-count');

    const update = () => {
      const list = filtradas(esPro);
      count.textContent =
        list.length === 0
          ? 'No encontramos recetas con esos filtros.'
          : `${list.length} ${list.length === 1 ? 'receta encontrada' : 'recetas encontradas'}`;
      grid.innerHTML =
        list.length === 0
          ? `<div class="empty">
              <p>Prueba con otro filtro o borra la búsqueda.</p>
              <button class="btn btn-ghost" id="empty-reset" type="button">Limpiar filtros</button>
            </div>`
          : list.map(card).join('');
      const emptyBtn = document.getElementById('empty-reset');
      if (emptyBtn) emptyBtn.addEventListener('click', reset);
    };

    const reset = () => {
      state.tipo = 'todos';
      state.dificultad = 'todas';
      state.tiempo = 'todos';
      state.busqueda = '';
      state.soloBasico = false;
      document.querySelectorAll('#chips-tipo .chip').forEach((c) => {
        c.classList.toggle('active', c.dataset.tipo === 'todos');
      });
      document.getElementById('f-dificultad').value = 'todas';
      document.getElementById('f-tiempo').value = 'todos';
      document.getElementById('f-busqueda').value = '';
      const chk = document.getElementById('f-basico');
      if (chk) chk.checked = false;
      update();
    };

    document.querySelectorAll('#chips-tipo .chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        state.tipo = chip.dataset.tipo;
        document.querySelectorAll('#chips-tipo .chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        update();
      });
    });

    document.getElementById('f-dificultad').addEventListener('change', (e) => {
      state.dificultad = e.target.value;
      update();
    });
    document.getElementById('f-tiempo').addEventListener('change', (e) => {
      state.tiempo = e.target.value;
      update();
    });
    document.getElementById('f-busqueda').addEventListener('input', (e) => {
      state.busqueda = e.target.value.trim();
      update();
    });
    const chkBasico = document.getElementById('f-basico');
    if (chkBasico) {
      chkBasico.addEventListener('change', (e) => {
        state.soloBasico = e.target.checked;
        update();
      });
    }
    document.getElementById('f-reset').addEventListener('click', reset);

    update();
  };

  return { html, mount };
}


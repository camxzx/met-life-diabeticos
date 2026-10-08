import { usuarioActual, esc } from '../auth.js';
import { gate } from './gate.js';

const KEY = 'mlp_encuestas';

const comunas = ['Puerto Montt', 'Puerto Varas', 'Llanquihue', 'Los Muermos', 'Otra localidad'];
const dificultades = [
  'No sé qué preparar',
  'El precio de los ingredientes',
  'Falta de tiempo para cocinar',
  'No encuentro recetas fáciles',
  'No entiendo las etiquetas nutricionales',
  'Mi familia come de forma distinta',
];

function leerRespuestas() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch {
    return [];
  }
}

function descargar(nombre, contenido, tipo) {
  const blob = new Blob([contenido], { type: tipo });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  a.click();
  URL.revokeObjectURL(url);
}

function aCSV(respuestas) {
  const columnas = [
    'fecha',
    'nombre',
    'edad',
    'comuna',
    'relacion',
    'tiempo_diagnostico',
    'frecuencia_cocina',
    'dificultades',
    'utilidad',
    'comentario',
  ];
  const filas = respuestas.map((r) =>
    columnas
      .map((c) => `"${String(r[c] ?? '').replaceAll('"', '""').replaceAll('\n', ' ')}"`)
      .join(';')
  );
  return [columnas.join(';'), ...filas].join('\n');
}

function bloqueExito(respuestas) {
  return `
    <div class="callout callout-ok">
      <h2 class="h3">¡Gracias por responder!</h2>
      <p>
        Tu respuesta fue registrada. Van <strong>${respuestas.length}</strong>
        ${respuestas.length === 1 ? 'respuesta' : 'respuestas'} de la comunidad.
      </p>
      <div class="hero-actions">
        <button class="btn btn-primary" id="nueva" type="button">Responder otra</button>
      </div>
      <p class="micro-note export-tools">
        Exportar respuestas:
        <button class="link-btn" id="export-csv" type="button">CSV</button> ·
        <button class="link-btn" id="export-json" type="button">JSON</button> ·
        <button class="link-btn link-danger" id="borrar" type="button">Borrar</button>
      </p>
    </div>

    <section class="recipe-panel">
      <h2 class="h3">Respuestas registradas</h2>
      <div class="table-wrap">
        <table class="nutri">
          <thead>
            <tr><th>#</th><th>Fecha</th><th>Edad</th><th>Comuna</th><th>Relación</th><th>Utilidad</th></tr>
          </thead>
          <tbody>
            ${respuestas
              .map(
                (r, i) => `<tr>
                  <td>${i + 1}</td>
                  <td>${new Date(r.fecha).toLocaleDateString('es-CL')}</td>
                  <td>${r.edad}</td>
                  <td>${r.comuna}</td>
                  <td>${r.relacion}</td>
                  <td>${r.utilidad}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <p class="micro-note">
        Tus respuestas son anónimas y se usan únicamente para mejorar el sitio.
        No se comparten con terceros.
      </p>
    </section>
  `;
}

function bloqueForm() {
  const user = usuarioActual();
  return `
    <form class="form" id="encuesta-form" novalidate>
      ${
        user
          ? `<p class="help-inline">Estamos usando tu nombre de cuenta: <strong>${esc(user.nombre)}</strong>. Puedes cambiarlo si prefieres.</p>`
          : ''
      }
      <div class="form-row">
        <div class="field">
          <label for="nombre">Nombre o apodo <span class="opt">(opcional)</span></label>
          <input class="input" id="nombre" name="nombre" type="text" maxlength="40"
            value="${user ? esc(user.nombre) : ''}" placeholder="Ej: María" />
        </div>
        <div class="field">
          <label for="edad">Edad *</label>
          <input class="input" id="edad" name="edad" type="number" min="18" max="99" inputmode="numeric" required />
          <span class="error" data-error-for="edad"></span>
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label for="comuna">Comuna *</label>
          <select class="select" id="comuna" name="comuna" required>
            <option value="">Selecciona...</option>
            ${comunas.map((c) => `<option>${c}</option>`).join('')}
          </select>
          <span class="error" data-error-for="comuna"></span>
        </div>
        <div class="field">
          <label for="relacion">¿Cuál es tu relación con la diabetes? *</label>
          <select class="select" id="relacion" name="relacion" required>
            <option value="">Selecciona...</option>
            <option>Tengo diabetes tipo 2</option>
            <option>Preparo comida para una persona con diabetes</option>
            <option>Ambas cosas</option>
            <option>Ninguna de las anteriores</option>
          </select>
          <span class="error" data-error-for="relacion"></span>
        </div>
      </div>

      <div class="form-row">
        <div class="field">
          <label for="tiempo">Tiempo con el diagnóstico</label>
          <select class="select" id="tiempo" name="tiempo">
            <option>Menos de 1 año</option>
            <option>Entre 1 y 5 años</option>
            <option>Más de 5 años</option>
            <option>No aplica / no tengo diagnóstico</option>
          </select>
        </div>
        <div class="field">
          <label for="cocina">¿Con qué frecuencia cocinas en casa? *</label>
          <select class="select" id="cocina" name="cocina" required>
            <option value="">Selecciona...</option>
            <option>Todos los días</option>
            <option>Varios días a la semana</option>
            <option>Solo fines de semana</option>
            <option>Casi nunca</option>
          </select>
          <span class="error" data-error-for="cocina"></span>
        </div>
      </div>

      <fieldset class="field">
        <legend>¿Qué dificultades tienes al comer o cocinar? *</legend>
        <div class="checks">
          ${dificultades
            .map(
              (d, i) => `<label class="check">
                <input type="checkbox" name="dificultad" value="${d}" id="dif-${i}" />
                ${d}
              </label>`
            )
            .join('')}
        </div>
        <span class="error" data-error-for="dificultad"></span>
      </fieldset>

      <div class="field">
        <label for="utilidad">¿Te sería útil un sitio con recetas y consejos para diabetes? *</label>
        <select class="select" id="utilidad" name="utilidad" required>
          <option value="">Selecciona...</option>
          <option>Sí, mucho</option>
          <option>Sí, un poco</option>
          <option>No estoy seguro/a</option>
          <option>No</option>
        </select>
        <span class="error" data-error-for="utilidad"></span>
      </div>

      <div class="field">
        <label for="comentario">Comentario o sugerencia <span class="opt">(opcional)</span></label>
        <textarea class="input" id="comentario" name="comentario" rows="4" maxlength="500"
          placeholder="Cuéntanos qué recetas te gustaría encontrar..."></textarea>
      </div>

      <label class="check">
        <input type="checkbox" id="consentimiento" required />
        Acepto que mis respuestas se registren de forma anónima y sean usadas para mejorar
        el sitio. *
      </label>
      <span class="error" data-error-for="consentimiento"></span>

      <div class="form-actions">
        <button class="btn btn-primary" type="submit">Enviar respuesta</button>
        <button class="btn btn-ghost" type="reset">Limpiar</button>
      </div>
    </form>
  `;
}

export function renderEncuesta() {
  if (!usuarioActual()) {
    return {
      html: gate({
        titulo: 'Inicia sesión para responder la encuesta',
        texto:
          'La encuesta está disponible para usuarios con cuenta. Tus respuestas son anónimas y nos ayudan a mejorar el sitio para toda la comunidad.',
        redir: '/encuesta',
      }),
    };
  }

  const respuestas = leerRespuestas();

  const html = `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Tu opinión importa</p>
        <h1 class="h1">Encuesta de la comunidad</h1>
        <p class="lead">
          Cuéntanos qué dificultades tienes al comer y cocinar para que podamos mejorar el
          sitio. Toma menos de 3 minutos y es anónima.
        </p>
        <div class="progress" role="img" aria-label="${respuestas.length} de 30 respuestas">
          <div class="progress-bar" style="width: ${Math.min(100, Math.round((respuestas.length / 30) * 100))}%"></div>
        </div>
        <p class="micro-note">Meta: 30 respuestas · Van ${respuestas.length}</p>
      </div>

      <div id="encuesta-zona">${respuestas.length > 0 ? bloqueExito(respuestas) : bloqueForm()}</div>
    </section>
  `;

  const mount = () => {
    const zona = document.getElementById('encuesta-zona');

    const pintarExito = () => {
      const rs = leerRespuestas();
      zona.innerHTML = bloqueExito(rs);
      vincularExito();
    };

    const setError = (name, msg) => {
      const el = document.querySelector(`[data-error-for="${name}"]`);
      if (el) el.textContent = msg || '';
    };

    const vincularExito = () => {
      const nueva = document.getElementById('nueva');
      const csv = document.getElementById('export-csv');
      const json = document.getElementById('export-json');
      const borrar = document.getElementById('borrar');

      if (nueva) {
        nueva.addEventListener('click', () => {
          zona.innerHTML = bloqueForm();
          vincularForm();
        });
      }
      if (csv) csv.addEventListener('click', () => descargar('encuesta-met-life.csv', aCSV(leerRespuestas()), 'text/csv;charset=utf-8'));
      if (json) json.addEventListener('click', () => descargar('encuesta-met-life.json', JSON.stringify(leerRespuestas(), null, 2), 'application/json'));
      if (borrar) {
        borrar.addEventListener('click', () => {
          if (confirm('¿Borrar todas las respuestas guardadas en este dispositivo?')) {
            localStorage.removeItem(KEY);
            zona.innerHTML = bloqueForm();
            vincularForm();
          }
        });
      }
    };

    const vincularForm = () => {
      const form = document.getElementById('encuesta-form');
      if (!form) return;

      form.addEventListener('submit', (e) => {
        e.preventDefault();
        ['edad', 'comuna', 'relacion', 'cocina', 'dificultad', 'utilidad', 'consentimiento'].forEach((n) => setError(n, ''));

        const edad = form.edad.value.trim();
        const comuna = form.comuna.value;
        const relacion = form.relacion.value;
        const cocina = form.cocina.value;
        const utilidad = form.utilidad.value;
        const dificultadesMarcadas = [...form.querySelectorAll('input[name="dificultad"]:checked')].map((c) => c.value);
        const consentimiento = form.consentimiento.checked;

        let ok = true;
        if (!edad || Number(edad) < 18 || Number(edad) > 99) {
          setError('edad', 'Ingresa una edad entre 18 y 99.');
          ok = false;
        }
        if (!comuna) {
          setError('comuna', 'Selecciona tu comuna.');
          ok = false;
        }
        if (!relacion) {
          setError('relacion', 'Selecciona una opción.');
          ok = false;
        }
        if (!cocina) {
          setError('cocina', 'Selecciona una opción.');
          ok = false;
        }
        if (dificultadesMarcadas.length === 0) {
          setError('dificultad', 'Marca al menos una dificultad.');
          ok = false;
        }
        if (!utilidad) {
          setError('utilidad', 'Selecciona una opción.');
          ok = false;
        }
        if (!consentimiento) {
          setError('consentimiento', 'Debes aceptar para continuar.');
          ok = false;
        }
        if (!ok) {
          const primerError = form.querySelector('.error:not(:empty)');
          if (primerError) primerError.scrollIntoView({ behavior: 'smooth', block: 'center' });
          return;
        }

        const lista = leerRespuestas();
        lista.push({
          fecha: new Date().toISOString(),
          nombre: form.nombre.value.trim(),
          edad: Number(edad),
          comuna,
          relacion,
          tiempo_diagnostico: form.tiempo.value,
          frecuencia_cocina: cocina,
          dificultades: dificultadesMarcadas.join(' | '),
          utilidad,
          comentario: form.comentario.value.trim(),
        });
        localStorage.setItem(KEY, JSON.stringify(lista));
        pintarExito();
        zona.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });

      form.addEventListener('reset', () => {
        ['edad', 'comuna', 'relacion', 'cocina', 'dificultad', 'utilidad', 'consentimiento'].forEach((n) => setError(n, ''));
      });
    };

    vincularForm();
  };

  return { html, mount };
}

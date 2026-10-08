import { recetas } from '../data/recetas.js';
import { consejos } from '../data/consejos.js';

const beneficios = [
  'Información clara y organizada en un solo lugar',
  'Consejos para mejorar tus hábitos alimenticios',
  'Ideas de recetas y preparaciones adecuadas',
  'Orientación para elegir alimentos de manera conscienta',
  'Ahorro de tiempo al encontrar información útil rápidamente',
  'Educación sobre la importancia de una alimentación equilibrada',
  'Útil para personas con diabetes y también para su familia',
];

const stats = [
  { valor: recetas.length, sufijo: '', label: 'recetas con valores nutricionales' },
  { valor: 10, sufijo: '', label: 'consejos con fuente consultada' },
  { valor: 2, sufijo: '', label: 'planes: Básico y Pro' },
  { valor: 3, sufijo: ' min', label: 'para responder la encuesta' },
];

export function renderInicio() {
  const muestra = recetas.find((r) => r.muestra) || recetas[0];
  const consejoMuestra = consejos[0];

  const html = `
    <section class="hero">
      <div class="hero-badges">
        <span class="badge">📍 Alerce, Puerto Montt</span>
        <span class="badge">👤 Diabetes tipo 2 · 40 a 65 años</span>
        <span class="badge">🍲 Ingredientes de la feria y el almacén</span>
      </div>
      <h1 class="h1">Cocinar con diabetes tipo 2, claro, rico y sencillo</h1>
      <p class="lead">
        Met-Life Diabéticos es un sitio con recetas e insumos pensados para personas con
        diabetes tipo 2 y para quienes cocinan en casa: qué comer, cómo prepararlo y con qué
        ingredientes, explicado en palabras simples.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#/ingresar?modo=crear">Crear mi cuenta gratis</a>
        <a class="btn btn-ghost" href="#/planes">Ver los planes</a>
      </div>
      <p class="micro-note hero-nota">
        Puedes ver una receta y un consejo de ejemplo sin cuenta. Con tu acceso abres tu
        recetario: 25 recetas con el Plan Básico o 55 con el Plan Pro, que además agrega
        los videos de nutrición y las 10 bebidas saludables.
      </p>

      <div class="stats" role="list">
        ${stats
          .map(
            (s) => `
          <div class="stat" role="listitem">
            <span class="stat-valor" data-contar="${s.valor}" data-sufijo="${s.sufijo}">0${s.sufijo}</span>
            <span class="stat-label">${s.label}</span>
          </div>`
          )
          .join('')}
      </div>

      <nav class="hero-index" aria-label="Secciones de esta página">
        <button class="chip" data-scroll="causa" type="button">Causa</button>
        <button class="chip" data-scroll="problema" type="button">Problema</button>
        <button class="chip" data-scroll="solucion" type="button">Solución</button>
        <button class="chip" data-scroll="publico" type="button">Para quién</button>
        <button class="chip" data-scroll="beneficios" type="button">Beneficios</button>
        <button class="chip" data-scroll="planes" type="button">Planes</button>
      </nav>
    </section>

    <section class="section band reveal" id="causa">
      <div class="section-head">
        <p class="eyebrow">Por qué ocurre</p>
        <h2 class="h2">Causa</h2>
        <p class="lead">
          La diabetes tipo 2 se explica por una suma de factores: algunos se pueden cambiar
          y otros no.
        </p>
      </div>
      <div class="split">
        <div class="panel">
          <h3 class="panel-title">Factores que sí se pueden cambiar</h3>
          <p>
            La falta de conocimientos sobre nutrición y cocina hace que muchas personas
            repitan alimentos que no le convienen a su salud, sumado al consumo frecuente de
            ultraprocesados, el sobrepeso y la baja actividad física. Estos factores aumentan
            el riesgo de desarrollar diabetes tipo 2 y complicaciones asociadas.
          </p>
        </div>
        <div class="panel panel-accent">
          <h3 class="panel-title">Factores que no se pueden cambiar</h3>
          <p>
            También influye la herencia: no se hereda la enfermedad de forma directa, pero sí
            existe una predisposición genética, es decir, una mayor tendencia a contraerla.
            Por eso, una buena alimentación es aún más importante si hay antecedentes
            familiares.
          </p>
        </div>
      </div>
      <p class="micro-note center" style="margin-top:16px">
        Fuentes: Ministerio de Salud de Chile (Guía de Alimentación Saludable) y Servicio
        Nacional de Alimentación y Nutrición (SNA).
      </p>
    </section>

    <section class="section reveal" id="problema">
      <div class="section-head">
        <p class="eyebrow">El problema concreto</p>
        <h2 class="h2">¿Qué pasa en nuestro sector?</h2>
        <p class="lead">
          En Alerce, comuna de Puerto Montt, crece la preocupación por la alimentación
          saludable y el aumento del sobrepeso, la obesidad y enfermedades crónicas como la
          diabetes.
        </p>
      </div>
      <div class="split">
        <div class="panel">
          <h3 class="panel-title">Lo que vemos</h3>
          <p>
            Muchas familias tienen dificultades para acceder a información clara sobre cómo
            preparar comidas saludables y adaptadas a personas con necesidades alimentarias
            especiales. La falta de educación nutricional, el consumo frecuente de alimentos
            ultraprocesados y la escasez de recetas fáciles de preparar favorecen hábitos poco
            saludables.
          </p>
        </div>
        <div class="panel">
          <h3 class="panel-title">A quién afecta</h3>
          <p>
            Esta situación impacta la calidad de vida de niños, jóvenes, adultos y adultos
            mayores, y es especialmente delicada para quienes viven con diabetes tipo 2 y
            deben organizar su comida todos los días. Por eso es necesaria una herramienta
            que acerque recetas saludables y los insumos para prepararlas.
          </p>
        </div>
      </div>
    </section>

    <section class="section band reveal" id="solucion">
      <div class="section-head">
        <p class="eyebrow">Nuestra propuesta</p>
        <h2 class="h2">Solución</h2>
        <p class="lead">
          Un sitio web para quienes conviven con la diabetes tipo 2, que entrega recetas e
          insumos específicos, con variedad para elegir la que más les acomode por gusto o por
          conveniencia.
        </p>
      </div>
      <div class="split">
        <div class="panel panel-accent">
          <h3 class="panel-title">Qué hacemos</h3>
          <p>
            Organizamos recetas por momento del día, dificultad y tiempo de preparación, con
            ingredientes fáciles de encontrar en almacenes y ferias, más consejos prácticos de
            alimentación explicados en palabras simples.
          </p>
        </div>
        <div class="panel panel-accent">
          <h3 class="panel-title">Para qué</h3>
          <p>
            Fomentar hábitos alimenticios más sanos y acompañar la vida cotidiana de quienes
            viven con diabetes: que cocinar bien sea posible, económico y atractivo, apoyando
            la calidad de vida de toda la familia.
          </p>
        </div>
      </div>
    </section>

    <section class="section reveal" id="publico">
      <div class="section-head">
        <p class="eyebrow">Para quién es</p>
        <h2 class="h2">Nuestro público objetivo</h2>
        <p class="lead">
          Personas con diabetes tipo 2 de 40 a 65 años de Alerce, Puerto Montt, Puerto Varas
          y alrededores, y también sus familiares y cuidadores.
        </p>
      </div>
      <div class="split">
        <div class="persona">
          <span class="persona-emoji" aria-hidden="true">🧑‍🍳</span>
          <div>
            <h3 class="panel-title">Principal: quien vive con diabetes tipo 2</h3>
            <p>
              Adulto de 40 a 65 años que cocina en casa y busca ideas claras, económicas y
              rápidas para no repetir siempre lo mismo y aprender a cocinar de manera más
              saludable.
            </p>
          </div>
        </div>
        <div class="persona">
          <span class="persona-emoji" aria-hidden="true">👪</span>
          <div>
            <h3 class="panel-title">Secundario: quien prepara su comida</h3>
            <p>
              Familiar o cuidador que cocina para esa persona. Usa el sitio para elegir recetas
              que toda la familia pueda compartir sin complicaciones, porque muchas veces
              existe desinformación o falta de información gastronómica fácil de comprender.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="section band reveal" id="ofrecemos">
      <div class="section-head">
        <p class="eyebrow">Qué servicio ofrecemos</p>
        <h2 class="h2">Información, consejos y recetas</h2>
        <p class="lead">
          Resolvemos la duda de qué se puede comer, qué conviene limitar y cómo organizar las
          comidas, con contenido sencillo y fácil de encontrar.
        </p>
      </div>
      <div class="grid-4">
        <div class="feature">
          <span class="feature-emoji" aria-hidden="true">📚</span>
          <h3>Información clara</h3>
          <p>Recomendaciones de alimentación explicadas en palabras simples y organizadas por tema.</p>
        </div>
        <div class="feature">
          <span class="feature-emoji" aria-hidden="true">💡</span>
          <h3>Consejos prácticos</h3>
          <p>Tips para elegir alimentos, leer etiquetas y armar el plato día a día.</p>
        </div>
        <div class="feature">
          <span class="feature-emoji" aria-hidden="true">🍽️</span>
          <h3>Recetas adaptadas</h3>
          <p>Ideas de comidas y preparaciones sencillas, económicas y con ingredientes accesibles.</p>
        </div>
        <div class="feature">
          <span class="feature-emoji" aria-hidden="true">🧭</span>
          <h3>Orientación diaria</h3>
          <p>Cómo organizar tus comidas para mantener una alimentación más equilibrada.</p>
        </div>
      </div>
    </section>

    <section class="section reveal" id="beneficios">
      <div class="section-head">
        <p class="eyebrow">Beneficios</p>
        <h2 class="h2">Qué ganas usando el sitio</h2>
      </div>
      <div class="benefits">
        ${beneficios.map((b) => `<div class="benefit"><span aria-hidden="true">✓</span><p>${b}</p></div>`).join('')}
      </div>
    </section>

    <section class="section band reveal" id="diferencia">
      <div class="section-head">
        <p class="eyebrow">Qué nos diferencia</p>
        <h2 class="h2">Nutrición + gastronomía</h2>
      </div>
      <div class="callout">
        <p>
          A diferencia de otros sitios, <strong>combinamos educación sobre diabetes con
          conocimientos gastronómicos</strong>: entregamos información de forma sencilla y
          práctica, junto con recetas, ideas de preparación y consejos que permiten transformar
          una alimentación saludable en algo rico, accesible y fácil de hacer en la vida
          cotidiana.
        </p>
      </div>
      <blockquote class="quote">
        “Ayudamos a personas con diabetes y a sus familias a mejorar sus hábitos alimenticios
        mediante información clara, consejos prácticos y recetas saludables, combinando
        nutrición y gastronomía para que comer bien sea más sencillo, rico y accesible.”
        <cite>· Propuesta de valor</cite>
      </blockquote>
    </section>

    <section class="section reveal" id="muestra">
      <div class="section-head">
        <p class="eyebrow">Así se ve el contenido</p>
        <h2 class="h2">Una muestra</h2>
        <p class="lead">
          Puedes ver esta receta y este consejo completos sin cuenta. El resto se desbloquea
          con tu acceso.
        </p>
      </div>
      <div class="split">
        <a class="card card-link" href="#/recetas/${muestra.slug}">
          <div class="card-emoji" aria-hidden="true">${muestra.emoji}</div>
          <div class="card-body">
            <div class="card-tags">
              <span class="tag tag-soft">Receta de ejemplo</span>
              <span class="tag">${muestra.tiempo} min</span>
            </div>
            <h3 class="card-title">${muestra.nombre}</h3>
            <p class="card-text">${muestra.resumen}</p>
            <p class="card-meta">Ver ingredientes y preparación →</p>
          </div>
        </a>
        <div class="panel">
          <span class="tag tag-soft">Consejo de ejemplo</span>
          <h3 class="panel-title" style="margin-top:12px">${consejoMuestra.titulo}</h3>
          <p>${consejoMuestra.resumen}</p>
          <ul class="mini-list">
            ${consejoMuestra.puntos.slice(0, 3).map((p) => `<li>${p}</li>`).join('')}
          </ul>
          <p class="micro-note">Fuente: ${consejoMuestra.fuente}</p>
        </div>
      </div>
    </section>

    <section class="section band reveal" id="planes">
      <div class="section-head">
        <p class="eyebrow">Modelo de suscripción</p>
        <h2 class="h2">Los dos planes</h2>
        <p class="lead">
          Eliges tu plan al crear la cuenta y puedes cambiarlo cuando quieras desde la página
          de Planes.
        </p>
      </div>
      <div class="plans-grid">
        <article class="plan">
          <h3 class="h3">Plan Básico</h3>
          <p class="plan-para">Para empezar con una rutina de recetas clara.</p>
          <p class="price">$5.990<span> / mes</span></p>
          <ul class="plan-list">
            <li>25 recetas con ingredientes fáciles de conseguir</li>
            <li>Técnicas de cocción con menos grasa</li>
            <li>Clases de selección de alimentos</li>
          </ul>
          <a class="btn btn-ghost" href="#/ingresar?modo=crear">Empezar con Básico</a>
        </article>
        <article class="plan plan-destacado">
          <span class="plan-flag">Más elegido</span>
          <h3 class="h3">Plan Pro</h3>
          <p class="plan-para">Para quienes cocinan seguido y quieren más variedad.</p>
          <p class="price">$8.990<span> / mes</span></p>
          <ul class="plan-list">
            <li>55 recetas divididas por dificultad baja, media y superior</li>
            <li>Información extra de nutrición en videos y audios</li>
            <li>Clases de selección de alimentos</li>
            <li>10 recetas de bebidas saludables</li>
          </ul>
          <a class="btn btn-primary" href="#/ingresar?plan=pro">Empezar con Pro</a>
        </article>
      </div>
      <p class="center" style="margin-top:26px">
        <a class="btn btn-ghost" href="#/planes">Comparar planes en detalle</a>
      </p>
      <div class="callout">
        <p class="micro-note">
          Precios en pesos chilenos (CLP) con IVA incluido. La suscripción se renueva
          mensualmente y puedes cancelarla cuando quieras, sin costos adicionales.
        </p>
      </div>
    </section>

    <section class="section reveal" id="fuentes">
      <div class="section-head">
        <p class="eyebrow">Información confiable</p>
        <h2 class="h2">¿En qué nos basamos?</h2>
      </div>
      <div class="callout">
        <p>
          El contenido se construyó a partir de las recomendaciones del Ministerio de Salud de
          Chile y del Servicio Nacional de Alimentación y Nutrición, además de lo que dice la
          ley de etiquetado de alimentos. <strong>No prometemos curas ni tratamientos</strong>:
          ofrecemos información educativa y recetas para acompañar tus buenos hábitos.
        </p>
        <p class="micro-note">
          Fuentes chilenas: MINSAL (Guía de Alimentación Saludable y guía GES de diabetes tipo
          2), SNA (alimentación saludable y planificación de menús) y Ley 20.606 de etiquetado
          de alimentos.
        </p>
      </div>
    </section>

    <section class="section center cta-final reveal">
      <h2 class="h2">Empieza hoy mismo</h2>
      <p class="lead">
        Crea tu cuenta, elige tu plan y accede a tu recetario y a la encuesta de la
        comunidad. Toma menos de un minuto.
      </p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#/ingresar?modo=crear">Crear mi cuenta</a>
        <a class="btn btn-ghost" href="#/ingresar">Ya tengo cuenta</a>
      </div>
    </section>
  `;

  const mount = () => {
    document.querySelectorAll('[data-scroll]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const destino = document.getElementById(btn.dataset.scroll);
        if (destino) destino.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    const contadores = document.querySelectorAll('[data-contar]');
    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    contadores.forEach((el) => {
      const meta = Number(el.dataset.contar) || 0;
      const sufijo = el.dataset.sufijo || '';
      if (reducido) {
        el.textContent = `${meta}${sufijo}`;
        return;
      }
      const dur = 900;
      const inicio = performance.now();
      const paso = (ahora) => {
        const p = Math.min(1, (ahora - inicio) / dur);
        const suave = 1 - Math.pow(1 - p, 3);
        el.textContent = `${Math.round(meta * suave)}${sufijo}`;
        if (p < 1) requestAnimationFrame(paso);
      };
      requestAnimationFrame(paso);
    });
  };

  return { html, mount };
}

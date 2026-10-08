import { videos, audios } from '../data/nutricion.js';
import { usuarioActual } from '../auth.js';
import { gate } from './gate.js';

function pantallaMejora() {
  return `
      <section class="section">
        <div class="auth-card gate-card">
          <span class="gate-icono" aria-hidden="true">🔒</span>
          <p class="eyebrow">Incluido en el Plan Pro</p>
          <h1 class="h1">Videos y audios de nutrición</h1>
          <p class="lead">
            La información extra de nutrición en videos y audio es parte del Plan Pro,
            junto con las 55 recetas divididas por dificultad baja, media y superior y
            las 10 bebidas saludables. Tu Plan Básico ya incluye las 25 recetas, las
            técnicas de cocción y las clases de selección de alimentos.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#/planes">Ver el Plan Pro</a>
            <a class="btn btn-ghost" href="#/recetas">Volver a mis recetas</a>
          </div>
          <p class="gate-links">
            <a href="#/">← Volver al inicio</a>
            <a href="#/planes">Comparar los dos planes</a>
          </p>
        </div>
      </section>
  `;
}

export function renderNutricion() {
  const user = usuarioActual();

  if (!user) {
    return {
      html: gate({
        titulo: 'Inicia sesión para ver videos y audios',
        texto:
          'La información extra de nutrición en videos y audio está incluida en el Plan Pro. Crea tu cuenta para ver el detalle de cada plan.',
        redir: '/nutricion',
      }),
    };
  }

  if (user.plan !== 'pro') {
    return { html: pantallaMejora() };
  }

  const tarjetaVideo = (v) => `
    <article class="player" data-tipo="video" data-id="${v.id}">
      <div class="player-head">
        <span class="tag tag-pro">🎬 Video</span>
        <span class="tag">${v.duracion}</span>
      </div>
      <h3 class="h3">${v.titulo}</h3>
      <p class="micro-note">${v.resumen}</p>
      <div class="player-slide">
        <p class="player-slide-titulo"></p>
        <p class="player-slide-texto"></p>
      </div>
      <div class="player-controls">
        <button class="btn btn-primary btn-sm" data-accion="play" type="button">▶ Reproducir</button>
        <button class="btn btn-ghost btn-sm" data-accion="pause" type="button">⏸ Pausar</button>
        <button class="link-btn" data-accion="prev" type="button">← Anterior</button>
        <button class="link-btn" data-accion="next" type="button">Siguiente →</button>
        <span class="player-indice"></span>
      </div>
      <p class="micro-note player-aviso"></p>
      <details class="player-transcripcion">
        <summary>Ver transcripción</summary>
        <ol class="mini-list">
          ${v.slides.map((s) => `<li><strong>${s.titulo}.</strong> ${s.texto}</li>`).join('')}
        </ol>
      </details>
    </article>`;

  const tarjetaAudio = (a) => `
    <article class="player" data-tipo="audio" data-id="${a.id}">
      <div class="player-head">
        <span class="tag tag-pro">🎧 Audio</span>
        <span class="tag">${a.duracion}</span>
      </div>
      <h3 class="h3">${a.titulo}</h3>
      <p class="micro-note">${a.resumen}</p>
      <div class="player-controls">
        <button class="btn btn-primary btn-sm" data-accion="play" type="button">▶ Escuchar</button>
        <button class="btn btn-ghost btn-sm" data-accion="stop" type="button">⏹ Detener</button>
        <span class="player-indice"></span>
      </div>
      <p class="micro-note player-aviso"></p>
      <details class="player-transcripcion">
        <summary>Ver transcripción</summary>
        <p class="consejo-res">${a.guion}</p>
      </details>
    </article>`;

  const html = `
    <section class="section">
      <div class="section-head">
        <p class="eyebrow">Solo en el Plan Pro</p>
        <h1 class="h1">Videos y audios de nutrición</h1>
        <p class="lead">
          Información extra de nutrición en video y audio: cuatro clases en diapositivas y
          cuatro audios breves que se reproducen con la voz de tu navegador.
        </p>
      </div>

      <div class="consejo-filters" id="media-filters">
        <button class="chip active" data-tipo="todos" type="button">Todos</button>
        <button class="chip" data-tipo="video" type="button">🎬 Videos</button>
        <button class="chip" data-tipo="audio" type="button">🎧 Audios</button>
      </div>

      <div class="media-grid" id="media-grid">
        ${videos.map(tarjetaVideo).join('')}
        ${audios.map(tarjetaAudio).join('')}
      </div>

      <div class="callout">
        <p class="micro-note">
          Los videos y audios usan la voz del navegador; si tu equipo no la tiene
          disponible, la transcripción completa de cada clase está en el desplegable de
          abajo. El contenido es educativo y no reemplaza la indicación de tu equipo de salud.
        </p>
      </div>
    </section>
  `;

  const mount = () => {
    const soportaVoz = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

    const tarjetas = [...document.querySelectorAll('.player')];
    const items = { ...Object.fromEntries(videos.map((v) => [v.id, v])), ...Object.fromEntries(audios.map((a) => [a.id, a])) };

    const decir = (texto, alTerminar) => {
      const u = new SpeechSynthesisUtterance(texto);
      u.lang = 'es-CL';
      const voz = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.startsWith('es'));
      if (voz) u.voice = voz;
      u.rate = 1;
      u.onend = alTerminar;
      u.onerror = alTerminar;
      window.speechSynthesis.speak(u);
    };

    const detenerTodo = () => {
      if (soportaVoz) window.speechSynthesis.cancel();
      tarjetas.forEach((t) => {
        t.dataset.plantando = '';
        const play = t.querySelector('[data-accion="play"]');
        if (play) play.textContent = t.dataset.tipo === 'video' ? '▶ Reproducir' : '▶ Escuchar';
        const indice = t.querySelector('.player-indice');
        if (indice && t.dataset.tipo === 'audio') indice.textContent = '';
      });
    };

    tarjetas.forEach((tarjeta) => {
      const item = items[tarjeta.dataset.id];
      const esVideo = tarjeta.dataset.tipo === 'video';
      const playBtn = tarjeta.querySelector('[data-accion="play"]');
      const aviso = tarjeta.querySelector('.player-aviso');
      let idx = 0;

      const pintarSlide = () => {
        const s = item.slides[idx];
        tarjeta.querySelector('.player-slide-titulo').textContent = s.titulo;
        tarjeta.querySelector('.player-slide-texto').textContent = s.texto;
        tarjeta.querySelector('.player-indice').textContent = `Diapositiva ${idx + 1} de ${item.slides.length}`;
      };

      if (esVideo) pintarSlide();

      if (!soportaVoz) {
        tarjeta.querySelectorAll('button').forEach((b) => (b.disabled = true));
        aviso.textContent =
          'Tu navegador no tiene voz disponible: usa la transcripción para leer la clase.';
        return;
      }

      const avanzar = () => {
        if (tarjeta.dataset.plantando !== 'si') return;
        if (idx < item.slides.length - 1) {
          idx += 1;
          pintarSlide();
          decir(item.slides[idx].texto, avanzar);
        } else {
          detenerTodo();
        }
      };

      playBtn.addEventListener('click', () => {
        const yaSonando = tarjeta.dataset.plantando === 'si';
        detenerTodo();
        if (yaSonando) return;
        tarjeta.dataset.plantando = 'si';
        playBtn.textContent = esVideo ? '⏸ Pausar' : '⏸ Sonando…';
        if (esVideo) {
          decir(item.slides[idx].texto, avanzar);
        } else {
          decir(item.guion, () => detenerTodo());
        }
      });

      const pausa = tarjeta.querySelector('[data-accion="pause"]') || tarjeta.querySelector('[data-accion="stop"]');
      if (pausa) pausa.addEventListener('click', () => detenerTodo());

      const prev = tarjeta.querySelector('[data-accion="prev"]');
      const next = tarjeta.querySelector('[data-accion="next"]');
      if (prev)
        prev.addEventListener('click', () => {
          if (idx === 0) return;
          idx -= 1;
          const sonando = tarjeta.dataset.plantando === 'si';
          window.speechSynthesis.cancel();
          pintarSlide();
          if (sonando) decir(item.slides[idx].texto, avanzar);
        });
      if (next)
        next.addEventListener('click', () => {
          if (idx >= item.slides.length - 1) return;
          idx += 1;
          const sonando = tarjeta.dataset.plantando === 'si';
          window.speechSynthesis.cancel();
          pintarSlide();
          if (sonando) decir(item.slides[idx].texto, avanzar);
        });
    });

    const chips = document.querySelectorAll('#media-filters .chip');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        detenerTodo();
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const tipo = chip.dataset.tipo;
        tarjetas.forEach((t) => {
          t.style.display = tipo === 'todos' || t.dataset.tipo === tipo ? '' : 'none';
        });
      });
    });
  };

  return { html, mount };
}

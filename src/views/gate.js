export function gate({ titulo, texto, redir }) {
  const params = new URLSearchParams();
  if (redir) params.set('redir', redir);
  const qs = params.toString();
  const base = qs ? `#/ingresar?${qs}` : '#/ingresar';
  const crear = qs ? `${base}&modo=crear` : '#/ingresar?modo=crear';

  return `
    <section class="section">
      <div class="auth-card gate-card">
        <span class="gate-icono" aria-hidden="true">🔒</span>
        <p class="eyebrow">Contenido para usuarios con cuenta</p>
        <h1 class="h1">${titulo}</h1>
        <p class="lead">${texto}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${base}">Ya tengo cuenta</a>
          <a class="btn btn-ghost" href="${crear}">Quiero crear una</a>
        </div>
        <p class="help-note">
          Crear una cuenta toma menos de un minuto: solo necesitas un nombre, un correo y
          una contraseña. Al terminar eliges tu plan y vuelves justo a esta página.
        </p>
        <p class="gate-links">
          <a href="#/">← Volver al inicio</a>
          <a href="#/planes">Ver los planes</a>
        </p>
      </div>
    </section>
  `;
}

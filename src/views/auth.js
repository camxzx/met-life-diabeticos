import { crearCuenta, ingresar, usuarioActual, esc, cerrarSesion, PLANES } from '../auth.js';

function panelCuenta(user) {
  const plan = PLANES[user.plan];
  return `
    <div class="auth-card">
      <p class="eyebrow">Tu cuenta</p>
      <h1 class="h1">Hola, ${esc(user.nombre)}</h1>
      <p class="lead">
        Tu sesión está activa en este dispositivo. Así sabemos qué recetas puedes ver.
      </p>

      <div class="cuenta-datos">
        <div class="dato"><span class="dato-label">Nombre</span><span class="dato-valor">${esc(user.nombre)}</span></div>
        <div class="dato"><span class="dato-label">Correo</span><span class="dato-valor">${esc(user.email)}</span></div>
        <div class="dato">
          <span class="dato-label">Plan activo</span>
          <span class="dato-valor">${plan.nombre} · ${plan.precio}/mes</span>
        </div>
      </div>

      <div class="hero-actions">
        <a class="btn btn-primary" href="#/recetas">Ver mis recetas</a>
        <a class="btn btn-ghost" href="#/planes">Cambiar de plan</a>
        <button class="btn btn-ghost" id="salir-cuenta" type="button">Cerrar sesión</button>
      </div>
    </div>
  `;
}

function formIngresar() {
  return `
    <form class="auth-form" id="form-ingresar" novalidate>
      <div class="field">
        <label for="in-email">Correo electrónico</label>
        <input class="input" id="in-email" name="email" type="email" autocomplete="email"
          inputmode="email" placeholder="nombre@correo.cl" />
      </div>
      <div class="field">
        <label for="in-pass">Contraseña</label>
        <input class="input" id="in-pass" name="password" type="password" autocomplete="current-password" />
      </div>
      <p class="error" id="error-ingresar" aria-live="polite"></p>
      <button class="btn btn-primary btn-block" type="submit">Ingresar</button>
      <button class="link-btn link-center" id="olvide-pass" type="button">¿Olvidaste tu contraseña?</button>
      <p class="help-inline" id="msg-olvide" hidden aria-live="polite">
        Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.
      </p>
    </form>
  `;
}

function formCrear(planDefault) {
  const esPro = planDefault === 'pro';
  return `
    <form class="auth-form" id="form-crear" novalidate>
      <div class="field">
        <label for="cr-nombre">¿Cómo te llamas?</label>
        <input class="input" id="cr-nombre" name="nombre" type="text" autocomplete="name"
          maxlength="60" placeholder="Ej: María González" />
      </div>
      <div class="field">
        <label for="cr-email">Correo electrónico</label>
        <input class="input" id="cr-email" name="email" type="email" autocomplete="email"
          inputmode="email" placeholder="nombre@correo.cl" />
      </div>
      <div class="field">
        <label for="cr-pass">Contraseña</label>
        <input class="input" id="cr-pass" name="password" type="password" autocomplete="new-password"
          aria-describedby="pass-ayuda" />
        <span class="help-inline" id="pass-ayuda">Mínimo 6 caracteres.</span>
      </div>

      <fieldset class="field">
        <legend>Elige tu plan</legend>
        <div class="plan-pick">
          <label class="plan-opcion ${esPro ? '' : 'seleccionado'}">
            <input type="radio" name="plan" value="basico" ${esPro ? '' : 'checked'} />
            <span class="plan-opcion-nombre">Plan Básico</span>
            <span class="plan-opcion-precio">${PLANES.basico.precio}/mes</span>
            <span class="plan-opcion-desc">25 recetas, técnicas de cocción y clases de selección de alimentos</span>
          </label>
          <label class="plan-opcion ${esPro ? 'seleccionado' : ''}">
            <input type="radio" name="plan" value="pro" ${esPro ? 'checked' : ''} />
            <span class="plan-opcion-nombre">Plan Pro</span>
            <span class="plan-opcion-precio">${PLANES.pro.precio}/mes</span>
            <span class="plan-opcion-desc">55 recetas por dificultad, videos y audios de nutrición, clases de selección y 10 bebidas</span>
          </label>
        </div>
        <span class="help-inline">Puedes cambiar de plan cuando quieras desde la página de Planes.</span>
      </fieldset>

      <p class="error" id="error-crear" aria-live="polite"></p>
      <button class="btn btn-primary btn-block" type="submit">Crear cuenta</button>
    </form>
  `;
}

export function renderAuth(params) {
  const user = usuarioActual();
  if (user) return { html: `<section class="section">${panelCuenta(user)}</section>`, mount: mountCuenta };

  const planPref = params.get('plan') === 'pro' ? 'pro' : 'basico';
  const modoInicial = params.get('modo') === 'crear' || params.get('plan') === 'pro' ? 'crear' : 'ingresar';

  const html = `
    <section class="section">
      <div class="auth-card">
        <p class="eyebrow">Cuenta Met-Life Diabéticos</p>
        <h1 class="h1">${modoInicial === 'crear' ? 'Crea tu cuenta' : 'Ingresa a tu cuenta'}</h1>
        <p class="lead">
          Tu cuenta guarda el plan que elegiste, así el sitio sabe qué recetas mostrarte.
        </p>

        <div class="tabs" role="tablist">
          <button class="tab ${modoInicial === 'ingresar' ? 'active' : ''}" id="tab-ingresar" type="button" role="tab">
            Ya tengo cuenta
          </button>
          <button class="tab ${modoInicial === 'crear' ? 'active' : ''}" id="tab-crear" type="button" role="tab">
            Quiero crear una
          </button>
        </div>

        <div id="panel-ingresar" ${modoInicial === 'ingresar' ? '' : 'hidden'}>${formIngresar()}</div>
        <div id="panel-crear" ${modoInicial === 'crear' ? '' : 'hidden'}>${formCrear(planPref)}</div>

        <p class="help-note">
          Tu cuenta te da acceso a las recetas y consejos según tu plan. Puedes cambiar o
          cancelar tu plan cuando quieras desde la página de Planes.
        </p>
      </div>
    </section>
  `;

  return { html, mount: () => mountAuth(params) };
}

function destinoSeguro(params) {
  const redir = params.get('redir');
  if (redir && /^\/[A-Za-z0-9/-]+$/.test(redir)) return `#${redir}`;
  return '#/recetas';
}

function mostrarError(id, mensaje) {
  const el = document.getElementById(id);
  if (el) el.textContent = mensaje || '';
}

function mountCuenta() {
  const btn = document.getElementById('salir-cuenta');
  if (btn) {
    btn.addEventListener('click', () => {
      cerrarSesion();
      location.hash = '#/';
    });
  }
}

function mountAuth(params) {
  const panelIngresar = document.getElementById('panel-ingresar');
  const panelCrear = document.getElementById('panel-crear');
  const tabIngresar = document.getElementById('tab-ingresar');
  const tabCrear = document.getElementById('tab-crear');

  const irA = (modo) => {
    const activo = modo === 'ingresar';
    tabIngresar.classList.toggle('active', activo);
    tabCrear.classList.toggle('active', !activo);
    panelIngresar.hidden = !activo;
    panelCrear.hidden = activo;
    mostrarError('error-ingresar', '');
    mostrarError('error-crear', '');
    const primero = (activo ? panelIngresar : panelCrear).querySelector('input');
    if (primero) primero.focus();
  };

  tabIngresar.addEventListener('click', () => irA('ingresar'));
  tabCrear.addEventListener('click', () => irA('crear'));

  document.getElementById('form-ingresar').addEventListener('submit', (e) => {
    e.preventDefault();
    const res = ingresar(e.target.email.value, e.target.password.value);
    if (!res.ok) {
      mostrarError('error-ingresar', res.error);
      return;
    }
    location.hash = destinoSeguro(params);
  });

  document.getElementById('olvide-pass').addEventListener('click', () => {
    document.getElementById('msg-olvide').hidden = false;
  });

  const formCrearEl = document.getElementById('form-crear');
  formCrearEl.addEventListener('change', (e) => {
    if (e.target.name === 'plan') {
      formCrearEl.querySelectorAll('.plan-opcion').forEach((o) => o.classList.remove('seleccionado'));
      e.target.closest('.plan-opcion').classList.add('seleccionado');
    }
  });

  formCrearEl.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.target;
    const res = crearCuenta({
      nombre: form.nombre.value,
      email: form.email.value,
      password: form.password.value,
      plan: form.plan.value,
    });
    if (!res.ok) {
      mostrarError('error-crear', res.error);
      return;
    }
    location.hash = destinoSeguro(params);
  });

  if (!panelIngresar.hidden) panelIngresar.querySelector('input').focus();
}

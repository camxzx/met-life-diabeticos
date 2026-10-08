const USERS_KEY = 'mlp_users';
const SESSION_KEY = 'mlp_session';

export const PLANES = {
  basico: { id: 'basico', nombre: 'Plan Básico', precio: '$5.990' },
  pro: { id: 'pro', nombre: 'Plan Pro', precio: '$8.990' },
};

export function esc(texto) {
  return String(texto ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function leerUsuarios() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function guardarUsuarios(usuarios) {
  localStorage.setItem(USERS_KEY, JSON.stringify(usuarios));
}

function clave(pass) {
  const texto = `${pass}::met-life-demo`;
  let h = 5381;
  for (let i = 0; i < texto.length; i++) h = ((h << 5) + h + texto.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

export function usuarioActual() {
  const email = localStorage.getItem(SESSION_KEY);
  if (!email) return null;
  return leerUsuarios().find((u) => u.email === email) || null;
}

export function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function ingresar(email, password) {
  const limpio = email.trim().toLowerCase();
  if (!emailValido(limpio)) return { ok: false, error: 'Escribe un correo válido, por ejemplo: nombre@correo.cl' };
  if (!password) return { ok: false, error: 'Escribe tu contraseña.' };

  const user = leerUsuarios().find((u) => u.email === limpio);
  if (!user) return { ok: false, error: 'No encontramos una cuenta con ese correo. Puedes crear una más abajo.' };
  if (user.pass !== clave(password)) return { ok: false, error: 'La contraseña no coincide. Inténtalo otra vez.' };

  localStorage.setItem(SESSION_KEY, user.email);
  return { ok: true, user };
}

export function crearCuenta({ nombre, email, password, plan }) {
  const n = nombre.trim();
  const limpio = email.trim().toLowerCase();

  if (n.length < 2) return { ok: false, error: 'Escribe tu nombre o apodo (mínimo 2 letras).' };
  if (!emailValido(limpio)) return { ok: false, error: 'Escribe un correo válido, por ejemplo: nombre@correo.cl' };
  if (password.length < 6) return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres.' };
  if (!PLANES[plan]) return { ok: false, error: 'Elige el plan que quieres usar.' };

  const usuarios = leerUsuarios();
  if (usuarios.some((u) => u.email === limpio)) {
    return { ok: false, error: 'Ya existe una cuenta con ese correo. Puedes ingresar en la pestaña anterior.' };
  }

  const user = {
    nombre: n,
    email: limpio,
    pass: clave(password),
    plan,
    creado: new Date().toISOString(),
  };
  usuarios.push(user);
  guardarUsuarios(usuarios);
  localStorage.setItem(SESSION_KEY, user.email);
  return { ok: true, user };
}

export function cambiarPlan(plan) {
  const actual = usuarioActual();
  if (!actual || !PLANES[plan]) return false;
  const usuarios = leerUsuarios().map((u) => (u.email === actual.email ? { ...u, plan } : u));
  guardarUsuarios(usuarios);
  return true;
}

export function cerrarSesion() {
  localStorage.removeItem(SESSION_KEY);
}

export function tieneAcceso(receta, user) {
  if (receta.plan !== 'pro') return true;
  return Boolean(user && user.plan === 'pro');
}

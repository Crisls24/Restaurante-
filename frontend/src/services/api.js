const AUTH_API = import.meta.env.VITE_AUTH_API || 'http://localhost:3000/api';
const MENU_API = import.meta.env.VITE_MENU_API || 'http://localhost:8000/api';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      throw new Error('El servicio está tardando en responder. Intenta de nuevo en unos segundos.');
    }
    throw err;
  }
}

export async function register(data) {
  const res = await fetch(`${AUTH_API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al registrar');
  return json;
}

export async function login(data) {
  const res = await fetch(`${AUTH_API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Credenciales invalidas');
  return json;
}

export async function getProfile() {
  const res = await fetch(`${AUTH_API}/auth/profile`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al obtener perfil');
  return json;
}

export async function getMenu(categoria = null) {
  const url = categoria ? `${MENU_API}/menu/?categoria=${categoria}` : `${MENU_API}/menu/`;
  const res = await fetchWithTimeout(url, {}, 45000);
  const json = await res.json();
  if (!res.ok) throw new Error('Error al cargar menu');
  return json;
}

export async function createReservation(data) {
  const res = await fetch(`${AUTH_API}/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al crear reservación');
  return json;
}

export async function getReservations() {
  const res = await fetch(`${AUTH_API}/reservations`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al obtener reservaciones');
  return json;
}

export async function getTodayReservations() {
  const res = await fetch(`${AUTH_API}/reservations/today`, { headers: authHeaders() });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al obtener reservaciones de hoy');
  return json;
}

export async function updateReservationStatus(id, estado) {
  const res = await fetch(`${AUTH_API}/reservations/${id}/status`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ estado }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al actualizar estado');
  return json;
}

export async function cancelReservation(id) {
  const res = await fetch(`${AUTH_API}/reservations/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al cancelar reservación');
  return json;
}

export async function sendNotification(channel, to, message) {
  const res = await fetch(`${AUTH_API}/notifications/${channel}`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ to, message }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Error al enviar notificacion');
  return json;
}

export { AUTH_API, MENU_API, getToken };

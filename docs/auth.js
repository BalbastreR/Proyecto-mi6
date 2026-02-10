// =========================
//  Auth / Registro (DEMO)
//  Guarda en localStorage
// =========================

const KEY_PENDING  = "mi6_users_pending";
const KEY_APPROVED = "mi6_users_approved";
const KEY_REJECTED = "mi6_users_rejected";
const KEY_PROFILE  = "mi6_profile";

// ---------- helpers ----------
function readList(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// ---------- registro ----------
function registerPending(user) {
  const pending = readList(KEY_PENDING);
  const approved = readList(KEY_APPROVED);

  const email = (user.email || "").trim().toLowerCase();
  if (!email) return { ok: false, error: "Email inválido." };

  const emailExists =
    pending.some(u => (u.email || "").toLowerCase() === email) ||
    approved.some(u => (u.email || "").toLowerCase() === email);

  if (emailExists) {
    return { ok: false, error: "Ese email ya tiene solicitud o ya está aprobado." };
  }

  const cleanUser = {
    id: user.id || (crypto?.randomUUID?.() ?? String(Date.now())),
    nombre: (user.nombre || "").trim(),
    email,
    licencia: (user.licencia || "").trim(),
    tipoVehiculo: (user.tipoVehiculo || "").trim(),
    createdAt: user.createdAt || new Date().toISOString()
  };

  if (!cleanUser.nombre) return { ok: false, error: "Falta nombre." };
  if (!cleanUser.licencia) return { ok: false, error: "Falta licencia/calca." };
  if (!cleanUser.tipoVehiculo) return { ok: false, error: "Falta tipo de vehículo." };

  pending.push(cleanUser);
  writeList(KEY_PENDING, pending);
  return { ok: true };
}

function getPendingUsers() {
  return readList(KEY_PENDING).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

function approveUser(userId) {
  const pending = readList(KEY_PENDING);
  const approved = readList(KEY_APPROVED);

  const idx = pending.findIndex(u => u.id === userId);
  if (idx === -1) return;

  const user = pending[idx];
  pending.splice(idx, 1);

  approved.push({ ...user, approvedAt: new Date().toISOString() });

  writeList(KEY_PENDING, pending);
  writeList(KEY_APPROVED, approved);
}

function rejectUser(userId) {
  const pending = readList(KEY_PENDING);
  const rejected = readList(KEY_REJECTED);

  const idx = pending.findIndex(u => u.id === userId);
  if (idx === -1) return;

  const user = pending[idx];
  pending.splice(idx, 1);

  rejected.push({ ...user, rejectedAt: new Date().toISOString() });

  writeList(KEY_PENDING, pending);
  writeList(KEY_REJECTED, rejected);
}

// ---------- perfil (obligatorio) ----------
function saveProfile(profile) {
  const p = {
    nombre: (profile.nombre || "").trim(),
    email: (profile.email || "").trim().toLowerCase(),
    telefono: (profile.telefono || "").trim(),
    licencia: (profile.licencia || "").trim(),
    tipoVehiculo: (profile.tipoVehiculo || "").trim(),
    modelo: (profile.modelo || "").trim(),
    matricula: (profile.matricula || "").trim().toUpperCase(),
    updatedAt: new Date().toISOString()
  };

  const required = [
    ["nombre", "Nombre y apellidos"],
    ["email", "Email"],
    ["telefono", "Teléfono"],
    ["licencia", "Licencia / calca"],
    ["tipoVehiculo", "Tipo de vehículo"],
    ["modelo", "Modelo vehículo"],
    ["matricula", "Matrícula"]
  ];

  for (const [key, label] of required) {
    if (!p[key]) return { ok: false, error: `Falta completar: ${label}` };
  }

  localStorage.setItem(KEY_PROFILE, JSON.stringify(p));
  return { ok: true };
}

function getProfile() {
  try {
    return JSON.parse(localStorage.getItem(KEY_PROFILE) || "null");
  } catch {
    return null;
  }
}

function isProfileComplete() {
  const p = getProfile();
  if (!p) return false;

  const requiredKeys = ["nombre","email","telefono","licencia","tipoVehiculo","modelo","matricula"];
  return requiredKeys.every(k => p[k] && String(p[k]).trim() !== "");
}
const KEY_PROFILE = "mi6_profile";

function saveProfile(profile) {
  // Validación mínima
  const required = ["nombre","email","telefono","licencia","tipoVehiculo","modelo","matricula"];
  for (const k of required) {
    if (!profile[k] || String(profile[k]).trim() === "") {
      return { ok: false, error: "Falta completar: " + k };
    }
  }
  writeList(KEY_PROFILE, profile); // reutilizamos writeList para guardar objeto
  localStorage.setItem(KEY_PROFILE, JSON.stringify(profile));
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
  const required = ["nombre","email","telefono","licencia","tipoVehiculo","modelo","matricula"];
  return required.every(k => p[k] && String(p[k]).trim() !== "");
}
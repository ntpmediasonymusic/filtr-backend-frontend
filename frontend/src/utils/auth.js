// Lectura centralizada de la sesion actual (token + user en localStorage).
// Reutiliza el mismo mecanismo de autenticacion ya usado en el resto del
// sitio (PageHeader, ShowCard, PlaylistCard); no introduce un sistema nuevo.

function decodeTokenExp(bearerToken) {
  try {
    const raw = bearerToken.includes(" ")
      ? bearerToken.split(" ")[1]
      : bearerToken;
    const payload = raw.split(".")[1];
    const decoded = JSON.parse(window.atob(payload));
    return decoded.exp || null;
  } catch {
    return null;
  }
}

/**
 * @returns {{authenticated: boolean, expired: boolean, user: object|null}}
 */
export function getAuthSession() {
  let token = null;
  try {
    token = localStorage.getItem("token");
  } catch {
    return { authenticated: false, expired: false, user: null };
  }

  if (!token) return { authenticated: false, expired: false, user: null };

  const exp = decodeTokenExp(token);
  if (!exp) return { authenticated: false, expired: false, user: null };

  if (exp * 1000 <= Date.now()) {
    return { authenticated: false, expired: true, user: null };
  }

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  return { authenticated: true, expired: false, user };
}

export function isAuthenticated() {
  return getAuthSession().authenticated;
}

// Conserva la intencion de navegacion (ruta + query) antes de mandar al
// usuario a /login o /signup, para poder regresarlo tras autenticarse.
// sessionStorage: solo debe sobrevivir la sesion de la pestana actual.

const KEY = "filtr_post_auth_redirect";

export function setPostAuthRedirect(path) {
  if (!path) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    /* no-op */
  }
}

/** Lee y limpia el destino guardado (uso unico). */
export function consumePostAuthRedirect() {
  try {
    const value = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return value || null;
  } catch {
    return null;
  }
}

// Helpers de presentacion compartidos entre las cards y los banners de Galeria.
// Sin datos de negocio: solo mapeos visuales deterministicos.

const STATUS_META = {
  new: { label: "Nuevo", className: "bg-[#CA249C] text-white" },
  featured: { label: "Destacado", className: "bg-[#CFDD28] text-black" },
  exclusive: { label: "Exclusivo", className: "bg-[#00DAF0] text-black" },
  upcoming: { label: "Próximamente", className: "bg-white/20 text-white" },
};

export function getStatusMeta(status) {
  return STATUS_META[status] || null;
}

// Paletas deterministicas para el placeholder de portada mientras no haya
// imagenes definitivas. Se elige a partir del id/slug, no al azar, para que
// la misma card siempre muestre el mismo color entre renders.
const COVER_GRADIENTS = [
  "linear-gradient(135deg, #CA249C 0%, #5C0F8B 100%)",
  "linear-gradient(135deg, #5C0F8B 0%, #004FD4 100%)",
  "linear-gradient(135deg, #004FD4 0%, #00DAF0 100%)",
  "linear-gradient(135deg, #19A74E 0%, #00DAF0 100%)",
  "linear-gradient(135deg, #CA249C 0%, #00DAF0 100%)",
  "linear-gradient(135deg, #004FD4 0%, #5C0F8B 50%, #CA249C 100%)",
];

function hashString(str = "") {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function getCoverGradient(seed = "") {
  const index = hashString(String(seed)) % COVER_GRADIENTS.length;
  return COVER_GRADIENTS[index];
}

export const HERO_GRADIENT =
  "linear-gradient(135deg, #CA249C 0%, #5C0F8B 35%, #004FD4 65%, #00DAF0 100%)";

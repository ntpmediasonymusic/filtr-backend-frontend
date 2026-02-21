import { useMemo } from "react";

const useFormattedDate = (dateString) => {
  const formattedDate = useMemo(() => {
    const d = parseFlexible(dateString);
    if (!d) return "";

    const monthNames = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    const day = d.getDate(); // 1-31
    const month = monthNames[d.getMonth()];
    const year = d.getFullYear();

    return `${day} de ${month} ${year}`;
  }, [dateString]);

  return formattedDate;
};

function parseFlexible(s) {
  if (!s) return null;

  // ISO YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return new Date(s + "T00:00:00");

  // MM/DD/YYYY
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(s)) {
    const [m, d, y] = s.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  // DD/MM/YYYY
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const [d, m, y] = s.split("/").map(Number);
    return new Date(y, m - 1, d);
  }

  const d = new Date(s);
  return isNaN(d) ? null : d;
}

export default useFormattedDate;
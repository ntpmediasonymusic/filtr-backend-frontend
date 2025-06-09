import { useMemo } from "react";

const useFormattedDate = (dateString) => {
  const formattedDate = useMemo(() => {
    if (!dateString) return "";
    const parts = dateString.split("/");
    if (parts.length !== 3) return dateString;
    // eslint-disable-next-line no-unused-vars
    const [day, month, year] = parts;
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
    const monthIndex = parseInt(month, 10) - 1;
    const dayNumber = parseInt(day, 10);
    if (monthIndex < 0 || monthIndex >= monthNames.length || isNaN(dayNumber)) {
      return dateString;
    }
    return `${monthNames[monthIndex]} ${dayNumber}`;
  }, [dateString]);

  return formattedDate;
};

export default useFormattedDate;

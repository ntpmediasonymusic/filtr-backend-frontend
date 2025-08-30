export async function fetchCountryCode() {
  try {
    const res1 = await fetch("https://ipapi.co/json/");
    if (res1.ok) {
      const j = await res1.json();
      console.log("[GeoIP] respuesta ipapi.co:", j);
      if (j && typeof j.country_code === "string") {
        const code = j.country_code.toUpperCase();
        console.log("[GeoIP] country_code:", code);
        return code;
      }
    } else {
      console.log("[GeoIP] ipapi.co no OK:", res1.status);
    }
  } catch (e) {
    console.log("[GeoIP] error ipapi.co:", e);
  }
  return null;
}

export function mapCountryToRegion(iso2) {
  const region = (() => {
    switch ((iso2 || "").toUpperCase()) {
      case "CR":
        return "cr";
      case "DO":
        return "do";
      case "PA":
        return "pa";
      default:
        return "cr";
    }
  })();
  console.log("[GeoIP] mapeo ISO→region:", iso2, "→", region);
  return region;
}

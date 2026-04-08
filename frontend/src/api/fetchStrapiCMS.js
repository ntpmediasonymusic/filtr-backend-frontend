const CMS_URL = import.meta.env.VITE_CMS_URL;
const CMS_TOKEN = import.meta.env.VITE_CMS_TOKEN;

const mediaUrl = (u) => (u?.startsWith?.("http") ? u : `${CMS_URL}${u || ""}`);

function bestMediaUrl(field) {
  if (!field) return "";
  const file = Array.isArray(field) ? field[0] : field;
  if (!file) return "";

  const candidates = [];
  if (file.url) {
    candidates.push({
      url: file.url,
      w: file.width ?? 0,
      h: file.height ?? 0,
      bytes: file.sizeInBytes ?? 0,
      original: true,
    });
  }
  if (file.formats) {
    for (const fmt of Object.values(file.formats)) {
      candidates.push({
        url: fmt.url,
        w: fmt.width ?? 0,
        h: fmt.height ?? 0,
        bytes: fmt.sizeInBytes ?? 0,
        original: false,
      });
    }
  }
  if (!candidates.length) return "";

  candidates.sort((a, b) => {
    const areaA = (a.w || 0) * (a.h || 0);
    const areaB = (b.w || 0) * (b.h || 0);
    if (areaA !== areaB) return areaB - areaA;
    if (a.bytes !== b.bytes) return (b.bytes || 0) - (a.bytes || 0);
    return a.original ? -1 : 1;
  });

  return candidates[0].url ? mediaUrl(candidates[0].url) : "";
}

/*BANNERS ===========================================================================*/
export async function fetchBanners(region, placement) {
  const normRegion = String(region || "")
    .trim()
    .toLowerCase();
  const nowISO = new Date().toISOString();

  const params = new URLSearchParams({
    "filters[placement][$eq]": placement,
    "filters[active][$eq]": "true",
    publicationState: "live",
    sort: "order:asc",
    "populate[images][populate]": "*",
  });

  params.set("filters[$and][0][$or][0][regions][code][$eqi]", normRegion);
  params.set("filters[$and][0][$or][1][regions][id][$null]", "true");

  params.set("filters[$and][1][$or][0][$and][0][start_at][$null]", "true");
  params.set("filters[$and][1][$or][0][$and][1][end_at][$null]", "true");
  params.set("filters[$and][1][$or][1][$and][0][start_at][$null]", "true");
  params.set("filters[$and][1][$or][1][$and][1][end_at][$gte]", nowISO);
  params.set("filters[$and][1][$or][2][$and][0][start_at][$lte]", nowISO);
  params.set("filters[$and][1][$or][2][$and][1][end_at][$null]", "true");
  params.set("filters[$and][1][$or][3][$and][0][start_at][$lte]", nowISO);
  params.set("filters[$and][1][$or][3][$and][1][end_at][$gte]", nowISO);

  const url = `${CMS_URL}/api/banners?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CMS_TOKEN}`,
    },
  });

  const contentType = res.headers.get("content-type") || "";

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Strapi error ${res.status}: ${text.slice(0, 300)}`);
  }

  if (!contentType.includes("application/json")) {
    const text = await res.text();
    throw new Error(
      `Expected JSON but got ${contentType || "unknown"}: ${text.slice(0, 300)}`,
    );
  }

  const { data } = await res.json();

  return (data || []).map((entry) => {
    const a = entry?.attributes ?? entry ?? {};
    return {
      desktop: bestMediaUrl(a?.images?.desktop),
      mobile: bestMediaUrl(a?.images?.mobile),
      alt: a.alt || a.title || "",
      link: a.linkUrl || "#",
    };
  });
}


/** GENRES ===========================================================================*/
export async function fetchGenres() {
  const params = new URLSearchParams({
    "filters[active][$eq]": "true",
    publicationState: "live",
    sort: "order:asc",
    "populate[images][populate]": "*", 
  });

  const res = await fetch(`${CMS_URL}/api/genres?${params.toString()}`, {
    headers: { Authorization: `Bearer ${CMS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);

  const { data } = await res.json();

  return (data || []).map((entry) => {
    const a = entry?.attributes ?? entry ?? {};
    const desktop = bestMediaUrl(a?.images?.desktop);
    const mobile = bestMediaUrl(a?.images?.mobile);
    return {
      name: a.name || "",
      slug: a.slug || "",
      // Fallbacks
      desktop: desktop || mobile || "",
      mobile: mobile || desktop || "",
      order: typeof a.order === "number" ? a.order : 0,
    };
  });
}


/** MOODS ===========================================================================*/
export async function fetchMoods() {
  const params = new URLSearchParams({
    "filters[active][$eq]": "true",
    publicationState: "live",
    sort: "order:asc",
    "populate[images][populate]": "*", 
  });

  const res = await fetch(`${CMS_URL}/api/moods?${params.toString()}`, {
    headers: { Authorization: `Bearer ${CMS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);

  const { data } = await res.json();

  return (data || []).map((entry) => {
    const a = entry?.attributes ?? entry ?? {};
    const desktop = bestMediaUrl(a?.images?.desktop);
    const mobile = bestMediaUrl(a?.images?.mobile);
    return {
      name: a.name || "",
      slug: a.slug || "",
      // Fallbacks
      desktop: desktop || mobile || "",
      mobile: mobile || desktop || "",
      order: typeof a.order === "number" ? a.order : 0,
    };
  });
}

/* SHOWS =========================================================================== */
export async function fetchShows(region) {
  const normRegion = String(region || "")
    .trim()
    .toLowerCase();

  const params = new URLSearchParams({
    "filters[active][$eq]": "true",
    "filters[canceled][$ne]": "true",
    publicationState: "live",
    sort: "date:asc",
    "populate[image]": "true",
    "populate[artists][fields][0]": "name",
    "populate[place]": "*",
  });

  params.set("filters[$and][0][$or][0][regions][code][$eqi]", normRegion);
  params.set("filters[$and][0][$or][1][regions][id][$null]", "true");

  const res = await fetch(`${CMS_URL}/api/shows?${params.toString()}`, {
    headers: { Authorization: `Bearer ${CMS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`Strapi error ${res.status}`);

  const { data } = await res.json();

  return (data || []).map((entry) => {
    const a = entry?.attributes ?? entry ?? {};

    const artists = Array.isArray(a?.artists)
      ? a.artists
          .map((ar) => ar?.name)
          .filter(Boolean)
          .join(", ")
      : a.artist || "";

    const imageUrl = bestMediaUrl(a?.image);

    return {
      artist: artists || "",
      showName: a.showName || "",
      urlShow: a.urlShow || "",
      urlShowImage: imageUrl || "",
      date: a.date || "",
      place: {
        location: a?.place?.location || "",
        venue: a?.place?.venue || "",
      },
      canceled: !!a.canceled,
      priority: typeof a.priority === "number" ? a.priority : 0,
    };
  });
}
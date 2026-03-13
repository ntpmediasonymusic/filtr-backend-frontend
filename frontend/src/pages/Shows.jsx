import { useEffect, useMemo, useRef, useState } from "react";
import ShowCard from "../components/shows/ShowCard";
import ShowsHeader from "../components/shows/ShowsHeader";
import PageHeader from "../components/ui/PageHeader";
import { useRegion } from "../router/RegionContext";

import {
  fetchArtistEventsByName,
  fetchArtistInfoByName,
} from "../api/bandsintown";

import bitArtistsData from "../data/bitArtists.json";
import SearchIcon from "../assets/icons/SearchIcon";
import { IoClose, IoChevronBack, IoChevronForward } from "react-icons/io5";

const PAGE_SIZE = 20;
const PAGINATION_SCROLL_OFFSET = 200;

const REGION_COUNTRY_MAP = {
  cr: ["Costa Rica", "CR", "CRI"],
  do: [
    "República Dominicana",
    "Republica Dominicana",
    "Dominican Republic",
    "DO",
    "DOM",
  ],
  pa: ["Panama", "Panamá", "PA", "PAN"],
  gt: ["Guatemala", "GT", "GTM"],
  sv: ["El Salvador", "SV", "SLV"],
  us: [
    "United States",
    "United States of America",
    "USA",
    "US",
    "EEUU",
    "Estados Unidos",
  ],
};

const MONTH_NAMES_ES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

function normalizeText(s = "") {
  return String(s)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function eventMatchesRegion(ev, region) {
  if (!region) return false;
  const country = ev?.venue?.country;
  if (!country) return false;
  const candidates = REGION_COUNTRY_MAP[region] || [];
  const c = normalizeText(country);
  return candidates.some((x) => normalizeText(x) === c);
}

function formatDateForSearch(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return String(dt);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function monthNameForSearch(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return "";
  const month = MONTH_NAMES_ES[d.getMonth()] || "";
  if (month === "septiembre") return "septiembre setiembre";
  return month;
}

const Shows = () => {
  const { region } = useRegion();

  const [loading, setLoading] = useState(true);

  // rows: [{ ev, artistName, artistApiId, artistImageUrl, artistThumbUrl, artistBitUrl? }]
  const [rows, setRows] = useState([]);

  const [scopeMode, setScopeMode] = useState("nearby"); // nearby | all
  const [sortMode, setSortMode] = useState("closest"); // closest | farthest
  const [q, setQ] = useState("");
  const [artistFilter, setArtistFilter] = useState("all");
  const [page, setPage] = useState(1);

  const gridRef = useRef(null);
  const hasMountedPageRef = useRef(false);

  const artistList = useMemo(() => {
    return (bitArtistsData?.bitArtists?.[0] || []).filter(Boolean);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setPage(1);

      try {
        const results = await Promise.allSettled(
          artistList.map(async (a) => {
            const [events, artistInfo] = await Promise.all([
              fetchArtistEventsByName(a.name, a.artistApiId, {
                date: "upcoming",
              }),
              fetchArtistInfoByName(a.name, a.artistApiId),
            ]);

            const artistImageUrl = artistInfo?.image_url || "";
            const artistThumbUrl = artistInfo?.thumb_url || "";

            return events.map((ev) => ({
              ev,
              artistName: a.name,
              artistApiId: a.artistApiId,
              artistBitUrl: a.artistBitUrl || "",
              artistImageUrl,
              artistThumbUrl,
            }));
          }),
        );

        const flat = results.flatMap((r) =>
          r.status === "fulfilled" ? r.value : [],
        );

        flat.sort(
          (a, b) =>
            new Date(a.ev.datetime).getTime() -
            new Date(b.ev.datetime).getTime(),
        );

        if (!cancelled) setRows(flat);
      } catch {
        if (!cancelled) setRows([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [artistList]);

  const artistOptions = useMemo(() => {
    const names = artistList.map((a) => a.name).filter(Boolean);
    return Array.from(new Set(names)).sort((a, b) => a.localeCompare(b));
  }, [artistList]);

  const filteredRows = useMemo(() => {
    const query = normalizeText(q.trim());
    let list = rows;

    if (artistFilter !== "all") {
      list = list.filter((r) => r.artistName === artistFilter);
    }

    if (query) {
      list = list.filter(({ ev, artistName }) => {
        const city = ev?.venue?.city || "";
        const country = ev?.venue?.country || "";
        const dateStr = formatDateForSearch(ev?.datetime);
        const monthStr = monthNameForSearch(ev?.datetime);

        const haystack = normalizeText(
          `${artistName} ${city} ${country} ${dateStr} ${monthStr}`,
        );

        return haystack.includes(query);
      });
    }

    const inRegion = [];
    const outRegion = [];

    for (const item of list) {
      (eventMatchesRegion(item.ev, region) ? inRegion : outRegion).push(item);
    }

    const sorter =
      sortMode === "farthest"
        ? (a, b) =>
            new Date(b.ev.datetime).getTime() -
            new Date(a.ev.datetime).getTime()
        : (a, b) =>
            new Date(a.ev.datetime).getTime() -
            new Date(b.ev.datetime).getTime();

    inRegion.sort(sorter);
    outRegion.sort(sorter);

    if (scopeMode === "nearby") {
      return inRegion;
    }

    return [...inRegion, ...outRegion];
  }, [rows, q, artistFilter, region, sortMode, scopeMode]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  }, [filteredRows.length]);

  const pagedRows = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredRows.slice(start, start + PAGE_SIZE);
  }, [filteredRows, page]);

  useEffect(() => {
    setPage(1);
  }, [q, artistFilter, sortMode, scopeMode, region]);

  // Scroll al inicio del grid al cambiar de página (excepto primer render)
  useEffect(() => {
    if (!hasMountedPageRef.current) {
      hasMountedPageRef.current = true;
      return;
    }

    if (gridRef.current) {
      const gridTop =
        gridRef.current.getBoundingClientRect().top + window.pageYOffset;
      const targetTop = Math.max(0, gridTop - PAGINATION_SCROLL_OFFSET);

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });
    }
  }, [page]);

  // Al cargar Shows: ir al tope de la página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"¡Lo que está por sonar en VIVO!"} />
      </div>

      <div className="px-6">
        <ShowsHeader />
      </div>

      <div className="px-6 mt-6 flex flex-col gap-3">
        <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-wrap gap-0">
              {/* Toggle alcance */}
              <button
                className={`text-xs sm:text-sm md:text-base rounded-l-xl border border-white/10 px-3 py-2 ${
                  scopeMode === "nearby"
                    ? "bg-[#19A74E] text-white"
                    : "bg-[#19A74E]/20 text-white/50 hover:bg-[#19A74E]/30"
                }`}
                onClick={() => setScopeMode("nearby")}
              >
                Cerca de mí
              </button>
              <button
                className={`text-xs sm:text-sm md:text-base border rounded-r-xl border-white/10 px-3 py-2 ${
                  scopeMode === "all"
                    ? "bg-[#19A74E] text-white"
                    : "bg-[#19A74E]/20 text-white/50 hover:bg-[#19A74E]/30"
                }`}
                onClick={() => setScopeMode("all")}
              >
                Todos los eventos
              </button>
            </div>
            <div className="flex flex-wrap gap-0">
              {/* Toggle orden */}
              <button
                className={`text-xs sm:text-sm md:text-base rounded-l-xl border border-white/10 px-3 py-2 ${
                  sortMode === "closest"
                    ? "bg-[#5C0F8B] text-white"
                    : "bg-[#5C0F8B]/30 text-white/40 hover:bg-[#5C0F8B]/40"
                }`}
                onClick={() => setSortMode("closest")}
              >
                Más próximos
              </button>
              <button
                className={`text-xs sm:text-sm md:text-base rounded-r-xl border border-white/10 px-3 py-2 ${
                  sortMode === "farthest"
                    ? "bg-[#5C0F8B] text-white"
                    : "bg-[#5C0F8B]/30 text-white/40 hover:bg-[#5C0F8B]/40"
                }`}
                onClick={() => setSortMode("farthest")}
              >
                Más lejanos
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs sm:text-sm md:text-base text-white/70">
              Artista:
            </label>
            <select
              value={artistFilter}
              onChange={(e) => setArtistFilter(e.target.value)}
              className="text-xs sm:text-sm md:text-base rounded-xl bg-[#CFDD28] text-black/80 px-3 py-2"
            >
              <option value="all">Todos</option>
              {artistOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0 flex items-center bg-[#131517] rounded-full px-2 sm:px-4 py-2 gap-1 sm:gap-2 border-2 border-[#19A74E] w-full sm:w-100">
            <SearchIcon className="text-[#19A74E] w-full max-w-6 min-w-3" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por artista, ciudad, país, fecha o mes"
              className="flex-1 min-w-0 truncate bg-transparent focus:outline-none text-white placeholder:text-gray-400 text-xs sm:text-sm md:text-base"
            />
          </div>

          {q ? (
            <button
              onClick={() => setQ("")}
              className="rounded-full border border-[#19A74E] bg-[#19A74E] px-3 py-3 text-xl hover:bg-[#19A74E]/80 transition"
              aria-label="Limpiar búsqueda"
            >
              <IoClose />
            </button>
          ) : null}
        </div>

        <div className="text-xs sm:text-sm md:text-base rounded-xl text-white/60">
          Mostrando {filteredRows.length} eventos · Región prioritaria:{" "}
          <span className="uppercase">{region || "—"}</span>
        </div>

        {/* Logo Bandsintown */}
        <div className="flex justify-center md:justify-end mt-1">
          <img
            src="/assets/images/bandsintown_logo.png"
            alt="Bandsintown"
            className="h-6 sm:h-7 md:h-8 w-auto object-contain"
            loading="lazy"
          />
        </div>
      </div>

      <div
        ref={gridRef}
        className="grid px-6 xl:px-6 justify-items-center grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-x-[14px] xl:gap-x-[24px] gap-y-[30px] my-8 md:my-10"
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={`skeleton-${i}`}
                className="w-full xl:w-[360px] h-[260px] bg-[#262627] rounded-lg p-4 animate-pulse"
              >
                <div className="w-full h-full bg-gray-700 rounded" />
              </div>
            ))
          : pagedRows.map(
              ({
                ev,
                artistName,
                artistApiId,
                artistBitUrl,
                artistImageUrl,
                artistThumbUrl,
              }) => (
                <ShowCard
                  key={`${artistName}-${ev.id}`}
                  bitEvent={ev}
                  artistName={artistName}
                  artistApiId={artistApiId}
                  artistBitUrl={artistBitUrl}
                  artistImageUrl={artistImageUrl}
                  artistThumbUrl={artistThumbUrl}
                />
              ),
            )}
      </div>

      {!loading && filteredRows.length <= 0 && (
        <p className="text-gray-500 text-sm md:text-2xl sm:text-lg text-center pb-20 md:pb-20">
          No hay shows disponibles.
        </p>
      )}

      {!loading && filteredRows.length > 0 && (
        <div className="px-6 pb-16 flex items-center justify-center gap-3">
          <button
            className="rounded-xl border bg-[#00DAF0] text-black px-4 py-2 text-sm disabled:opacity-40"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            aria-label="Página anterior"
          >
            <IoChevronBack />
          </button>

          <span className="text-sm text-white/70">
            Página {page} de {totalPages}
          </span>

          <button
            className="rounded-xl border bg-[#00DAF0] text-black px-4 py-2 text-sm disabled:opacity-40"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            aria-label="Página siguiente"
          >
            <IoChevronForward />
          </button>
        </div>
      )}
    </>
  );
};

export default Shows;

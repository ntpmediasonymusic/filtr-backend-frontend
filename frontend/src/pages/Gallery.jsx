import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import LoginModal from "../components/ui/modal/LoginModal";
import GalleryBanner from "../components/gallery/GalleryBanner";
import GalleryFilters from "../components/gallery/GalleryFilters";
import EventGrid from "../components/gallery/EventGrid";
import MerchEmptyState from "../components/merch/MerchEmptyState";
import { useRegion } from "../router/RegionContext";
import { useGTM } from "../context/useGTM";
import { getAuthSession } from "../utils/auth";
import { setPostAuthRedirect } from "../utils/postAuthRedirect";
import {
  getAllEvents,
  getGalleryFilterOptions,
  filterGalleryEvents,
  GALLERY_REQUIRE_AUTH,
} from "../utils/gallery";

const PAGE_SIZE = 9;
const DEFAULT_FILTERS = {
  search: "",
  eventType: "all",
  country: "all",
  artist: "all",
  year: "all",
};

const Gallery = () => {
  const { region } = useRegion();
  const navigate = useNavigate();
  const { trackEvent } = useGTM();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const events = useMemo(() => getAllEvents(), []);
  const filterOptions = useMemo(() => getGalleryFilterOptions(events), [events]);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loginRedirect, setLoginRedirect] = useState(null);

  const filteredEvents = useMemo(
    () => filterGalleryEvents(events, filters),
    [events, filters],
  );

  // Cambiar cualquier filtro reinicia la paginación incremental.
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filters]);

  const visibleEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = filteredEvents.length > visibleCount;

  const hasActiveFilters =
    filters.search.trim() !== "" ||
    filters.eventType !== "all" ||
    filters.country !== "all" ||
    filters.artist !== "all" ||
    filters.year !== "all";

  const updateFilter = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(DEFAULT_FILTERS);

  const handleSelectEvent = (event) => {
    const target = `/${region}/galeria/${event.slug}`;
    trackEvent("gallery_event_select", { event_slug: event.slug });

    if (!GALLERY_REQUIRE_AUTH) {
      navigate(target);
      return;
    }

    const session = getAuthSession();

    if (session.authenticated) {
      navigate(target);
      return;
    }

    setPostAuthRedirect(target);
    trackEvent("gallery_auth_prompt", { event_slug: event.slug });
    setLoginRedirect(target);
  };

  return (
    <>
      <Helmet>
        <meta
          name="description"
          content="Revive en fotos y videos los eventos, listening parties y experiencias exclusivas de SomosFiltr."
        />
      </Helmet>

      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg="Galería" />
      </div>

      <div className="px-6">
        <GalleryBanner
          slides={[
            {
              id: "galeria-intro",
              eyebrow: "Revive los mejores momentos",
              title: "Galería",
              description:
                "Explora las fotos y videos de nuestros eventos, conciertos y experiencias exclusivas.",
              // backgroundImage: aún no hay portada definitiva del banner;
              // cuando exista, basta con setear esta propiedad.
              backgroundImage: undefined,
            },
          ]}
        />
      </div>

      <div className="px-6 mt-6 flex flex-col gap-6 py-14.5 md:py-14.5">
        <GalleryFilters
          search={filters.search}
          onSearchChange={(v) => updateFilter("search", v)}
          eventTypeOptions={filterOptions.eventTypes}
          eventType={filters.eventType}
          onEventTypeChange={(v) => updateFilter("eventType", v)}
          countryOptions={filterOptions.countries}
          country={filters.country}
          onCountryChange={(v) => updateFilter("country", v)}
          artistOptions={filterOptions.artists}
          artist={filters.artist}
          onArtistChange={(v) => updateFilter("artist", v)}
          yearOptions={filterOptions.years}
          year={filters.year}
          onYearChange={(v) => updateFilter("year", v)}
          hasActiveFilters={hasActiveFilters}
          onClear={clearFilters}
        />

        {visibleEvents.length === 0 ? (
          <MerchEmptyState
            message={
              events.length === 0
                ? "Todavía no hay eventos disponibles en Galería."
                : "No se encontraron eventos con los filtros seleccionados."
            }
            actionLabel={hasActiveFilters ? "Limpiar filtros" : undefined}
            onAction={hasActiveFilters ? clearFilters : undefined}
          />
        ) : (
          <EventGrid events={visibleEvents} onSelect={handleSelectEvent} />
        )}

        {hasMore && (
          <div className="flex justify-center pb-10">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="rounded-xl border border-[#00DAF0] text-[#00DAF0] px-6 py-2.5 text-sm font-semibold hover:bg-[#00DAF0]/10 transition cursor-pointer"
            >
              Ver más eventos
            </button>
          </div>
        )}
      </div>

      {loginRedirect && (
        <LoginModal
          onClose={() => setLoginRedirect(null)}
          message="Para ver esta galería primero debes iniciar sesión"
          redirectTo={loginRedirect}
        />
      )}
    </>
  );
};

export default Gallery;

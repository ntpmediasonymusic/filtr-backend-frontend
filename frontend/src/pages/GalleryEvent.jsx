import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import LoginModal from "../components/ui/modal/LoginModal";
import RegionLink from "../router/RegionLink";
import GalleryBanner from "../components/gallery/GalleryBanner";
import { getStatusMeta } from "../components/gallery/galleryPresentation";
import MediaFilters from "../components/gallery/MediaFilters";
import MediaGrid from "../components/gallery/MediaGrid";
import GalleryPagination from "../components/gallery/GalleryPagination";
import MediaLightbox from "../components/gallery/MediaLightbox";
import { useRegion } from "../router/RegionContext";
import { useGTM } from "../context/useGTM";
import { getAuthSession } from "../utils/auth";
import { setPostAuthRedirect } from "../utils/postAuthRedirect";
import {
  findEventBySlug,
  filterMediaByType,
  formatEventDate,
  buildMediaShareUrl,
  toAbsoluteUrl,
  GALLERY_REQUIRE_AUTH,
} from "../utils/gallery";

const MEDIA_PAGE_SIZE = 12;

const GalleryEvent = () => {
  const { slug } = useParams();
  const { region } = useRegion();
  const { trackEvent } = useGTM();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // La sesion se evalua una sola vez al montar: evita mostrar la galeria
  // aunque sea brevemente mientras se decide si hay sesion valida.
  const [session] = useState(() => getAuthSession());
  // GALLERY_REQUIRE_AUTH en false = gate de sesion desactivado temporalmente.
  const authorized = !GALLERY_REQUIRE_AUTH || session.authenticated;
  const event = useMemo(() => findEventBySlug(slug), [slug]);

  const [mediaTypeFilter, setMediaTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [openMediaId, setOpenMediaId] = useState(() => searchParams.get("media"));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Guarda la ruta actual (incluye ?media=) para volver aqui tras login/signup.
  useEffect(() => {
    if (GALLERY_REQUIRE_AUTH && !session.authenticated) {
      setPostAuthRedirect(location.pathname + location.search);
      trackEvent("gallery_auth_prompt", { event_slug: slug, expired: session.expired });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const backToCatalog = () => navigate(`/${region}/galeria`, { replace: true });

  const filteredMedia = useMemo(
    () => filterMediaByType(event?.gallery || [], mediaTypeFilter),
    [event, mediaTypeFilter],
  );

  const mediaCounts = useMemo(() => {
    const gallery = event?.gallery || [];
    return {
      all: gallery.length,
      image: gallery.filter((m) => m.type === "image").length,
      video: gallery.filter((m) => m.type === "video").length,
    };
  }, [event]);

  // Cambiar el filtro de medios reinicia la pagina del grid.
  useEffect(() => {
    setPage(1);
  }, [mediaTypeFilter]);

  // Si la pieza abierta deja de pertenecer al conjunto filtrado (o el id de
  // la URL no existe), se limpia sin romper la pagina.
  useEffect(() => {
    if (!openMediaId) return;
    const stillVisible = filteredMedia.some((m) => m.id === openMediaId);
    if (!stillVisible) setOpenMediaId(null);
  }, [filteredMedia, openMediaId]);

  // Mantiene ?media= sincronizado con el lightbox (reemplaza, no apila historial).
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (openMediaId) next.set("media", openMediaId);
    else next.delete("media");
    if (next.toString() !== searchParams.toString()) {
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openMediaId]);

  const totalMediaPages = Math.max(
    1,
    Math.ceil(filteredMedia.length / MEDIA_PAGE_SIZE),
  );
  const pagedMedia = filteredMedia.slice(
    (page - 1) * MEDIA_PAGE_SIZE,
    page * MEDIA_PAGE_SIZE,
  );

  const lightboxIndex = openMediaId
    ? filteredMedia.findIndex((m) => m.id === openMediaId)
    : -1;
  const lightboxOpen = lightboxIndex !== -1;

  const handleOpenMedia = (item) => {
    setOpenMediaId(item.id);
    trackEvent("gallery_media_open", { event_slug: slug, media_id: item.id });
  };

  const handlePageChange = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!authorized) {
    return (
      <>
        <div className="px-6 py-10 md:py-10">
          <PageHeader welcomeMsg="Galería" />
        </div>
        <LoginModal
          onClose={backToCatalog}
          message={
            session.expired
              ? "Tu sesión expiró. Inicia sesión de nuevo para ver esta galería."
              : "Para ver esta galería primero debes iniciar sesión"
          }
          redirectTo={location.pathname + location.search}
        />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <div className="px-6 py-10 md:py-10">
          <PageHeader welcomeMsg="Galería" />
        </div>
        <div className="flex flex-col items-center justify-center gap-4 px-6 py-24 text-center">
          <h1 className="text-white text-2xl md:text-3xl font-bold">
            No encontramos esta galería
          </h1>
          <p className="text-white/70 max-w-md">
            El evento que buscas no existe o ya no está disponible.
          </p>
          <RegionLink
            to="/galeria"
            className="mt-2 py-2.5 px-6 bg-[#CA249C] text-white font-semibold rounded-lg hover:opacity-90 transition text-sm sm:text-base"
          >
            Volver a Galería
          </RegionLink>
        </div>
      </>
    );
  }

  const statusMeta = getStatusMeta(event.status);
  const shareUrlForItem = (item) =>
    buildMediaShareUrl({ region, slug: event.slug, mediaId: item.id });

  return (
    <>
      <Helmet>
        <title>{event.seo?.title || `${event.title} | Filtr`}</title>
        <meta
          name="description"
          content={event.seo?.description || event.description}
        />
        <meta property="og:title" content={event.seo?.title || event.title} />
        <meta
          property="og:description"
          content={event.seo?.description || event.description}
        />
        <meta
          property="og:image"
          content={toAbsoluteUrl(event.seo?.image || event.cover?.source)}
        />
        <meta name="twitter:title" content={event.seo?.title || event.title} />
        <meta
          name="twitter:description"
          content={event.seo?.description || event.description}
        />
        <meta
          name="twitter:image"
          content={toAbsoluteUrl(event.seo?.image || event.cover?.source)}
        />
      </Helmet>

      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={event.title} />
      </div>

      <div className="px-6">
        <GalleryBanner
          slides={[
            {
              id: event.id,
              eyebrow: event.eventType,
              title: event.title,
              description: event.description,
              backgroundImage: undefined,
              meta: [
                ...(statusMeta ? [statusMeta] : []),
                {
                  label: `${event.city}, ${event.country}`,
                  className: "bg-white/15 text-white",
                },
                {
                  label: formatEventDate(event.date),
                  className: "bg-white/15 text-white",
                },
              ],
            },
          ]}
        />
      </div>

      <div className="px-6 mt-6 flex flex-col gap-6 pb-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <MediaFilters
            value={mediaTypeFilter}
            onChange={setMediaTypeFilter}
            counts={mediaCounts}
          />
          <span className="text-xs sm:text-sm text-white/60">
            Mostrando {filteredMedia.length} elementos
          </span>
        </div>

        {filteredMedia.length === 0 ? (
          <p className="text-gray-500 text-sm md:text-lg text-center py-16">
            No hay contenido disponible para este filtro.
          </p>
        ) : (
          <>
            <MediaGrid items={pagedMedia} onOpen={(idx) => handleOpenMedia(pagedMedia[idx])} />
            <GalleryPagination
              page={page}
              totalPages={totalMediaPages}
              onPrev={() => handlePageChange(Math.max(1, page - 1))}
              onNext={() => handlePageChange(Math.min(totalMediaPages, page + 1))}
            />
          </>
        )}
      </div>

      {lightboxOpen && (
        <MediaLightbox
          items={filteredMedia}
          index={lightboxIndex}
          onClose={() => setOpenMediaId(null)}
          onIndexChange={(idx) => setOpenMediaId(filteredMedia[idx]?.id || null)}
          event={event}
          shareUrl={shareUrlForItem(filteredMedia[lightboxIndex])}
          onShare={(channel) =>
            trackEvent("gallery_media_share", {
              event_slug: slug,
              media_id: openMediaId,
              channel,
            })
          }
          onDownload={(item) =>
            trackEvent("gallery_media_download", {
              event_slug: slug,
              media_id: item.id,
            })
          }
        />
      )}
    </>
  );
};

export default GalleryEvent;

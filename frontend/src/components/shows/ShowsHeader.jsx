/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRegion } from "../../router/RegionContext";
import { fetchBanners } from "../../api/fetchStrapiCMS";

const ShowsHeader = () => {
  const { region } = useRegion();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Normaliza: si falta una imagen usa la otra; si faltan ambas, se omite
  const normalize = (raw = []) =>
    raw
      .map((it) => {
        const desktop = it?.desktop || it?.mobile || "";
        const mobile = it?.mobile || it?.desktop || "";
        if (!desktop && !mobile) return null; // nada que mostrar
        return {
          desktop,
          mobile,
          alt: it?.alt ?? "",
          link: it?.link || "",
        };
      })
      .filter(Boolean);

  useEffect(() => {
    let cancel = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchBanners(region, "shows_header");
        if (!cancel) setItems(normalize(data));
      } catch (e) {
        console.error("ShowsHeader CMS error:", e);
        if (!cancel) setItems([]);
      } finally {
        if (!cancel) setLoading(false);
      }
    })();
    return () => {
      cancel = true;
    };
  }, [region]);

  const PrevArrow = () => (
    <svg
      viewBox="0 0 44 44"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <rect width="44" height="44" rx="22" fill="#252733" />
        <path
          d="M29 22H15M15 22L22 29M15 22L22 15"
          stroke="#E1E1E2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  const NextArrow = () => (
    <svg
      viewBox="0 0 44 44"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8">
        <rect width="44" height="44" rx="22" fill="#252733" />
        <path
          d="M15 22H29M29 22L22 15M29 22L22 29"
          stroke="#E1E1E2"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );

  // Skeleton mientras cargamos la primera vez
  if (loading) {
    return (
      <div className="relative">
        <div className="relative w-full overflow-hidden rounded-[10px] bg-gray-700 before:block before:pt-[26.5%] md:before:pt-[20%]">
          <div className="absolute inset-0 animate-pulse bg-gray-600" />
        </div>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <Carousel
      showArrows
      showIndicators
      infiniteLoop
      autoPlay
      interval={5000}
      showThumbs={false}
      showStatus={false}
      swipeable
      emulateTouch
      dynamicHeight={false}
      renderArrowPrev={(onClick, hasPrev) =>
        hasPrev && (
          <button
            onClick={onClick}
            className="absolute z-12 left-1 top-1/2 transform -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-8 h-8 md:w-16 md:h-16"
            aria-label="Anterior"
          >
            <PrevArrow />
          </button>
        )
      }
      renderArrowNext={(onClick, hasNext) =>
        hasNext && (
          <button
            onClick={onClick}
            className="absolute z-12 right-1 top-1/2 transform -translate-y-1/2 p-0.5 md:p-2 rounded-full hover:opacity-80 w-8 h-8 md:w-16 md:h-16"
            aria-label="Siguiente"
          >
            <NextArrow />
          </button>
        )
      }
    >
      {items.map(({ desktop, mobile, alt, link }, idx) => {
        const slide = (
          <ShowHeaderImage
            key={idx}
            desktop={desktop}
            mobile={mobile}
            alt={alt}
          />
        );
        return (
          <div key={idx} className="flex items-center justify-center w-full">
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                {slide}
              </a>
            ) : (
              slide
            )}
          </div>
        );
      })}
    </Carousel>
  );
};

function ShowHeaderImage({ desktop = "", mobile = "", alt = "" }) {
  const [loaded, setLoaded] = useState(false);

  const desktopSrc = desktop || mobile || "";
  const mobileSrc = mobile || desktop || "";
  const hasAny = Boolean(desktopSrc || mobileSrc);

  // Si no hay ninguna imagen, placeholder vacío
  if (!hasAny) {
    return (
      <div
        className="
          relative w-full overflow-hidden rounded-[10px] bg-gray-700
          before:block before:pt-[26.5%] md:before:pt-[20%]
        "
      >
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      </div>
    );
  }

  return (
    <div
      className="
        relative w-full overflow-hidden rounded-[10px] bg-gray-700
        before:block before:pt-[26.5%] md:before:pt-[20%]
      "
    >
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-gray-600" />
      )}
      <picture className="absolute inset-0 w-full h-full">
        <source media="(min-width:768px)" srcSet={desktopSrc} />
        <img
          src={mobileSrc}
          alt={alt}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      </picture>
    </div>
  );
}

export default ShowsHeader;

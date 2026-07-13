/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";

export default function MerchProductCard({ product }) {
  const [imgIndex, setImgIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const images = product.images ?? [];
  const hasMultiple = images.length > 1;
  const activeImage = images[imgIndex] ?? images[0];
  const outOfStock = product.status === "out_of_stock" || product.quantity <= 0;

  // Precarga la segunda imagen para que el hover no parpadee
  const secondImageSrc = product.images?.[1]?.src;
  useEffect(() => {
    if (!secondImageSrc) return;
    const preload = new window.Image();
    preload.src = secondImageSrc;
  }, [secondImageSrc]);

  const handleMouseEnter = () => {
    if (hasMultiple) setImgIndex(1);
  };
  const handleMouseLeave = () => {
    if (hasMultiple) setImgIndex(0);
  };

  return (
    <a
      href={product.purchaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex flex-col w-full max-w-[260px] bg-[#282534] rounded-lg p-3 gap-2.5 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#00DAF0] ${
        outOfStock ? "opacity-70" : ""
      }`}
    >
      <div
        className="relative w-full before:block before:pt-[100%] rounded-lg overflow-hidden bg-gray-700"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!loaded && <div className="absolute inset-0 animate-pulse bg-gray-600" />}
        {activeImage && (
          <img
            src={activeImage.src}
            alt={activeImage.alt || product.title}
            onLoad={() => setLoaded(true)}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        {outOfStock && (
          <span className="absolute top-2 left-2 bg-black/80 text-white text-[11px] font-semibold uppercase tracking-wide px-2 py-1 rounded">
            Agotado
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h6 className="text-white text-sm md:text-base line-clamp-2 min-h-[2.5rem]">
          {product.title}
        </h6>
        <span className="text-gray-400 text-sm">
          ${product.price.toFixed(2)} {product.currency}
        </span>
      </div>
    </a>
  );
}

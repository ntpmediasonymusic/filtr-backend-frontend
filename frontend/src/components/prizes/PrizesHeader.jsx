import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const PrizesHeader = () => {
  const imageMap = [
    {
      desktop:
        "/assets/images/prizes-banner-header/desktop/prizes-banner-header-desktop-1.png",
      mobile:
        "/assets/images/prizes-banner-header/mobile/prizes-banner-header-mobile-1.png",
      alt: "Shows Banner 1",
    },
    {
      desktop:
        "/assets/images/prizes-banner-header/desktop/prizes-banner-header-desktop-2.png",
      mobile:
        "/assets/images/prizes-banner-header/mobile/prizes-banner-header-mobile-2.png",
      alt: "Shows Banner 2",
    },
  ];

  return (
    <Carousel
      showArrows
      showIndicators
      infiniteLoop
      autoPlay
      interval={4000}
      showThumbs={false}
      showStatus={false}
      swipeable
      emulateTouch
    >
      {imageMap.map(({ desktop, mobile, alt, link }, idx) => {
        const content = (
          <picture className="w-full">
            <source media="(min-width:768px)" srcSet={desktop} />
            <img
              src={mobile}
              alt={alt}
              className="w-full object-cover object-center max-h-[600px] rounded-[10px]"
            />
          </picture>
        );
        return (
          <div key={idx} className="flex items-center justify-center">
            {link ? (
              <a href={link} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              content
            )}
          </div>
        );
      })}
    </Carousel>
  );
};

export default PrizesHeader;

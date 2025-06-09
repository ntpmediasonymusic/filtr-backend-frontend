
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerSlide1 from "../../assets/images/banner-shows-1.png";

const ShowsHeader = () => {
  return (
    <Carousel
      showArrows={true}
      showIndicators={true}
      infiniteLoop={true}
      autoPlay={true}
      interval={4000}
      showThumbs={false}
      showStatus={false}
      swipeable={true}
      emulateTouch={true}
      dynamicHeight={true}
    >
      {/* Slide 1 */}
      <div className="flex flex-col items-center justify-center">
        <img
          src={bannerSlide1}
          alt="Banner Hero 1"
          className="w-full object-cover object-center max-h-[600px]"
        />
      </div>
    </Carousel>
  );
};

export default ShowsHeader;

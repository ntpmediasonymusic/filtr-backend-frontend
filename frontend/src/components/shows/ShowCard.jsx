/* eslint-disable react/prop-types */
import MapMarker from "../../assets/icons/MapMarker";
// import MarketCartIcon from "../../assets/icons/MarketCartIcon";
import useFormattedDate from "../../hooks/shows/useFormattedDate";

const ShowCard = ({ artist, showName, urlShow, urlShowImage, date, place }) => {
  return (
    <div className="flex flex-col xl:flex-row w-[100%] xl:w-[512px] h-[100%] xl:h-[251px] bg-[#262627] rounded-lg p-4 gap-5">
      {/* Show Image */}
      <div className="w-[100%] xl:w-[225px] h-[225px] flex-shrink-0 rounded-md overflow-hidden">
        <a href={urlShow} target="_blank" rel="noopener noreferrer">
          <img
            src={urlShowImage}
            alt={showName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </a>
      </div>

      {/* Show Info */}
      <div className="flex flex-col justify-center gap-6 w-full">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <MapMarker className="mt-[2px]" />
            <div className="flex xl:flex-col text-white text-sm leading-tight">
              <span>{place.location}</span>
              <span className="ml-1 xl:ml-0">{place.venue}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 xl:ml-8">
          <h2 className="xl:text-[28px] font-black text-white leading-tight">
            {useFormattedDate(date)}
          </h2>
          <h2 className="xl:text-[26px] font-medium text-white leading-tight line-clamp-1">
            {artist}
          </h2>
        </div>

        {/* <a
          href={urlShow}
          className="group text-[#00DAF0] hover:text-[#7cf3ff] transition xl:ml-8"
        >
          <div className="flex items-center gap-3">
            <MarketCartIcon className="w-[21px] h-[22px] text-current" />
            <span className="text-sm">Dónde comprar</span>
          </div>
        </a> */}
      </div>
    </div>
  );
};

export default ShowCard;

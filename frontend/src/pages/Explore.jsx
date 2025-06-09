import GenresList from "../components/explore/GenresList";
import MoodsList from "../components/explore/MoodsList";
import QuizzesPreview from "../components/explore/QuizzesPreview";
import ShowsPreview from "../components/explore/ShowsPreview";
import PlaylistsIframePreview from "../components/explore/PlaylistsIframePreview";

const Explore = () => {
  return (
    <div className="flex flex-col gap-[50px] md:gap-[100px] px-6 py-[50px] md:py-[50px]">
      <div className="flex flex-col lg:flex-row w-full gap-[50px] md:gap-[100px] lg:gap-[24px]">
        <div className="flex flex-col md:flex-row w-full lg:w-3/5 gap-[50px] md:gap-[24px]">
          {/* Géneros */}
          <div className="md:w-1/2 lg:w-5/10 w-full">
            <GenresList />
          </div>

          {/* Moods */}
          <div className="md:w-1/2 lg:w-5/10 w-full">
            <MoodsList />
          </div>
        </div>

        {/* Quizzes*/}
        <div className="md:w-full lg:w-6/10 w-full">
          <QuizzesPreview />
        </div>
      </div>

      <div className="w-full">
        <ShowsPreview />
      </div>

      <div className="w-full">
        <PlaylistsIframePreview />
      </div>
    </div>
  );
};

export default Explore;

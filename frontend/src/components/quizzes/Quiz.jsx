/* eslint-disable react/prop-types */
const Quiz = ({
  QuizName,
  urlQuiz,
  urlQuizImage,
  description,
  artists,
  releases,
}) => {
  return (
    <div className="bg-[#1f1f1f] rounded-lg shadow-lg overflow-hidden p-6 md:p-12">
      {/* Quiz Banner */}
      <a href={urlQuiz} target="_blank" rel="noopener noreferrer">
        <div
          className="w-full bg-contain bg-center bg-no-repeat mb-4"
          style={{ backgroundImage: `url(${urlQuizImage})` }}
        >
          <img
            src={urlQuizImage}
            alt={QuizName}
            className="w-full h-auto object-contain bg-no-repeat"
          />
        </div>
      </a>

      {/* Quiz Info */}
      <div className="">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm md:text-2xl sm:text-lg font-bold bg-gradient-to-r from-violet-600 via-pink-600 to-yellow-600 bg-clip-text text-transparent">
            {QuizName}
          </h2>
          <a href={urlQuiz} target="_blank" rel="noopener noreferrer">
            <button className="px-2 md:px-4 py-1 md:py-2 text-xs md:text-lg sm:text-sm bg-[#f8cd28] text-black font-bold rounded-lg hover:bg-[#ffeda8] transition whitespace-nowrap cursor-pointer">
              Realizar Quiz
            </button>
          </a>
        </div>
        <p className="text-sm md:text-lg font-bold text-white">{description}</p>
      </div>

      {/* Artists and Releases */}
      <div className="flex flex-col md:flex-row gap-6 mt-2">
        {/* Artists Section (Se oculta si está vacío) */}
        {artists.length > 0 && (
          <div className="flex-1">
            <h3 className=" mb-2 text-xs md:text-lg sm:text-sm font-bold bg-gradient-to-r from-yellow-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
              {artists.length === 1 ? "Artista" : "Artistas"}
            </h3>
            <div className="flex flex-col space-y-4">
              {artists.map((artist) => (
                <div key={artist.name} className="flex items-center gap-4">
                  <img
                    src={artist.urlProfileImage}
                    alt={artist.name}
                    className="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover"
                  />
                  <a
                    href={artist.urlSpotifyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="text-sm md:text-base text-white hover:text-[#f8cd28] transition">
                      {artist.name}
                    </span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Releases Section (Se oculta si está vacío) */}
        {releases.length > 0 && (
          <div className="flex-1">
            <h3 className=" mb-2 text-xs md:text-lg sm:text-sm font-bold bg-gradient-to-r from-yellow-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
              {releases.length === 1 ? "Lanzamiento" : "Lanzamientos"}
            </h3>
            <div className="flex space-x-4 overflow-x-auto">
              {releases.map((release) => (
                <div
                  key={release.name}
                  className="flex-shrink-0 w-30 md:w-40 sm:w-40"
                >
                  <a
                    href={release.urlSpotifyProfile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative group"
                  >
                    <img
                      src={release.urlCoverImage}
                      alt={release.name}
                      className="w-full h-auto rounded-lg"
                    />
                    {/* Ícono de Play (solo efecto visual) */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="white"
                        viewBox="0 0 24 24"
                        className="w-12 md:w-22 sm:w-22"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </a>
                  <p className="text-xs md:text-sm mt-1 text-white">
                    {release.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;

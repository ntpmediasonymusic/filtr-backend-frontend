import { NavLink } from "react-router-dom";
import { useMoods } from "../../hooks/playlists/useMoods";

const MoodsList = () => {
  const moods = useMoods();

  return (
    <>
      <h2 className="pb-3 text-xl md:text-2xl font-bold bg-gradient-to-r from-pink-600 via-yellow-600 to-violet-600 bg-clip-text text-transparent">
        Moods
      </h2>
      <ul className="space-y-3 w-fit">
        {moods.map((mood) => (
          <li
            key={mood}
            className="text-white transition duration-100 hover:text-[#f8cd28] hover:cursor-pointer"
          >
            <NavLink
              to={`/moods?title=${encodeURIComponent(mood)}`}
              className="w-fit"
            >
              {mood}
            </NavLink>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MoodsList;

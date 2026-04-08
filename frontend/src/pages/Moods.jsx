import { useEffect, useState } from "react";
import PlaylistsContainerGrid from "../components/ui/PlaylistsContainerGrid";
import { usePlaylists } from "../context/PlaylistContext";
import MoodsHeader from "../components/moods/MoodsHeader";
import PageHeader from "../components/ui/PageHeader";
import { useSearch } from "../context/SearchContext";
import Filter from "../components/filter/filter";
import MusicBanner from "../components/ui/MusicBanner";
import { fetchMoods } from "../api/fetchStrapiCMS";

const Moods = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { playlists } = usePlaylists();
  const { searchQuery } = useSearch();

  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchMoods();
        if (cancelled) return;
        const normalized = data.map((m) => ({
          name: m.name,
          desktopImage: m.desktop,
          mobileImage: m.mobile,
        }));
        setMoods(normalized);
        setSelectedMood(normalized[0] || null);
      } catch (e) {
        console.error("fetchMoods error:", e);
        if (!cancelled) {
          setMoods([]);
          setSelectedMood(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (searchQuery && searchQuery.trim() !== "") {
    return <Filter />;
  }

  const filteredPlaylists = selectedMood
    ? playlists.filter(
        (playlist) =>
          Array.isArray(playlist.moods) &&
          playlist.moods.some((mood) => mood === selectedMood.name),
      )
    : playlists;

  return (
    <>
      <div className="px-6 py-10 md:py-10">
        <PageHeader welcomeMsg={"¿Cuál es tu mood de hoy?"} />
      </div>

      <MusicBanner type="moods" />

      <div className="flex flex-col px-6 pb-[50px] md:pb-[50px] gap-[35px] md:gap-[80px]">
        <MoodsHeader
          loading={loading}
          moods={moods}
          selectedMood={selectedMood}
          setSelectedMood={setSelectedMood}
        />
        <PlaylistsContainerGrid currentPlaylists={filteredPlaylists} />
      </div>
    </>
  );
};

export default Moods;

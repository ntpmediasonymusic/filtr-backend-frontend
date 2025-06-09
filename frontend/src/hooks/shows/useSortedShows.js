import { useMemo } from "react";
import showsData from "../../data/shows.json";

export const useSortedShows = () => {
  const sortedShows = useMemo(() => {
    return [...showsData.shows].sort((a, b) => {
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateA - dateB; 
    });
  }, []);

  return sortedShows;
};

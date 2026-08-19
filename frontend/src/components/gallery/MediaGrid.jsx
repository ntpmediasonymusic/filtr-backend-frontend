/* eslint-disable react/prop-types */
import MediaCard from "./MediaCard";

export default function MediaGrid({ items, onOpen }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.map((item, idx) => (
        <MediaCard key={item.id} item={item} onOpen={() => onOpen(idx)} />
      ))}
    </div>
  );
}

/* eslint-disable react/prop-types */
import EventCard from "./EventCard";

export default function EventGrid({ events, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-5 gap-y-8">
      {events.map((event, index) => (
        <EventCard
          key={event.id}
          event={event}
          onSelect={onSelect}
          // Las primeras cards suelen quedar sobre el pliegue: cargarlas de
          // forma diferida (lazy) retrasaría el LCP para nada.
          priority={index < 3}
        />
      ))}
    </div>
  );
}

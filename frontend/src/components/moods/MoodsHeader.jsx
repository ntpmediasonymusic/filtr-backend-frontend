/* eslint-disable react/prop-types */
import { useRef, useEffect } from "react";

export default function MoodsHeader({
  moods,
  selectedMood,
  setSelectedMood,
  filter = false,
}) {
  const scrollContainerRef = useRef(null);

  // Manejar el drag del scroll en desktop
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      scrollContainer.classList.add("cursor-grabbing");
      startX = e.pageX - scrollContainer.offsetLeft;
      scrollLeft = scrollContainer.scrollLeft;
      e.preventDefault(); // Prevenir selección de texto
    };

    const handleMouseLeave = () => {
      isDown = false;
      scrollContainer.classList.remove("cursor-grabbing");
    };

    const handleMouseUp = () => {
      isDown = false;
      scrollContainer.classList.remove("cursor-grabbing");
    };

    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - scrollContainer.offsetLeft;
      const walk = (x - startX) * 2; // Velocidad del scroll
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    scrollContainer.addEventListener("mousedown", handleMouseDown);
    scrollContainer.addEventListener("mouseleave", handleMouseLeave);
    scrollContainer.addEventListener("mouseup", handleMouseUp);
    scrollContainer.addEventListener("mousemove", handleMouseMove);

    return () => {
      scrollContainer.removeEventListener("mousedown", handleMouseDown);
      scrollContainer.removeEventListener("mouseleave", handleMouseLeave);
      scrollContainer.removeEventListener("mouseup", handleMouseUp);
      scrollContainer.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleMoodClick = (mood) => {
    // Si el mood ya está seleccionado, lo deseleccionamos
    if (selectedMood && selectedMood.name === mood.name) {
      setSelectedMood(null);
    } else {
      setSelectedMood(mood);
    }
  };

  return (
    <div className="w-full px-6">
      {filter && (
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">
          Elige un mood
        </h2>
      )}
      <div className="overflow-x-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto cursor-grab select-none pr-6 pb-2"
          style={{ paddingLeft: "0" }}
        >
          {moods.map((mood) => {
            const isSelected = selectedMood && mood.name === selectedMood.name;
            return (
              <div
                key={mood.name}
                onClick={() => handleMoodClick(mood)}
                onMouseDown={(e) => e.stopPropagation()} // Evitar conflicto con el drag
                style={{ backgroundColor: mood.backgroundColor }}
                className={`
                  cursor-pointer rounded-xl box-border border-4 w-[200px] min-w-[200px] md:w-[300px] md:min-w-[300px]
                  ${isSelected ? "border-[#ffffff]" : "border-transparent"}
                  hover:border-[#ffffff] transition-colors
                `}
              >
                <div className="flex items-center justify-center h-20 sm:h-24 md:h-28 lg:h-32 px-4">
                  <span
                    className="font-oi text-2xl sm:text-2xl md:text-2xl break-words text-center leading-tight"
                    style={{
                      color: mood.textColor,
                      wordBreak: "break-word",
                      hyphens: "auto",
                    }}
                  >
                    {mood.abbreviation}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react/prop-types */
function MapMarker({ width = "20", height = "26", color = "#00DAF0" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19 10.9512C19 18.122 10 24.2683 10 24.2683C10 24.2683 1 18.122 1 10.9512C1 8.50605 1.94821 6.16102 3.63604 4.43203C5.32387 2.70303 7.61305 1.73169 10 1.73169C12.3869 1.73169 14.6761 2.70303 16.364 4.43203C18.0518 6.16102 19 8.50605 19 10.9512Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 14.0245C11.6569 14.0245 13 12.6486 13 10.9513C13 9.25408 11.6569 7.87817 10 7.87817C8.34315 7.87817 7 9.25408 7 10.9513C7 12.6486 8.34315 14.0245 10 14.0245Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default MapMarker;

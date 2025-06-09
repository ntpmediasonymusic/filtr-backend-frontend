/* eslint-disable react/prop-types */
function ShareIcon({ width = "27", height = "28", color = "#00DAF0" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 27 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20.25 9.5C22.114 9.5 23.625 7.98896 23.625 6.125C23.625 4.26104 22.114 2.75 20.25 2.75C18.386 2.75 16.875 4.26104 16.875 6.125C16.875 7.98896 18.386 9.5 20.25 9.5Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.75 17.375C8.61396 17.375 10.125 15.864 10.125 14C10.125 12.136 8.61396 10.625 6.75 10.625C4.88604 10.625 3.375 12.136 3.375 14C3.375 15.864 4.88604 17.375 6.75 17.375Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20.25 25.25C22.114 25.25 23.625 23.739 23.625 21.875C23.625 20.011 22.114 18.5 20.25 18.5C18.386 18.5 16.875 20.011 16.875 21.875C16.875 23.739 18.386 25.25 20.25 25.25Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.66382 15.6987L17.3476 20.1762"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17.3363 7.82373L9.66382 12.3012"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default ShareIcon;

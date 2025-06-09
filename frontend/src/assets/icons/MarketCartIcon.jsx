/* eslint-disable react/prop-types */
function MarketCartIcon({ width = "21", height = "22", className = "" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 21 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`text-current ${className}`}
    >
      <g clipPath="url(#clip0_745_542)">
        <path
          d="M7.875 19.75C8.35825 19.75 8.75 19.3582 8.75 18.875C8.75 18.3918 8.35825 18 7.875 18C7.39175 18 7 18.3918 7 18.875C7 19.3582 7.39175 19.75 7.875 19.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 19.75C17.9832 19.75 18.375 19.3582 18.375 18.875C18.375 18.3918 17.9832 18 17.5 18C17.0168 18 16.625 18.3918 16.625 18.875C16.625 19.3582 17.0168 19.75 17.5 19.75Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M0.875 1.375H4.375L6.72 13.0913C6.80001 13.4941 7.01917 13.856 7.3391 14.1135C7.65904 14.3711 8.05936 14.5079 8.47 14.5H16.975C17.3856 14.5079 17.786 14.3711 18.1059 14.1135C18.4258 13.856 18.645 13.4941 18.725 13.0913L20.125 5.75H5.25"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_745_542">
          <rect
            width={width}
            height={height}
            fill="white"
            transform="translate(0 0.5)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}

export default MarketCartIcon;

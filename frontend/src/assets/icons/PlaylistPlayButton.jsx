/* eslint-disable react/prop-types */
function PlaylistPlayButton({ className = "", onlyArrow = false }) {
  return (
    <svg
      viewBox="0 0 225 225"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-full ${className}`}
    >
      {!onlyArrow && (
        <>
          <rect
            width="225"
            height="225"
            rx="8"
            fill="black"
            fillOpacity="0.2"
          />
          <rect
            width="225"
            height="225"
            rx="8"
            fill="#252734"
            fillOpacity="0.7"
          />
        </>
      )}
      <g filter="url(#filter0_d_430_911)">
        <path
          d="M164.436 112.5C164.436 141.224 141.276 164.5 112.718 164.5C84.16 164.5 61 141.224 61 112.5C61 83.7762 84.16 60.5 112.718 60.5C141.276 60.5 164.436 83.7762 164.436 112.5Z"
          stroke="url(#paint0_linear_430_911)"
          strokeWidth="2"
          shapeRendering="crispEdges"
        />
      </g>
      <g filter="url(#filter1_d_430_911)">
        <path
          d="M140.224 107.843C143.558 109.767 143.558 114.578 140.224 116.503L101.734 138.726C98.4002 140.65 94.2335 138.244 94.2335 134.395L94.2335 89.9502C94.2335 86.1012 98.4002 83.6956 101.734 85.6201L140.224 107.843Z"
          fill="url(#paint1_linear_430_911)"
        />
        <path
          d="M139.974 108.276C142.974 110.008 142.974 114.338 139.974 116.07L101.484 138.293C98.4835 140.025 94.7335 137.86 94.7335 134.395L94.7335 89.9502C94.7335 86.4861 98.4835 84.321 101.484 86.0531L139.974 108.276Z"
          stroke="url(#paint2_linear_430_911)"
        />
      </g>
      <defs>
        <filter
          id="filter0_d_430_911"
          x="53.5"
          y="59.5"
          width="116.436"
          height="117.5"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="1"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_430_911"
          />
          <feOffset dx="-1" dy="6" />
          <feGaussianBlur stdDeviation="2.25" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.2 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_430_911"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_430_911"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_430_911"
          x="90.2335"
          y="84.9427"
          width="56.4907"
          height="62.4601"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_430_911"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_430_911"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_430_911"
          x1="142.321"
          y1="165.5"
          x2="83.1154"
          y2="59.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.0845617" stopColor="#ffffff" />
          <stop offset="0.816646" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_430_911"
          x1="135.203"
          y1="147.833"
          x2="88.9249"
          y2="76.5123"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.269476" stopColor="#ffffff" />
          <stop offset="0.891731" stopColor="#ffffff" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_430_911"
          x1="147.724"
          y1="112.173"
          x2="76.4033"
          y2="112.173"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default PlaylistPlayButton;

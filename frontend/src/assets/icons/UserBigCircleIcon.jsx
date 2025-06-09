/* eslint-disable react/prop-types */
function UserBigCircleIcon({
  width = "192",
  height = "193",
  color = "#D9D9D9",
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 192 193"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="96" cy="96.5" r="96" fill={color} />
      <path
        d="M126.667 128.5V120.833C126.667 116.767 125.051 112.867 122.176 109.991C119.3 107.115 115.4 105.5 111.333 105.5H80.6668C76.6002 105.5 72.7001 107.115 69.8245 109.991C66.949 112.867 65.3335 116.767 65.3335 120.833V128.5"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M95.9998 90.1667C104.468 90.1667 111.333 83.3017 111.333 74.8333C111.333 66.365 104.468 59.5 95.9998 59.5C87.5315 59.5 80.6665 66.365 80.6665 74.8333C80.6665 83.3017 87.5315 90.1667 95.9998 90.1667Z"
        stroke="black"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default UserBigCircleIcon;

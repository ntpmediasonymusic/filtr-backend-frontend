/* eslint-disable react/prop-types */
function FacebookIcon({ width = "24", height = "24", color = "#020814" }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
        fill="white"
      />
      <path
        d="M15.804 6.768V8.96H11.228V11.328H14.652V13.456H11.228V18H8.492V6.768H15.804Z"
        fill={color}
      />
    </svg>
  );
}

export default FacebookIcon;
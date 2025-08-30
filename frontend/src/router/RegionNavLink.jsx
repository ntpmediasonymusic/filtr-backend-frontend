/* eslint-disable react/prop-types */
import { NavLink } from "react-router-dom";
import { useRegion } from "./RegionContext";

function withRegionPrefix(region, to = "") {
  const t = String(to);
  if (t === `/${region}` || t.startsWith(`/${region}/`)) return t;
  return t.startsWith("/") ? `/${region}${t}` : `/${region}/${t}`;
}

export default function RegionNavLink({ to = "", end, className, ...rest }) {
  const { region } = useRegion();
  const normalized = withRegionPrefix(region, to);
  const shouldEnd = end ?? (to === "/" || to === "");
  return (
    <NavLink to={normalized} end={shouldEnd} className={className} {...rest} />
  );
}
/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useRegion } from "./RegionContext";

function withRegionPrefix(region, to = "") {
  const t = String(to);
  if (t === `/${region}` || t.startsWith(`/${region}/`)) return t;
  return t.startsWith("/") ? `/${region}${t}` : `/${region}/${t}`;
}

export default function RegionLink({ to = "", ...rest }) {
  const { region } = useRegion();
  const normalized = withRegionPrefix(region, to);
  return <Link to={normalized} {...rest} />;
}

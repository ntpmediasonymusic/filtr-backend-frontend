import { useContext } from "react";
import { GTMContext } from "./GTMContext";

export const useGTM = () => {
  const context = useContext(GTMContext);
  if (!context) {
    throw new Error("useGTM must be used within GTMProvider");
  }
  return context;
};

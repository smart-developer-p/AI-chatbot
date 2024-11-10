import { ArchiveContext } from "@/contexts/ArchiveContext";
import { useContext } from "react";

export const useArchive = () => {
  const contextValue = useContext(ArchiveContext);
  return contextValue;
};

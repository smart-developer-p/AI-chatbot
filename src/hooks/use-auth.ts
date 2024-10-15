import { AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export const useAuth = () => {
  const contextValue = useContext(AuthContext);
  return contextValue;
};

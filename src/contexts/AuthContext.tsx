import { ReactNode, createContext, useEffect, useState } from "react";

import { getItem } from "../services/session";

export interface User {
  email: string;
  full_name: string;
  username: string;
  unique_id: string;
}

interface AuthContextProps {
  loading: boolean;
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isUserUpdated: boolean;
  setIsUserUpdated: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextProps>({
  loading: true,
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isUserUpdated: false,
  setIsUserUpdated: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isUserUpdated, setIsUserUpdated] = useState<boolean>(false);

  // check session
  useEffect(() => {
    if (getItem("access_token")) {
      setUser(getItem("user"));
      setIsLoggedIn(true);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loading,
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser,
        isUserUpdated,
        setIsUserUpdated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import React, { ReactNode, createContext, useEffect, useState } from "react";

import { getItem } from "../services/session";

export interface ArchivedChat{
  name:string;
  id:string;
  created:Date
}

interface ArchiveContextProps {
  archivedchats: ArchivedChat[];
  setArchivedChats: React.Dispatch<React.SetStateAction<ArchivedChat[]>>;
  currentLookingAt:string,
  setCrurentLookingAt:React.Dispatch<React.SetStateAction<string>>
}

export const ArchiveContext = createContext<ArchiveContextProps>({
  archivedchats:[],
  setArchivedChats:()=>{},
  currentLookingAt:'',
  setCrurentLookingAt:()=>{}
});

export const ArchiveProvider = ({ children }: { children: ReactNode }) => {
  const [archivedchats, setArchivedChats] = useState<ArchivedChat[]>([]);
  const [currentLookingAt,setCrurentLookingAt]=useState<string>('')

  // check session
  useEffect(() => {

    const archived = getItem('archivedChats')
    if (archived) {
      setArchivedChats(archived)
    }
  }, []);


  return (
    <ArchiveContext.Provider
      value={{
        archivedchats,
        setArchivedChats,
        currentLookingAt,
        setCrurentLookingAt
      }}
    >
      {children}
    </ArchiveContext.Provider>
  );
};

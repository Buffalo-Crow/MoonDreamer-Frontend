import { useState, createContext } from "react";

export const DreamContext = createContext();

export function DreamProvider({ children }) {
  const [dreams, setDreams] = useState([]);
  const [selectedDream, setSelectedDream] = useState(null);
  const [dreamToDelete, setDreamToDelete] = useState(null);
  const [filterSign, setFilterSign] = useState("ALL");

 const updateDream = (updatedDream) => {
  if (!updatedDream || !updatedDream._id) {
    console.error("updateDream called with invalid dream:", updatedDream);
    return;
  }

  setDreams((prevDreams) =>
    prevDreams.map((dream) =>
      dream && dream._id === updatedDream._id ? updatedDream : dream
    )
  );

  setSelectedDream((prevSelected) =>
    prevSelected && prevSelected._id === updatedDream._id
      ? updatedDream
      : prevSelected
  );
};

  return (
    <DreamContext.Provider
      value={{
        dreams,
        setDreams,
        selectedDream,
        setSelectedDream,
        dreamToDelete,
        setDreamToDelete,
        updateDream,
        filterSign,
        setFilterSign,
      }}
    >
      {children}
    </DreamContext.Provider>
  );
}

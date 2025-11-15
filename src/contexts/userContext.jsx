import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

// Helper to restore user from localStorage
const restoreUserFromStorage = () => {
  try {
    const storedUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("jwtToken");
    
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      return { ...parsedUser, token };
    }
  } catch (error) {
    console.error("Failed to restore user from storage:", error);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("jwtToken");
  }
  return null;
};

export function UserProvider({ children }) {
  // Initialize with stored user if available
  const [currentUser, setCurrentUser] = useState(() => restoreUserFromStorage());

  // Persist currentUser to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      if (currentUser.token) {
        localStorage.setItem("jwtToken", currentUser.token);
      }
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("jwtToken");
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
}

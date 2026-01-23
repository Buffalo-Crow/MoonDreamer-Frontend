import { createContext, useState, useEffect } from "react";
import { getUserInfo } from "../utils/auth";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("jwtToken");
    
    if (!token || !storedUser) {
      setLoadingUser(false);
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setCurrentUser({ ...parsedUser, token });
      
      // Verify token with backend
      getUserInfo()
        .then((user) => {
          setCurrentUser({ ...user, token });
          localStorage.setItem("currentUser", JSON.stringify(user));
        })
        .catch((err) => {
          if (err.message.includes("401") || err.message.includes("403")) {
            // Token is invalid, clear everything
            localStorage.removeItem("currentUser");
            localStorage.removeItem("jwtToken");
            setCurrentUser(null);
          } else {
            // Network error or other issue, keep the stored user data
            console.warn("Token verification failed, keeping local data", err);
          }
        })
        .finally(() => {
          setLoadingUser(false);
        });
    } catch (err) {
      console.error("Failed to parse stored user", err);
      localStorage.removeItem("currentUser");
      localStorage.removeItem("jwtToken");
      setCurrentUser(null);
      setLoadingUser(false);
    }
  }, []);

  // Persist currentUser changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loadingUser }}>
      {children}
    </UserContext.Provider>
  );
}

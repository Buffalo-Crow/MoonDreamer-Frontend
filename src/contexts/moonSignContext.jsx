import { createContext, useContext, useState, useEffect } from "react";
import { moonSignImages } from "../utils/constants";
import { moonSignDescriptions } from "../utils/moonSignDescriptions";
import { getCachedMoonSign, saveMoonSignToCache } from "../utils/moonSignUtils";

const MoonContext = createContext();

export function MoonProvider({ children }) {
  const [moonSign, setMoonSign] = useState(null);
  const [moonImage, setMoonImage] = useState("");
  const [moonDescription, setMoonDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchMoonSign() {
      setLoading(true);
      const today = new Date().toISOString().slice(0, 10);
      const cached = getCachedMoonSign(today);
      if (cached && cached.moonSign && cached.moonSign !== "Unknown") {
        setMoonSign(cached.moonSign);
        setMoonImage(cached.moonImage);
        setMoonDescription(cached.moonDescription);
        setLoading(false);
        return;
      }
      try {
        const url =
          window.location.hostname === "localhost"
            ? `${import.meta.env.VITE_API_URL}/api/moon/moon-sign`
            : "https://moondreamer-backend-production.up.railway.app/api/moon/moon-sign";
        const res = await fetch(url);
        const data = await res.json();

        if (!data?.moonSign) throw new Error("Moon sign missing from API");

        const key = data.moonSign.toLowerCase();
        const moonData = {
          moonSign: data.moonSign,
          moonImage: moonSignImages[key] || "",
          moonDescription: moonSignDescriptions[key] || "",
        };

        if (!isMounted) return;
        setMoonSign(moonData.moonSign);
        setMoonImage(moonData.moonImage);
        setMoonDescription(moonData.moonDescription);
        saveMoonSignToCache(today, moonData);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error fetching moon sign:", err);
        setError("Failed to load moon sign");
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    fetchMoonSign();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <MoonContext.Provider
      value={{ moonSign, moonImage, moonDescription, error, loading }}
    >
      {children}
    </MoonContext.Provider>
  );
}

export function useMoon() {
  return useContext(MoonContext);
}

const API_BASE = import.meta.env.VITE_API_URL || "https://localhost:3001";;

export async function getCoordinates(location) {
  const response = await fetch(`${API_BASE}/api/moon/geocode?location=${encodeURIComponent(location)}`);

  if (!response.ok) {
    throw new Error("Failed to get coordinates.");
  }

  const data = await response.json();
  return { lat: data.latitude, lng: data.longitude };
}


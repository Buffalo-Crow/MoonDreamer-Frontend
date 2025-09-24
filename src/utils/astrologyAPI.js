const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3001";;

export async function fetchDreamMoonSign({ date, lat, lng }) {
  const response = await fetch(`${API_BASE}/api/moon/moon-sign/dream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date, latitude: lat, longitude: lng }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("Moon sign API error:", text);
    throw new Error("Failed to fetch moon sign.");
  }

  const data = await response.json();
  return data.moonSign;
}

// Optional: fetch current moon sign (default location)
export async function fetchCurrentMoonSign() {
  const response = await fetch(`${API_BASE}/api/moon/moon-sign`);
  if (!response.ok) throw new Error("Failed to fetch current moon sign.");
  const data = await response.json();
  return data.moonSign;
}
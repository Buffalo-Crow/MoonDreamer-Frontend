import { getAuth } from "firebase/auth";

export const apiFetch = async (url, options = {}) => {
  const auth = getAuth();
  const firebaseToken = await auth.currentUser?.getIdToken();
  const token = firebaseToken || localStorage.getItem("jwtToken");

  if (firebaseToken) {
    localStorage.setItem("jwtToken", firebaseToken);
  }

  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API request failed: ${response.status} ${text}`);
  }

  return response.json();
};
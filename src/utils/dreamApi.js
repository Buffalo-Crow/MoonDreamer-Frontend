import { getAuth } from "firebase/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

//helper function
async function getAuthHeaders() {
  const auth = getAuth();
  const firebaseToken = await auth.currentUser?.getIdToken();
  const token = firebaseToken || localStorage.getItem("jwtToken");

  if (firebaseToken) {
    localStorage.setItem("jwtToken", firebaseToken);
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

//  CRUD api calls for DREAMS 
export async function fetchDreams() {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dreams`, {
    headers,
  });
  if (!res.ok) throw new Error("Failed to fetch dreams");
  return res.json();
}

export async function createDream(dreamData) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dreams`, {
    method: "POST",
    headers,
    body: JSON.stringify(dreamData),
  });
  if (!res.ok) throw new Error("Failed to create dream");
  return res.json();
}


export async function editDreams(id, updates) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dreams/${id}`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update dream");
  return res.json();
}


export async function deleteDream(id) {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/api/dreams/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) throw new Error("Failed to delete dream");
  return res.json();
}
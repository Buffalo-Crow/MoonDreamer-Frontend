const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

//helper function
function getAuthHeaders() {
  const token = localStorage.getItem("jwtToken");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

//  CRUD api calls for DREAMS 
export async function fetchDreams() {
  const res = await fetch(`${API_URL}/api/dreams`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch dreams");
  return res.json();
}

export async function createDream(dreamData) {
  const res = await fetch(`${API_URL}/api/dreams`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(dreamData),
  });
  if (!res.ok) throw new Error("Failed to create dream");
  return res.json();
}


export async function editDreams(id, updates) {
  const res = await fetch(`${API_URL}/api/dreams/${id}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update dream");
  return res.json();
}


export async function deleteDream(id) {
  const res = await fetch(`${API_URL}/api/dreams/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error("Failed to delete dream");
  return res.json();
}
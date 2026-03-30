import { auth } from "./firebase";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://moondreamer-backend-production.up.railway.app";

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

async function getToken() {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No auth token");
  return token;
}

async function editProfile({ username, avatar }) {
  const token = await getToken();
  return fetch(`${API_URL}/api/users/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username,
      avatar,
    }),
  }).then((res) => checkResponse(res));
}

async function editDream(dreamId, { title, summary, date, moonSign }) {
  const token = await getToken();
  return fetch(`${API_URL}/api/dreams/${dreamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, summary, date, moonSign }),
  }).then((res) => checkResponse(res));
}

export { checkResponse, editProfile, editDream };
const API_URL = import.meta.env.VITE_API_URL;

function checkResponse(res) {
  if (res.ok) {
    return res.json();
  }
  return Promise.reject(`Error: ${res.status}`);
}

function editProfile({ username, avatar }) {
  const token = localStorage.getItem("jwtToken");
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


function editDream(dreamId, { title, summary, date, moonSign }) {
  const token = localStorage.getItem("jwtToken");
  return fetch(`${API_URL}/api/dreams/${dreamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, summary, date, moonSign }),
  }).then((res) => checkResponse(res));
}


export{ checkResponse, editProfile, editDream };
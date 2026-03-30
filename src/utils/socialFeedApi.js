import { getAuth } from "firebase/auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function getToken() {
  const auth = getAuth();
  if (auth.currentUser) {
    return await auth.currentUser.getIdToken();
  }
  throw new Error("Authentication required");
}

export async function fetchPublicDreams() {
  const response = await fetch(`${API_BASE}/api/dreams/public`);

  if (!response.ok) {
    throw new Error(`Failed to fetch public dreams: ${response.status}`);
  }

  const dreams = await response.json();

  return dreams.map((dream) => ({
    ...dream,
    user: dream.userId ||
      dream.user || { _id: "unknown", username: "Anonymous", avatar: "" },
    likes: dream.likes || [],
    comments: dream.comments || [],
  }));
}

export async function toggleDreamLike(dreamId) {
  const token = await getToken();

  const response = await fetch(`${API_BASE}/api/dreams/${dreamId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to toggle like: ${response.status}`);
  }

  return await response.json();
}

export async function addComment(dreamId, commentText) {
  const token = await getToken();

  const response = await fetch(`${API_BASE}/api/dreams/${dreamId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ text: commentText }),
  });

  if (!response.ok) {
    throw new Error(`Failed to add comment: ${response.status}`);
  }

  return await response.json();
}

export async function deleteComment(dreamId, commentId) {
  const token = await getToken();

  const response = await fetch(
    `${API_BASE}/api/dreams/${dreamId}/comment/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to delete comment: ${response.status}`);
  }

  return await response.json();
}

export async function toggleCommentLike(dreamId, commentId) {
  const token = await getToken();

  const response = await fetch(
    `${API_BASE}/api/dreams/${dreamId}/comment/${commentId}/like`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to toggle comment like: ${response.status}`);
  }

  return await response.json();
}

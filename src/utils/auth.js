const API_URL = import.meta.env.VITE_API_URL || "https://moondreamer-backend-production.up.railway.app";

import { checkResponse } from "./api";

export const signin = (email, password) => {
  return fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => checkResponse(res))
    .then((data) => {
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("currentUser", JSON.stringify(data.user));
      return data;
    });
};

export const register = ({ username, email, password, avatar }) => {
  return fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, avatar }),
  }).then((res) => 
    checkResponse(res));
};

export const getUserInfo = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) throw new Error("No token found");
  return fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => checkResponse(res));
};

export function signOut({ keepToken = false } = {}) {
  if (!keepToken) {
    localStorage.removeItem("jwtToken");
  }
  localStorage.removeItem("currentUser"); // clear user state
}


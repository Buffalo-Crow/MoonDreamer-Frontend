const API_URL = import.meta.env.VITE_API_URL || "https://localhost:3001";
import { checkResponse } from "./api";

export const signin = (email, password) => {
  console.log("API URL:", API_URL)
  return fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => checkResponse(res))
    .then((data) => {
      // Save token immediately
      localStorage.setItem("jwtToken", data.token);
      return data;
    });
};

export const register = ({ username, email, password, avatar }) => {
  console.log("Register payload:", { username, email, password, avatar });
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


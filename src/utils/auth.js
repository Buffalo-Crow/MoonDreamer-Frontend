import { checkResponse } from "./api";
import {
  auth,
  firebaseSignIn,
  firebaseSignUp,
  firebaseLogout,
  firebaseGoogleSignIn,
  firebaseResetPassword,
} from "./firebase";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://moondreamer-backend-production.up.railway.app";

export const signin = async (email, password) => {
  const userCredential = await firebaseSignIn(email, password);
  const token = await userCredential.user.getIdToken();
  localStorage.setItem("jwtToken", token);
  return { token };
};

export const register = async ({ username, email, password, avatar }) => {
  const userCredential = await firebaseSignUp(email, password);
  const token = await userCredential.user.getIdToken();

  const response = await fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      firebaseUid: userCredential.user.uid,
      username,
      email,
      avatar,
    }),
  });

  const data = await checkResponse(response);
  localStorage.setItem("jwtToken", token);
  localStorage.setItem("currentUser", JSON.stringify(data));
  return data;
};

export const googleSignIn = async () => {
  let userCredential;
  try {
    userCredential = await firebaseGoogleSignIn();
  } catch (err) {
    if (err.code === "auth/account-exists-with-different-credential") {
      throw new Error(
        "An account with this email already exists. Please sign in with your email and password, then link Google from your profile."
      );
    }
    throw err;
  }

  const token = await userCredential.user.getIdToken();
  localStorage.setItem("jwtToken", token);

  // Check if user already has a registered account in our DB
  const userRes = await fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (userRes.ok) {
    const data = await userRes.json();
    localStorage.setItem("currentUser", JSON.stringify(data));
    return { token, user: data };
  }

  // No account found — sign out and block access
  localStorage.removeItem("jwtToken");
  await firebaseLogout();
  throw new Error(
    "No account found. Please register first before signing in with Google."
  );
};

export const resetPassword = (email) => firebaseResetPassword(email);

export const getUserInfo = async () => {
  const token = await auth.currentUser?.getIdToken();
  if (!token) throw new Error("No token found");

  return fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(async (res) => {
    if (res.status === 404) return null;
    return checkResponse(res);
  });
};

export function signOut({ keepToken = false } = {}) {
  if (!keepToken) {
    localStorage.removeItem("jwtToken");
  }
  localStorage.removeItem("currentUser");
  return firebaseLogout();
}
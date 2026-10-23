import { makeRequest } from "./client.js";

export async function fetchUserProfile() {
  return makeRequest("/api/me");
}

export function getStoredToken() {
  return localStorage.getItem("token");
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function clearToken() {
  localStorage.removeItem("token");
}

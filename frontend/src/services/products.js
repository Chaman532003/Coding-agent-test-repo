import { makeRequest } from "./client.js";

export async function fetchProducts() {
  return makeRequest("/api/products");
}

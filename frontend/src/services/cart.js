import { makeRequest } from "./client.js";

export async function fetchCart() {
  return makeRequest("/api/cart");
}

export async function addToCart(productId, quantity = 1) {
  return makeRequest("/api/cart/items", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}

export async function removeFromCart(productId) {
  return makeRequest(`/api/cart/items/${productId}`, {
    method: "DELETE",
  });
}

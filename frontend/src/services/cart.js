import request from './client'

export async function getCart() {
  return await request('/cart', { method: 'GET' })
}

export async function addToCart(product_id, quantity = 1) {
  return await request('/cart/items', { method: 'POST', body: JSON.stringify({ product_id, quantity }) })
}

export async function removeFromCart(product_id) {
  return await request(`/cart/items/${product_id}`, { method: 'DELETE' })
}

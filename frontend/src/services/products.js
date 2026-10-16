import request from './client'

export async function listProducts() {
  return await request('/products', { method: 'GET' })
}

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import ProductsPage from '../pages/ProductsPage'

vi.mock('../services/products', () => ({ listProducts: vi.fn() }))
vi.mock('../services/cart', () => ({ addToCart: vi.fn() }))

import { listProducts } from '../services/products'
import { addToCart } from '../services/cart'

test('shows loading then products and add button works', async () => {
  const products = [
    { id: 1, name: 'A', price: 12.5, image_url: '', description: 'd' },
    { id: 2, name: 'B', price: 5, image_url: '', description: 'd' },
  ]
  listProducts.mockResolvedValue(products)
  addToCart.mockResolvedValue({ items: [], count: 0, total: 0 })
  const onAdd = vi.fn()
  render(<ProductsPage onAdd={onAdd} />)
  expect(screen.getByText(/Loading products/i)).toBeTruthy()
  await waitFor(() => expect(screen.getAllByRole('article').length).toBe(2))
  // product name and img alt and price and button
  expect(screen.getByText('A')).toBeTruthy()
  const img = screen.getAllByRole('img')[0]
  expect(img.getAttribute('alt') === 'A').toBeTruthy()
  expect(screen.getByText('$12.50')).toBeTruthy()
  const btn = screen.getAllByRole('button', { name: /Add to cart/i })[0]
  fireEvent.click(btn)
  await waitFor(() => expect(addToCart).toHaveBeenCalledWith(1, 1))
})

test('shows error when products fail', async () => {
  listProducts.mockRejectedValue(new Error('boom'))
  render(<ProductsPage />)
  await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
})

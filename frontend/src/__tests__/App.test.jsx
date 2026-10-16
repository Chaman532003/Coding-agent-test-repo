import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { fireEvent } from '@testing-library/react'
import App from '../App'

vi.mock('../api', () => ({ login: vi.fn() }))
vi.mock('../services/products', () => ({ listProducts: vi.fn() }))
vi.mock('../services/cart', () => ({ getCart: vi.fn(), addToCart: vi.fn(), removeFromCart: vi.fn() }))

import { login } from '../api'
import { listProducts } from '../services/products'
import { getCart, addToCart } from '../services/cart'

test('login then shows header and cart button', async () => {
  login.mockResolvedValue({ access_token: 'abc', token_type: 'bearer' })
  listProducts.mockResolvedValue([])
  getCart.mockResolvedValue({ items: [], count: 0, total: 0 })
  render(<App />)
  // fill login form
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'demo@shop.test' } })
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'demo1234' } })
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }))
  await waitFor(() => expect(screen.getByText('E-Commerce Platform')).toBeTruthy())
  // cart button uses aria-label; find it and ensure pill contains 0
  const cartBtn = screen.getByLabelText('Open cart')
  expect(cartBtn).toBeTruthy()
  expect(cartBtn.querySelector('.pill').textContent).toContain('0')
})

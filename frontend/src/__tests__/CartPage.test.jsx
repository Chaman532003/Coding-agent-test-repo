import React from 'react'
import { render, screen } from '@testing-library/react'
import CartPage from '../pages/CartPage'

vi.mock('../services/cart', () => ({ removeFromCart: vi.fn() }))
import { removeFromCart } from '../services/cart'

test('renders cart lines and totals', () => {
  const cart = { items: [
    { product_id: 1, name: 'A', price: 10, quantity: 1, line_total: 10 },
    { product_id: 2, name: 'B', price: 5, quantity: 2, line_total: 10 }
  ], count: 3, total: 20 }
  render(<CartPage cart={cart} onCartChange={() => {}} onBack={() => {}} />)
  expect(screen.getByText('Your cart')).toBeTruthy()
  expect(screen.getByText('A')).toBeTruthy()
  const matches = screen.getAllByText('$10.00')
  expect(matches.length).toBeGreaterThanOrEqual(1)
  expect(screen.getByText('$20.00')).toBeTruthy()
})

test('empty cart shows message and back button', () => {
  render(<CartPage cart={{ items: [], count: 0, total: 0 }} onBack={() => {}} />)
  expect(screen.getByText(/Your cart is empty/i)).toBeTruthy()
  expect(screen.getByRole('button', { name: /Back to products/i })).toBeTruthy()
})

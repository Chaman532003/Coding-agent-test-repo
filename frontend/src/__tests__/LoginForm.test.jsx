import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '../components/LoginForm'

afterEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
})

test('renders email and password inputs and login button', () => {
  render(<LoginForm />)
  expect(screen.getByLabelText('Email')).toBeDefined()
  expect(screen.getByLabelText('Password')).toBeDefined()
  expect(screen.getByRole('button', { name: 'Log in' })).toBeDefined()
})

test('successful login calls fetch with correct arguments', async () => {
  const body = { access_token: 'abc', token_type: 'bearer' }
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body }))

  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } })
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1))
  expect(fetch).toHaveBeenCalledWith('/api/login', expect.objectContaining({
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'a@example.com', password: 'secret123' })
  }))
})

test('successful login stores token and shows signed in message', async () => {
  const body = { access_token: 'abc', token_type: 'bearer' }
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body }))

  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'secret123' } })
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

  const success = await screen.findByText('Signed in as a@example.com')
  expect(success).toBeDefined()
  expect(localStorage.getItem('token')).toBe('abc')
})

test('failed login shows error message and does not store token', async () => {
  const body = { detail: 'Invalid email or password' }
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => body }))

  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass1' } })
  fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

  const alert = await screen.findByRole('alert')
  expect(alert && alert.textContent).toBe('Invalid email or password')
  expect(localStorage.getItem('token')).toBeNull()
})

test('shows required message and does not call fetch when inputs empty', async () => {
  vi.stubGlobal('fetch', vi.fn())
  render(<LoginForm />)

  fireEvent.click(screen.getByRole('button', { name: 'Log in' }))

  const alert = await screen.findByRole('alert')
  expect(alert && alert.textContent).toBe('Email and password are required')
  expect(fetch).not.toHaveBeenCalled()
})

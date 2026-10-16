import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from '../components/LoginForm'

afterEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
})

test('renders email, password inputs and login button', () => {
  render(<LoginForm />)
  const email = screen.getByLabelText(/Email/i)
  const password = screen.getByLabelText(/Password/i)
  const button = screen.getByRole('button', { name: /Log in/i })
  if (!email || !password || !button) throw new Error('Missing form elements')
})

test('successful login calls fetch with correct payload', async () => {
  const body = { access_token: 'abc', token_type: 'bearer' }
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body }))

  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret123' } })
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }))

  await waitFor(() => {
    if (!global.fetch) throw new Error('fetch not stubbed')
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })
  const calledWith = global.fetch.mock.calls[0]
  const url = calledWith[0]
  const opts = calledWith[1]
  expect(url).toBe('/api/login')
  expect(opts.method).toBe('POST')
  expect(opts.headers['Content-Type']).toBe('application/json')
  expect(opts.body).toBe(JSON.stringify({ email: 'a@example.com', password: 'secret123' }))
})

test('successful login stores token and shows signed in message', async () => {
  const body = { access_token: 'abc', token_type: 'bearer' }
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => body }))

  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'secret123' } })
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }))

  await screen.findByText('Signed in as a@example.com')
  expect(localStorage.getItem('token')).toBe('abc')
})

test('failed login shows error and does not set token', async () => {
  const body = { detail: 'Invalid email or password' }
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 401, json: async () => body }))

  render(<LoginForm />)

  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'a@example.com' } })
  fireEvent.change(screen.getByLabelText(/Password/i), { target: { value: 'wrongpass1' } })
  fireEvent.click(screen.getByRole('button', { name: /Log in/i }))

  const alert = await screen.findByRole('alert')
  if (!alert.textContent.includes('Invalid email or password')) throw new Error('Unexpected alert text: ' + alert.textContent)
  expect(localStorage.getItem('token')).toBeNull()
})

test('empty fields show validation message and do not call fetch', async () => {
  vi.stubGlobal('fetch', vi.fn())
  render(<LoginForm />)

  fireEvent.click(screen.getByRole('button', { name: /Log in/i }))

  const alert = await screen.findByRole('alert')
  if (!alert.textContent.includes('Email and password are required')) throw new Error('Unexpected alert text: ' + alert.textContent)
  expect(global.fetch).not.toHaveBeenCalled()
})

test('structure has correct class names', () => {
  const { container } = render(<LoginForm />)
  if (!container.querySelector('main.login-page')) throw new Error('main.login-page missing')
  if (!container.querySelector('form.login-card')) throw new Error('form.login-card missing')
  const btn = screen.getByRole('button', { name: /Log in/i })
  if (!btn.classList.contains('btn-primary')) throw new Error('button missing class btn-primary')
})

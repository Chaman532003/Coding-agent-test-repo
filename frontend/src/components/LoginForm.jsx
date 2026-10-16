import React, { useState } from 'react'
import { login } from '../api'

/**
 * LoginForm component renders a login form and handles authentication.
 *
 * Props:
 * - onLoggedIn(email): optional callback invoked after successful login
 */
export default function LoginForm({ onLoggedIn }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)

    if (!email || !password) {
      setMessage('Email and password are required')
      return
    }

    try {
      const result = await login(email, password)
      if (result && result.access_token) {
        localStorage.setItem('token', result.access_token)
      }
      setMessage(`Signed in as ${email}`)
      if (typeof onLoggedIn === 'function') onLoggedIn(email)
    } catch (err) {
      setMessage(err.message)
    }
  }

  return (
    <div>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log in</button>
      </form>
      {message ? <div role="alert">{message}</div> : null}
    </div>
  )
}

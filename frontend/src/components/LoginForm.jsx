import React, { useState } from 'react'
import { login } from '../api'

/**
 * LoginForm component
 * Props:
 * - onLoggedIn(email): optional callback invoked after successful login
 */
export default function LoginForm({ onLoggedIn } = {}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [successEmail, setSuccessEmail] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)
    setSuccessEmail(null)

    if (!email || !password) {
      setMessage('Email and password are required')
      return
    }

    setLoading(true)
    try {
      const result = await login(email, password)
      // Ensure result has an access_token
      if (result && result.access_token) {
        localStorage.setItem('token', result.access_token)
        setSuccessEmail(email)
        if (typeof onLoggedIn === 'function') onLoggedIn(email)
      } else {
        // treat missing token as an error
        setMessage('Login failed')
      }
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Log in</h1>

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {message && (
          <div role="alert" className="message message--error">
            {message}
          </div>
        )}

        {successEmail && (
          <p className="message message--success">Signed in as {successEmail}</p>
        )}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </main>
  )
}

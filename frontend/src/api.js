/**
 * API helpers for the frontend app.
 */
export async function login(email, password) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  // Parse JSON only when possible. Some error responses may be empty
  // or non-JSON; guard against that by attempting to parse and falling
  // back to null when parsing fails.
  let body = null
  try {
    body = await response.json()
  } catch (err) {
    body = null
  }

  if (response.ok) {
    return body
  }

  if (body && typeof body.detail === 'string') {
    throw new Error(body.detail)
  }

  throw new Error('Login failed')
}

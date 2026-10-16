/**
 * API helpers for the frontend app.
 */

/**
 * Attempt to log in with email and password.
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {Promise<Object|null>} The parsed JSON response when successful, or null if the response had no JSON body
 * @throws {Error} When the response is not OK. If the JSON body contains a string `detail` that message is used.
 */
export async function login(email, password) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  let body = null
  try {
    body = await res.json()
  } catch (e) {
    // If parsing fails, keep body null
  }

  if (res.ok) {
    return body
  }

  if (body && typeof body.detail === 'string') {
    throw new Error(body.detail)
  }

  throw new Error('Login failed')
}

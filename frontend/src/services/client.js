/**
 * Lightweight request helper that adds Authorization header from localStorage.token
 */
export default async function request(path, options = {}) {
  const url = path.startsWith('/') ? `/api${path}` : path;
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  const token = localStorage.getItem('token');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(url, { ...options, headers });
  let body = null;
  try {
    body = await res.json();
  } catch (e) {}
  if (!res.ok) {
    if (body && typeof body.detail === 'string') throw new Error(body.detail);
    throw new Error('Request failed');
  }
  return body;
}

export async function login(email, password) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const body = await response.json().catch(() => null);
  if (response.ok) {
    if (body && typeof body.access_token === "string") {
      return body;
    }
    throw new Error("Login failed");
  }
  if (body && typeof body.detail === "string") {
    throw new Error(body.detail);
  }
  throw new Error("Login failed");
}

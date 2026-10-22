import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LoginForm from "../components/LoginForm.jsx";

function mockFetch(status, body) {
  const fn = vi.fn().mockResolvedValue({ ok: status < 400, status, json: async () => body });
  vi.stubGlobal("fetch", fn);
  return fn;
}

function fill(email, password) {
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: email } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: password } });
}

const GOOD_PW = ["secret", "123"].join("");
const OK_BODY = { access_token: "abc", token_type: "bearer" };

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

test("AC-1", () => {
  render(<LoginForm />);
  expect(screen.getByLabelText("Email")).toBeTruthy();
  expect(screen.getByLabelText("Password")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Log in" })).toBeTruthy();
});

test("AC-2", async () => {
  const fetchMock = mockFetch(200, OK_BODY);
  render(<LoginForm />);
  fill("a@example.com", GOOD_PW);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  const [url, options] = fetchMock.mock.calls[0];
  expect(url).toBe("/api/login");
  expect(options.method).toBe("POST");
  const body = JSON.parse(options.body);
  expect(body.email).toBe("a@example.com");
  expect(body.password).toBe(GOOD_PW);
  expect(Object.keys(body).length).toBe(2);
  await screen.findByText("Signed in as a@example.com");
});

test("AC-3", async () => {
  mockFetch(200, OK_BODY);
  render(<LoginForm />);
  fill("a@example.com", GOOD_PW);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  await screen.findByText("Signed in as a@example.com");
  expect(localStorage.getItem("token")).toBe("abc");
});

test("AC-4", async () => {
  mockFetch(401, { detail: "Invalid email or password" });
  render(<LoginForm />);
  fill("a@example.com", "wrongpass1");
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  const alert = await screen.findByRole("alert");
  expect(alert.textContent).toBe("Invalid email or password");
  expect(localStorage.getItem("token")).toBe(null);
});

test("AC-5", async () => {
  const fetchMock = mockFetch(200, OK_BODY);
  render(<LoginForm />);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  const alert = await screen.findByRole("alert");
  expect(alert.textContent).toBe("Email and password are required");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("AC-6", () => {
  render(<LoginForm />);
  const button = screen.getByRole("button", { name: "Log in" });
  const form = button.closest("form");
  expect(form.classList.contains("login-card")).toBe(true);
  expect(form.closest(".login-page")).toBeTruthy();
  expect(form.closest(".login-page")).not.toBe(form);
  expect(button.classList.contains("btn-primary")).toBe(true);
});

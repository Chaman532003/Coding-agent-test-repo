import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { vi, beforeEach } from "vitest";
import App from "../App.jsx";

const PRODUCTS = [
  { id: 1, name: "Desk Lamp", price: 24.5, description: "Warm light", image_url: "/lamp.png" },
  { id: 2, name: "Standing Desk", price: 320, description: "Adjustable", image_url: "/desk.png" },
];

function openAt(path) {
  window.history.replaceState({}, "", path);
}

beforeEach(() => {
  localStorage.clear();
  global.fetch = vi.fn((url) => {
    if (url === "/api/products") {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(PRODUCTS) });
    }
    return Promise.resolve({ ok: false, status: 401, json: () => Promise.resolve({ detail: "no" }) });
  });
});

test("the root page is the landing page", async () => {
  openAt("/");
  render(<App />);
  expect(await screen.findByText("Shop everything in one place")).toBeTruthy();
});

test("/login shows the login form", async () => {
  openAt("/login");
  render(<App />);
  expect(await screen.findByLabelText("Email")).toBeTruthy();
  expect(screen.getByLabelText("Password")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Log in" })).toBeTruthy();
});

test("/products lists the products without logging in", async () => {
  openAt("/products");
  render(<App />);
  expect(await screen.findByText("Desk Lamp")).toBeTruthy();
  expect(screen.getByText("$320.00")).toBeTruthy();
  expect(screen.getAllByRole("button", { name: "Add to cart" })).toHaveLength(2);
  expect(screen.getByRole("button", { name: "Log in" })).toBeTruthy();
});

test("adding to the cart while signed out sends the shopper to /login", async () => {
  openAt("/products");
  render(<App />);
  const buttons = await screen.findAllByRole("button", { name: "Add to cart" });
  fireEvent.click(buttons[0]);
  await waitFor(() => expect(window.location.pathname).toBe("/login"));
  expect(await screen.findByLabelText("Email")).toBeTruthy();
});

test("/cart asks a signed-out shopper to log in", async () => {
  openAt("/cart");
  render(<App />);
  expect(await screen.findByText("Log in to see your cart")).toBeTruthy();
});

test("a signed-in shopper who opens /login lands on the products page", async () => {
  localStorage.setItem("token", "abc");
  global.fetch = vi.fn((url) => {
    if (url === "/api/me") {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ email: "a@example.com" }) });
    }
    if (url === "/api/cart") {
      return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ items: [], count: 0, total: 0 }) });
    }
    return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(PRODUCTS) });
  });
  openAt("/login");
  render(<App />);
  expect(await screen.findByText("Welcome, a@example.com")).toBeTruthy();
  expect(window.location.pathname).toBe("/products");
});

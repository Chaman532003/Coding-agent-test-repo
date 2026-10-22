import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import App from "../App.jsx";

const ORDER = [
  "Why shoppers love us",
  "Featured products",
  "How it works",
  "Loved by thousands",
  "Simple pricing",
  "Frequently asked questions",
];

beforeEach(() => vi.stubGlobal("fetch", vi.fn(() => { throw new Error("no network"); })));
afterEach(() => vi.unstubAllGlobals());

test("AC-14 order and login", () => {
  render(<App />);
  expect(screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent)).toEqual(ORDER);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByLabelText("Email")).toBeTruthy();
  expect(screen.getByLabelText("Password")).toBeTruthy();
  ORDER.forEach((h) => expect(screen.queryByText(h)).toBeNull());
});

test("AC-15 add to cart requires login", () => {
  render(<App />);
  fireEvent.click(screen.getAllByRole("button", { name: "Add to cart" })[0]);
  expect(screen.getByLabelText("Email")).toBeTruthy();
});

test("Start shopping requires login", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Start shopping" }));
  expect(screen.getByLabelText("Password")).toBeTruthy();
});

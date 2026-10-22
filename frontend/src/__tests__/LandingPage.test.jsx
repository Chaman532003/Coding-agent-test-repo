import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import LandingPage from "../components/LandingPage.jsx";
import App from "../App.jsx";

const HEADING = "Shop everything in one place";

test("AC-1", () => {
  render(<LandingPage onLogin={() => {}} />);
  const banner = screen.getByRole("banner");
  expect(within(banner).getByText("E-Commerce Platform")).toBeTruthy();
  expect(within(banner).getByRole("button", { name: "Log in" })).toBeTruthy();
});

test("AC-2", () => {
  render(<LandingPage onLogin={() => {}} />);
  const main = screen.getByRole("main");
  expect(within(main).getByRole("heading", { level: 1, name: HEADING })).toBeTruthy();
  expect(main.querySelector("p").textContent.length).toBeGreaterThan(0);
});

test("AC-3", () => {
  const onLogin = vi.fn();
  render(<LandingPage onLogin={onLogin} />);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(onLogin).toHaveBeenCalledTimes(1);
});

test("AC-4", () => {
  render(<App />);
  expect(screen.getByRole("heading", { name: HEADING })).toBeTruthy();
  expect(screen.queryByLabelText("Email")).toBeNull();
});

test("AC-5", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByLabelText("Email")).toBeTruthy();
  expect(screen.getByLabelText("Password")).toBeTruthy();
  expect(screen.queryByText(HEADING)).toBeNull();
});

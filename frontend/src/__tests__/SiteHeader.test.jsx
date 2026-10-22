import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import SiteHeader from "../components/landing/SiteHeader.jsx";
import LandingPage from "../components/LandingPage.jsx";

test("AC-1 single Log in button in banner calls onLogin once", () => {
  const onLogin = vi.fn();
  render(<LandingPage onLogin={onLogin} />);
  expect(screen.getAllByRole("button", { name: "Log in" })).toHaveLength(1);
  const banner = screen.getByRole("banner");
  expect(within(banner).getByText("E-Commerce Platform")).toBeTruthy();
  fireEvent.click(within(banner).getByRole("button", { name: "Log in" }));
  expect(onLogin).toHaveBeenCalledTimes(1);
});

test("AC-2 navigation links", () => {
  render(<SiteHeader onLogin={() => {}} />);
  const nav = screen.getByRole("navigation");
  for (const n of ["Features", "Products", "Pricing", "FAQ"]) {
    expect(within(nav).getByRole("link", { name: n }).getAttribute("href")).toBe("#" + n.toLowerCase());
  }
});

test("AC-3 menu toggle", () => {
  render(<SiteHeader onLogin={() => {}} />);
  const btn = screen.getByRole("button", { name: "Menu" });
  const nav = screen.getByRole("navigation");
  expect(btn.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(btn);
  expect(btn.getAttribute("aria-expanded")).toBe("true");
  expect(nav.getAttribute("data-open")).toBe("true");
  fireEvent.click(btn);
  expect(btn.getAttribute("aria-expanded")).toBe("false");
  expect(nav.getAttribute("data-open")).toBe("false");
});

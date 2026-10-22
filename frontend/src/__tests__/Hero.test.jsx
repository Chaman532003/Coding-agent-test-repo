import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Hero from "../components/landing/Hero.jsx";
import StatsStrip from "../components/landing/StatsStrip.jsx";

test("AC-4 hero", () => {
  const onStart = vi.fn();
  const { container } = render(<Hero onStart={onStart} />);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.getByRole("heading", { level: 1, name: "Shop everything in one place" })).toBeTruthy();
  expect(container.querySelector("p").textContent.length).toBeGreaterThanOrEqual(80);
  expect(screen.getByRole("link", { name: "Browse products" }).getAttribute("href")).toBe("#products");
  fireEvent.click(screen.getByRole("button", { name: "Start shopping" }));
  expect(onStart).toHaveBeenCalledTimes(1);
});

test("AC-5 stats", () => {
  const { container } = render(<StatsStrip />);
  const dl = container.querySelector("dl");
  expect(dl.querySelectorAll("dt")).toHaveLength(4);
  expect(dl.querySelectorAll("dd")).toHaveLength(4);
  const values = [...dl.querySelectorAll("dd")].map((d) => d.textContent);
  for (const v of ["10k+", "4.9/5", "48h", "120+"]) expect(values).toContain(v);
});

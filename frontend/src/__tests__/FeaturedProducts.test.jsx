import { render, screen, fireEvent, within } from "@testing-library/react";
import { vi } from "vitest";
import FeaturedProducts from "../components/landing/FeaturedProducts.jsx";

test("AC-7 featured products", () => {
  const onAdd = vi.fn();
  const { container } = render(<FeaturedProducts onAdd={onAdd} />);
  const section = container.querySelector("section#products");
  expect(within(section).getByRole("heading", { level: 2, name: "Featured products" })).toBeTruthy();
  const articles = section.querySelectorAll("article");
  expect(articles).toHaveLength(6);
  articles.forEach((a) => {
    expect(within(a).getByRole("heading").textContent.length).toBeGreaterThan(0);
    expect(a.textContent).toMatch(/\$\d+\.\d{2}/);
    expect(within(a).getByRole("button", { name: "Add to cart" })).toBeTruthy();
  });
  fireEvent.click(within(articles[2]).getByRole("button", { name: "Add to cart" }));
  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd.mock.calls[0][0]).toBeTruthy();
  const ids = new Set();
  articles.forEach((a) => {
    onAdd.mockClear();
    fireEvent.click(within(a).getByRole("button", { name: "Add to cart" }));
    ids.add(onAdd.mock.calls[0][0]);
  });
  expect(ids.size).toBe(6);
});

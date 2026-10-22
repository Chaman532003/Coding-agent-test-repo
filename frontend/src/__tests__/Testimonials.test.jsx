import { render, screen } from "@testing-library/react";
import Testimonials from "../components/landing/Testimonials.jsx";

test("AC-9 testimonials", () => {
  const { container } = render(<Testimonials />);
  expect(screen.getByRole("heading", { level: 2, name: "Loved by thousands" })).toBeTruthy();
  const figures = container.querySelectorAll("figure");
  expect(figures).toHaveLength(3);
  figures.forEach((f) => {
    expect(f.querySelector("blockquote").textContent.length).toBeGreaterThan(0);
    expect(f.querySelector("figcaption").textContent.length).toBeGreaterThan(0);
  });
});

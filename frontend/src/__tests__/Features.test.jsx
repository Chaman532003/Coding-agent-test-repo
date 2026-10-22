import { render, screen, within } from "@testing-library/react";
import Features from "../components/landing/Features.jsx";

test("AC-6 features", () => {
  const { container } = render(<Features />);
  const section = container.querySelector("section#features");
  expect(within(section).getByRole("heading", { level: 2, name: "Why shoppers love us" })).toBeTruthy();
  const articles = section.querySelectorAll("article");
  expect(articles).toHaveLength(6);
  articles.forEach((a) => {
    expect(within(a).getByRole("heading", { level: 3 })).toBeTruthy();
    expect(a.querySelector("p").textContent.length).toBeGreaterThan(0);
  });
});

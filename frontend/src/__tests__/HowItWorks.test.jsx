import { render, screen } from "@testing-library/react";
import HowItWorks from "../components/landing/HowItWorks.jsx";

test("AC-8 how it works", () => {
  const { container } = render(<HowItWorks />);
  expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeTruthy();
  const ol = container.querySelector("ol");
  const items = ol.querySelectorAll(":scope > li");
  expect(items).toHaveLength(3);
  items.forEach((li) => expect(li.querySelector("h3")).toBeTruthy());
});

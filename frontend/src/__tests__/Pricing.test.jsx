import { render, screen, fireEvent } from "@testing-library/react";
import Pricing from "../components/landing/Pricing.jsx";
import { PLANS } from "../data/landing.js";

test("AC-10 pricing toggle", () => {
  const { container } = render(<Pricing />);
  const section = container.querySelector("section#pricing");
  expect(section.querySelector("h2").textContent).toBe("Simple pricing");
  const articles = section.querySelectorAll("article");
  expect(articles).toHaveLength(3);
  const price = (i) => articles[i].querySelector(".price").textContent;
  const monthly = screen.getByRole("button", { name: "Monthly" });
  const yearly = screen.getByRole("button", { name: "Yearly" });
  expect(monthly.getAttribute("aria-pressed")).toBe("true");
  expect(yearly.getAttribute("aria-pressed")).toBe("false");
  PLANS.forEach((p, i) => expect(price(i)).toBe(`$${p.monthly}`));
  fireEvent.click(yearly);
  expect(monthly.getAttribute("aria-pressed")).toBe("false");
  expect(yearly.getAttribute("aria-pressed")).toBe("true");
  PLANS.forEach((p, i) => expect(price(i)).toBe(`$${p.yearly}`));
});

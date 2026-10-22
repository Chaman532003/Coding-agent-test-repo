import { render, screen, fireEvent } from "@testing-library/react";
import Faq from "../components/landing/Faq.jsx";
import { FAQS } from "../data/landing.js";

test("AC-11 faq accordion", () => {
  const { container } = render(<Faq />);
  const section = container.querySelector("section#faq");
  expect(section.querySelector("h2").textContent).toBe("Frequently asked questions");
  const buttons = section.querySelectorAll("button");
  expect(buttons).toHaveLength(5);
  buttons.forEach((b) => expect(b.getAttribute("aria-expanded")).toBe("false"));
  fireEvent.click(buttons[0]);
  expect(buttons[0].getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByText(FAQS[0].a)).toBeTruthy();
  fireEvent.click(buttons[1]);
  expect(buttons[0].getAttribute("aria-expanded")).toBe("false");
  expect(buttons[1].getAttribute("aria-expanded")).toBe("true");
  expect(screen.getByText(FAQS[1].a)).toBeTruthy();
  expect(screen.queryByText(FAQS[0].a)).toBeNull();
});

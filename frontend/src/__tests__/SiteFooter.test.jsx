import { render, screen, within } from "@testing-library/react";
import SiteFooter from "../components/landing/SiteFooter.jsx";

test("AC-13 footer", () => {
  render(<SiteFooter />);
  const footer = screen.getByRole("contentinfo");
  for (const h of ["Product", "Company", "Support", "Legal"]) {
    expect(within(footer).getByRole("heading", { name: h })).toBeTruthy();
  }
  expect(within(footer).getAllByRole("link").length).toBeGreaterThanOrEqual(8);
  expect(footer.textContent).toContain(`${new Date().getFullYear()} E-Commerce Platform`);
});

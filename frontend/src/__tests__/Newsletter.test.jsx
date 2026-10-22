import { render, screen, fireEvent } from "@testing-library/react";
import Newsletter from "../components/landing/Newsletter.jsx";

function submit(value) {
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value } });
  fireEvent.click(screen.getByRole("button", { name: "Subscribe" }));
}

test("AC-12 invalid email", () => {
  render(<Newsletter />);
  submit("not-an-email");
  expect(screen.getByRole("alert").textContent).toBe("Enter a valid email address");
  expect(screen.queryByRole("status")).toBeNull();
});

test("AC-12 valid email", () => {
  render(<Newsletter />);
  submit("a@example.com");
  expect(screen.getByRole("status").textContent).toBe("Thanks for subscribing, a@example.com");
  expect(screen.queryByRole("alert")).toBeNull();
  expect(screen.getByLabelText("Email address").value).toBe("");
});

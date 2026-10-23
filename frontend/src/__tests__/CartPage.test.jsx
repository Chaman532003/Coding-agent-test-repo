import { render, screen } from "@testing-library/react";
import CartPage from "../pages/CartPage.jsx";
import { vi } from "vitest";

describe("CartPage", () => {
  it("shows empty cart message when cart is empty", () => {
    const cart = { items: [], total: 0, count: 0 };
    render(<CartPage cart={cart} onRemove={() => {}} />);
    expect(screen.getByText("Your cart is empty")).toBeDefined();
  });

  it("displays cart items and total", () => {
    const cart = {
      items: [
        {
          product_id: 1,
          name: "Laptop",
          price: 999.99,
          quantity: 1,
          line_total: 999.99,
        },
        {
          product_id: 2,
          name: "Mouse",
          price: 29.99,
          quantity: 1,
          line_total: 29.99,
        },
      ],
      total: 1029.98,
      count: 2,
    };
    render(<CartPage cart={cart} onRemove={() => {}} />);
    expect(screen.getByText("Laptop")).toBeDefined();
    expect(screen.getByText("Mouse")).toBeDefined();
    expect(screen.getByText(/Order total: \$1029.98/)).toBeDefined();
  });

  it("calls onRemove when Remove button is clicked", () => {
    const cart = {
      items: [
        {
          product_id: 1,
          name: "Laptop",
          price: 999.99,
          quantity: 1,
          line_total: 999.99,
        },
      ],
      total: 999.99,
      count: 1,
    };
    const onRemove = vi.fn();
    render(<CartPage cart={cart} onRemove={onRemove} />);
    const removeButton = screen.getByText("Remove");
    removeButton.click();
    expect(onRemove).toHaveBeenCalledWith(1);
  });
});

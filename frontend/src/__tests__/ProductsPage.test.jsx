import { render, screen, waitFor } from "@testing-library/react";
import ProductsPage from "../pages/ProductsPage.jsx";
import * as productsService from "../services/products.js";
import { vi } from "vitest";

vi.mock("../services/products.js");

describe("ProductsPage", () => {
  it("shows loading text while products are loading", () => {
    productsService.fetchProducts.mockResolvedValue([]);
    render(<ProductsPage onAdd={() => {}} />);
    expect(screen.getByText("Loading products")).toBeDefined();
  });

  it("displays products when loaded", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Laptop",
        price: 999.99,
        image_url: "http://example.com/laptop.jpg",
        description: "A great laptop",
      },
      {
        id: 2,
        name: "Mouse",
        price: 29.99,
        image_url: "http://example.com/mouse.jpg",
        description: "A good mouse",
      },
    ];
    productsService.fetchProducts.mockResolvedValue(mockProducts);
    render(<ProductsPage onAdd={() => {}} />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeDefined();
      expect(screen.getByText("Mouse")).toBeDefined();
    });
  });

  it("shows error message when API fails", async () => {
    productsService.fetchProducts.mockRejectedValue(new Error("API Error"));
    render(<ProductsPage onAdd={() => {}} />);

    await waitFor(() => {
      const alert = screen.getByRole("alert");
      expect(alert).toBeDefined();
      expect(alert.textContent).toContain("API Error");
    });
  });

  it("calls onAdd when Add to cart button is clicked", async () => {
    const mockProducts = [
      {
        id: 1,
        name: "Laptop",
        price: 999.99,
        image_url: "http://example.com/laptop.jpg",
        description: "A great laptop",
      },
    ];
    productsService.fetchProducts.mockResolvedValue(mockProducts);
    const onAdd = vi.fn();
    render(<ProductsPage onAdd={onAdd} />);

    await waitFor(() => {
      expect(screen.getByText("Laptop")).toBeDefined();
    });

    const button = screen.getByText("Add to cart");
    button.click();
    expect(onAdd).toHaveBeenCalledWith(1);
  });
});

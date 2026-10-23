import { render, screen, waitFor } from "@testing-library/react";
import App from "../App.jsx";
import * as sessionService from "../services/session.js";
import * as cartService from "../services/cart.js";
import { vi } from "vitest";

vi.mock("../services/session.js");
vi.mock("../services/cart.js");
vi.mock("../components/LandingPage.jsx", () => ({
  default: ({ onLogin }) => (
    <div>
      <button onClick={() => onLogin()}>Log in</button>
    </div>
  ),
}));

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("shows landing page when no token is stored", async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText("Log in")).toBeDefined();
    });
  });

  it("shows products page when token is valid", async () => {
    localStorage.setItem("token", "valid-token");
    sessionService.fetchUserProfile.mockResolvedValue({
      email: "test@example.com",
      name: "Test User",
    });
    cartService.fetchCart.mockResolvedValue({
      items: [],
      total: 0,
      count: 0,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("E-Commerce Platform")).toBeDefined();
    });
  });

  it("clears token and shows landing page when profile API rejects", async () => {
    localStorage.setItem("token", "invalid-token");
    sessionService.fetchUserProfile.mockRejectedValue(
      new Error("Not authenticated")
    );
    sessionService.clearToken.mockImplementation(() => {
      localStorage.removeItem("token");
    });

    render(<App />);

    await waitFor(() => {
      expect(sessionService.clearToken).toHaveBeenCalled();
      expect(screen.getByText("Log in")).toBeDefined();
    });
  });

  it("does not call profile API when no token is stored", async () => {
    render(<App />);

    await waitFor(() => {
      expect(sessionService.fetchUserProfile).not.toHaveBeenCalled();
    });
  });
});

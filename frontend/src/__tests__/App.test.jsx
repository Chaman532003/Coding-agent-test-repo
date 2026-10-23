import { render, screen, waitFor } from "@testing-library/react";
import App from "../App.jsx";
import * as sessionService from "../services/session.js";
import * as cartService from "../services/cart.js";
import { vi } from "vitest";

global.fetch = vi.fn();

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

  // AC-1: Shows welcome message with email when token exists and profile fetch succeeds
  it("AC-1: shows welcome message with email when token exists and profile API returns 200", async () => {
    localStorage.setItem("token", "abc");
    sessionService.fetchUserProfile.mockResolvedValue({
      email: "a@example.com",
    });
    cartService.fetchCart.mockResolvedValue({
      items: [],
      total: 0,
      count: 0,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Welcome, a@example\.com/)).toBeDefined();
    });
  });

  // AC-2: Fetch is called with correct headers
  it("AC-2: fetch is called with /api/me and Authorization header when token exists", async () => {
    localStorage.setItem("token", "abc");
    sessionService.fetchUserProfile.mockImplementation(async () => {
      const response = await global.fetch("/api/me", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer abc",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch");
      }
      return response.json();
    });
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ email: "a@example.com" }),
    });
    cartService.fetchCart.mockResolvedValue({
      items: [],
      total: 0,
      count: 0,
    });

    render(<App />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/me",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer abc",
          }),
        })
      );
    });
  });

  // AC-3: When fetch returns 401, token is cleared and landing page is shown
  it("AC-3: clears token and shows login button when profile API returns 401", async () => {
    localStorage.setItem("token", "bad");
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: () => Promise.resolve({ detail: "Unauthorized" }),
    });
    sessionService.clearToken.mockImplementation(() => {
      localStorage.removeItem("token");
    });

    render(<App />);

    await waitFor(() => {
      expect(sessionService.clearToken).toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBeNull();
      expect(screen.getByText("Log in")).toBeDefined();
    });
  });

  // AC-4: When no token exists, landing page is shown and fetch is not called
  it("AC-4: shows login button and does not call fetch when no token exists", async () => {
    render(<App />);

    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(screen.getByText("Log in")).toBeDefined();
    });
  });
});

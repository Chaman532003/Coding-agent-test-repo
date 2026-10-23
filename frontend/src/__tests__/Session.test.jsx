import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as sessionService from "../services/session.js";

global.fetch = vi.fn();

describe("Session Service", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("fetches user profile with token", async () => {
    localStorage.setItem("token", "test-token");
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ email: "test@example.com", name: "Test" }),
    });

    const profile = await sessionService.fetchUserProfile();

    expect(profile).toEqual({ email: "test@example.com", name: "Test" });
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/me",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer test-token",
        }),
      })
    );
  });

  it("gets stored token from localStorage", () => {
    localStorage.setItem("token", "test-token");
    expect(sessionService.getStoredToken()).toBe("test-token");
  });

  it("sets token in localStorage", () => {
    sessionService.setToken("new-token");
    expect(localStorage.getItem("token")).toBe("new-token");
  });

  it("clears token from localStorage", () => {
    localStorage.setItem("token", "test-token");
    sessionService.clearToken();
    expect(localStorage.getItem("token")).toBe(null);
  });
});

import { describe, it, expect, vi } from "vitest";
import { TypecallAdmin } from "../src/client";
import { AdminSdkError, AuthenticationError, NotFoundError } from "../src/errors";

describe("TypecallAdmin", () => {
  it("throws if apiKey is missing", () => {
    expect(() => new TypecallAdmin({ apiKey: "" })).toThrow(AdminSdkError);
  });

  it("attaches authorization header and parses JSON response", async () => {
    const mockData = { id: "test-123", name: "Org" };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const client = new TypecallAdmin({
      apiKey: "tc_test_key",
      fetch: mockFetch as unknown as typeof fetch,
    });

    const res = await client.request("/orgs/me");

    expect(res).toEqual(mockData);
    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.typecall.com/v1/orgs/me");
    expect(init.headers["Authorization"]).toBe("Bearer tc_test_key");
  });

  it("handles 401 AuthenticationError", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: async () => ({ message: "Invalid API key" }),
    });

    const client = new TypecallAdmin({
      apiKey: "tc_bad_key",
      fetch: mockFetch as unknown as typeof fetch,
    });

    await expect(client.request("/users")).rejects.toThrow(AuthenticationError);
  });

  it("handles 404 NotFoundError", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({ message: "Resource not found" }),
    });

    const client = new TypecallAdmin({
      apiKey: "tc_key",
      fetch: mockFetch as unknown as typeof fetch,
    });

    await expect(client.request("/unknown")).rejects.toThrow(NotFoundError);
  });
});

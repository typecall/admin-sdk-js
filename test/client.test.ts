import { describe, it, expect, vi } from "vitest";
import { TypecallAdmin } from "../src/client";
import {
  AdminSdkError,
  AuthenticationError,
  NotFoundError,
} from "../src/errors";

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

  it("supports initialization with no options and defaults to production", () => {
    const client = new TypecallAdmin();
    expect(client).toBeDefined();
    expect(client.account).toBeUndefined();
  });

  it("supports accessToken authentication and development environment", async () => {
    const mockData = { ok: true };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => mockData,
    });

    const client = new TypecallAdmin({
      accessToken: "tc_jwt_token",
      environment: "development",
      fetch: mockFetch as unknown as typeof fetch,
    });

    const res = await client.request("/test");
    expect(res).toEqual(mockData);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://api.typecall.dev/v1/test");
    expect(init.headers["Authorization"]).toBe("Bearer tc_jwt_token");
  });

  it("getAccount() succeeds with valid token, caches account and logs it", async () => {
    const mockAccount = {
      id: "acc-1",
      first_name: "Alice",
      last_name: "Smith",
      email: "alice@example.com",
      workspaces: [],
    };
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: mockAccount }),
    });

    const client = new TypecallAdmin({
      accessToken: "initial_token",
      fetch: mockFetch as unknown as typeof fetch,
    });

    const account = await client.getAccount();
    expect(account).toEqual(mockAccount);
    expect(client.account).toEqual(mockAccount);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://account.typecall.com/api/account");
    expect(init.headers["Authorization"]).toBe("Bearer initial_token");
  });

  it("getAccount() refreshes via cookie when no token provided initially", async () => {
    const mockAccount = {
      id: "acc-2",
      first_name: "Bob",
      last_name: "Jones",
      email: "bob@example.com",
      workspaces: [],
    };

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/api/tokens")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: { access_token: "refreshed_token" } }),
        };
      }
      if (url.includes("/api/account")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockAccount }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      fetch: mockFetch as unknown as typeof fetch,
    });

    const account = await client.getAccount();
    expect(account).toEqual(mockAccount);
    expect(client.account).toEqual(mockAccount);
    expect(client.getAccessToken()).toBe("refreshed_token");
  });

  it("getAccount() refreshes via cookie when initial token is expired (401)", async () => {
    const mockAccount = {
      id: "acc-3",
      first_name: "Carol",
      last_name: "White",
      email: "carol@example.com",
      workspaces: [],
    };

    let accountCallCount = 0;
    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/api/account")) {
        accountCallCount++;
        if (accountCallCount === 1) {
          return {
            ok: false,
            status: 401,
            statusText: "Unauthorized",
            text: async () => "Token expired",
          };
        }
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockAccount }),
        };
      }
      if (url.includes("/api/tokens")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: { access_token: "new_token" } }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "expired_token",
      fetch: mockFetch as unknown as typeof fetch,
    });

    const account = await client.getAccount();
    expect(account).toEqual(mockAccount);
    expect(client.getAccessToken()).toBe("new_token");
  });

  it("getAccount() throws AuthenticationError when refresh fails", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      text: async () => "No session",
    });

    const client = new TypecallAdmin({
      fetch: mockFetch as unknown as typeof fetch,
    });

    await expect(client.getAccount()).rejects.toThrow(AuthenticationError);
  });

  it("logout() revokes token and clears session state", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({}),
    });

    const client = new TypecallAdmin({
      accessToken: "token_to_revoke",
      fetch: mockFetch as unknown as typeof fetch,
    });

    await client.logout();
    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://account.typecall.com/api/tokens");
    expect(init.method).toBe("DELETE");
    expect(client.getAccessToken()).toBeUndefined();
    expect(client.account).toBeUndefined();
  });
});

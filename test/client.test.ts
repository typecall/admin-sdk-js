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
    expect(url).toBe("https://rest.typecall.com/orgs/me");
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
    expect(url).toBe("https://rest.typecall.dev/test");
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

  it("attaches workspace ID and authorization to workspace resource calls", async () => {
    const mockUsers = [{ id: "usr-1", first_name: "John", last_name: "Doe" }];
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: mockUsers }),
    });

    const client = new TypecallAdmin({
      accessToken: "user_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_123");

    const users = await client.users.listAll();
    expect(users).toEqual(mockUsers);

    const [url, init] = mockFetch.mock.calls[0];
    expect(url).toBe("https://rest.typecall.com/users");
    expect(init.headers["Authorization"]).toBe("Bearer user_jwt");
    expect(init.headers["X-Workspace-ID"]).toBe("ws_123");
  });

  it("automatically refreshes token on 401 during workspace resource calls", async () => {
    const mockUsers = [{ id: "usr-2", first_name: "Jane", last_name: "Doe" }];
    let userCallCount = 0;

    const mockFetch = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        if (url.includes("/api/tokens")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: { access_token: "refreshed_jwt" } }),
          };
        }
        if (url.includes("/users")) {
          userCallCount++;
          const auth = (init?.headers as Record<string, string>)?.[
            "Authorization"
          ];
          if (userCallCount === 1) {
            expect(auth).toBe("Bearer stale_jwt");
            return {
              ok: false,
              status: 401,
              statusText: "Unauthorized",
              text: async () => "Token expired",
            };
          }
          expect(auth).toBe("Bearer refreshed_jwt");
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: mockUsers }),
          };
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

    const client = new TypecallAdmin({
      accessToken: "stale_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_123");

    const users = await client.users.listAll();
    expect(users).toEqual(mockUsers);
    expect(userCallCount).toBe(2);
    expect(client.getAccessToken()).toBe("refreshed_jwt");
  });

  it("caches users and supports instant synchronous lookups and prefix search", async () => {
    const mockUsers = [
      {
        id: "usr-1",
        first_name: "Alice",
        last_name: "Smith",
        email: "alice@typecall.com",
        extension: "101",
      },
      {
        id: "usr-2",
        first_name: "Bob",
        last_name: "Jones",
        email: "bob@typecall.com",
        extension: "102",
      },
      {
        id: "usr-3",
        first_name: "Charlie",
        last_name: "Brown",
        email: "charlie@typecall.com",
        extension: "201",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/users")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockUsers }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.users.all()).toEqual([]);
    expect(client.users.find("usr-1")).toBeUndefined();
    expect(client.users.loaded).toBe(false);

    // Initial load: hits server
    const loaded = await client.users.listAll();
    expect(loaded).toEqual(mockUsers);
    expect(fetchCount).toBe(1);
    expect(client.users.loaded).toBe(true);

    // Subsequent listAll() without force: served from in-memory cache
    const cachedAll = await client.users.listAll();
    expect(cachedAll).toEqual(mockUsers);
    expect(fetchCount).toBe(1);

    // Synchronous lookups
    expect(client.users.all()).toEqual(mockUsers);
    expect(client.users.find("usr-1")).toEqual(mockUsers[0]);
    expect(client.users.getMany("usr-1", "usr-3")).toEqual([
      mockUsers[0],
      mockUsers[2],
    ]);

    // Prefix search on name
    expect(client.users.search("ali")).toEqual([mockUsers[0]]);
    // Prefix search on email
    expect(client.users.search("bob@")).toEqual([mockUsers[1]]);
    // Prefix search on extension
    expect(client.users.search("201")).toEqual([mockUsers[2]]);
    // Empty search returns all
    expect(client.users.search("")).toEqual(mockUsers);

    // Switching workspace clears the cache
    client.setWorkspaceId("ws_2");
    expect(client.users.loaded).toBe(false);
    expect(client.users.all()).toEqual([]);
    expect(client.users.find("usr-1")).toBeUndefined();
  });

  it("caches channels, filters public channels, and supports instant lookups and search", async () => {
    const mockChannels = [
      {
        id: "ch-1",
        name: "General",
        is_private: false,
      },
      {
        id: "ch-2",
        name: "Private Support",
        is_private: true,
      },
      {
        id: "ch-3",
        name: "Sales",
        is_private: false,
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/channels")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockChannels }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.channels.all()).toEqual([]);
    expect(client.channels.find("ch-1")).toBeUndefined();
    expect(client.channels.loaded).toBe(false);

    // Initial load: hits server
    const loaded = await client.channels.listAll();
    expect(loaded).toEqual(mockChannels);
    expect(fetchCount).toBe(1);
    expect(client.channels.loaded).toBe(true);

    // Cached lookups
    expect(client.channels.all()).toEqual(mockChannels);
    expect(client.channels.publicChannels()).toEqual([
      mockChannels[0],
      mockChannels[2],
    ]);
    expect(client.channels.find("ch-1")).toEqual(mockChannels[0]);

    // Prefix search on channel name
    expect(client.channels.search("gen")).toEqual([mockChannels[0]]);
    expect(client.channels.search("sal")).toEqual([mockChannels[2]]);
  });

  it("caches business hours and supports instant lookups and search", async () => {
    const mockBusinessHours = [
      {
        id: "bh-1",
        name: "Standard Office Hours",
        timezone: "Europe/London",
        is_scoped_by_period: false,
        schedule: {},
        holidays: [],
        exceptions: [],
      },
      {
        id: "bh-2",
        name: "Weekend Support",
        timezone: "America/New_York",
        is_scoped_by_period: true,
        schedule: {},
        holidays: [],
        exceptions: [],
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/business-hours")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockBusinessHours }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.businessHours.all()).toEqual([]);
    expect(client.businessHours.find("bh-1")).toBeUndefined();
    expect(client.businessHours.loaded).toBe(false);

    // Initial load: hits server
    const loaded = await client.businessHours.listAll();
    expect(loaded).toEqual(mockBusinessHours);
    expect(fetchCount).toBe(1);
    expect(client.businessHours.loaded).toBe(true);

    // Cached lookups
    expect(client.businessHours.all()).toEqual(mockBusinessHours);
    expect(client.businessHours.find("bh-1")).toEqual(mockBusinessHours[0]);
    expect(client.businessHours.getMany("bh-1", "bh-2")).toEqual(
      mockBusinessHours,
    );

    // Prefix search on name / timezone
    expect(client.businessHours.search("standard")).toEqual([
      mockBusinessHours[0],
    ]);
    expect(client.businessHours.search("york")).toEqual([mockBusinessHours[1]]);
    expect(client.businessHours.search("")).toEqual(mockBusinessHours);
  });
});

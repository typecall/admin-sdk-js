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

  it("caches phone numbers and supports instant lookups and search", async () => {
    const mockPhoneNumbers = [
      {
        id: "pn-1",
        workspace_id: "ws_1",
        name: "Main Line",
        country: "MT",
        range_start: "+35621000000",
        range_end: "+35621000000",
        capabilities: ["Voice"],
        sip_trunk_id: "trunk_1",
        range_exclusions: [],
        incoming_call_flow_graph: {},
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "pn-2",
        workspace_id: "ws_1",
        name: "Support Range",
        country: "UK",
        range_start: "+44207000000",
        range_end: "+44207000099",
        capabilities: ["Voice", "Sms"],
        sip_trunk_id: "trunk_1",
        range_exclusions: [],
        incoming_call_flow_graph: {},
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/phone-numbers")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockPhoneNumbers }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.phoneNumbers.all()).toEqual([]);
    expect(client.phoneNumbers.find("pn-1")).toBeUndefined();
    expect(client.phoneNumbers.loaded).toBe(false);

    // Initial load: hits server
    const loaded = await client.phoneNumbers.listAll();
    expect(loaded).toEqual(mockPhoneNumbers);
    expect(fetchCount).toBe(1);
    expect(client.phoneNumbers.loaded).toBe(true);

    // Cached lookups
    expect(client.phoneNumbers.all()).toEqual(mockPhoneNumbers);
    expect(client.phoneNumbers.find("pn-1")).toEqual(mockPhoneNumbers[0]);
    expect(client.phoneNumbers.getMany("pn-1", "pn-2")).toEqual(
      mockPhoneNumbers,
    );

    // Prefix search on name / range / country
    expect(client.phoneNumbers.search("main")).toEqual([mockPhoneNumbers[0]]);
    expect(client.phoneNumbers.search("35621000000")).toEqual([
      mockPhoneNumbers[0],
    ]);
    expect(client.phoneNumbers.search("uk")).toEqual([mockPhoneNumbers[1]]);
    expect(client.phoneNumbers.search("")).toEqual(mockPhoneNumbers);
  });

  it("caches phones and supports instant lookups and search", async () => {
    const mockPhones = [
      {
        id: "ph-1",
        workspace_id: "ws_1",
        name: "Reception Desk",
        model: "SnomD140",
        serial_number: "SN123456",
        mac_address: "00:04:13:aa:bb:cc",
        location: "MT",
        lines: [],
        is_cloud_managed: true,
        sbc_primary: "sbc1.example.com",
        sbc_secondary: "sbc2.example.com",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "ph-2",
        workspace_id: "ws_1",
        name: "Conference Room",
        model: "YealinkSipT48u",
        serial_number: "SN789012",
        mac_address: "00:15:65:dd:ee:ff",
        location: "UK",
        lines: [],
        is_cloud_managed: false,
        sbc_primary: "sbc1.example.com",
        sbc_secondary: "sbc2.example.com",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/phones")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockPhones }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.phones.all()).toEqual([]);
    expect(client.phones.find("ph-1")).toBeUndefined();
    expect(client.phones.loaded).toBe(false);

    // Initial load: hits server
    const loaded = await client.phones.listAll();
    expect(loaded).toEqual(mockPhones);
    expect(fetchCount).toBe(1);
    expect(client.phones.loaded).toBe(true);

    // Cached lookups
    expect(client.phones.all()).toEqual(mockPhones);
    expect(client.phones.find("ph-1")).toEqual(mockPhones[0]);
    expect(client.phones.getMany("ph-1", "ph-2")).toEqual(mockPhones);

    // Prefix search on name / model / serial / mac / location
    expect(client.phones.search("reception")).toEqual([mockPhones[0]]);
    expect(client.phones.search("snomd140")).toEqual([mockPhones[0]]);
    expect(client.phones.search("000413aabbcc")).toEqual([mockPhones[0]]);
    expect(client.phones.search("conference")).toEqual([mockPhones[1]]);
    expect(client.phones.search("uk")).toEqual([mockPhones[1]]);
    expect(client.phones.search("")).toEqual(mockPhones);
  });

  it("caches tags and supports instant lookups and search", async () => {
    const mockTags = [
      {
        id: "tag-1",
        workspace_id: "ws_1",
        name: "Support VIP",
        color: "#3B82F6",
        scopes: ["Flow"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "tag-2",
        workspace_id: "ws_1",
        name: "Sales Inbound",
        color: "#10B981",
        scopes: ["CallScreen", "Contact"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/tags")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockTags }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.tags.all()).toEqual([]);
    expect(client.tags.find("tag-1")).toBeUndefined();
    expect(client.tags.loaded).toBe(false);

    const loaded = await client.tags.listAll();
    expect(loaded).toEqual(mockTags);
    expect(fetchCount).toBe(1);
    expect(client.tags.loaded).toBe(true);

    expect(client.tags.all()).toEqual(mockTags);
    expect(client.tags.find("tag-1")).toEqual(mockTags[0]);
    expect(client.tags.search("vip")).toEqual([mockTags[0]]);
    expect(client.tags.search("sales")).toEqual([mockTags[1]]);
  });

  it("caches domains and supports instant lookups and search", async () => {
    const mockDomains = [
      {
        id: "dom-1",
        workspace_id: "ws_1",
        domain: "example.com",
        verified_at: "2026-01-01T00:00:00Z",
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
      {
        id: "dom-2",
        workspace_id: "ws_1",
        domain: "acme.org",
        verified_at: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/domains")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockDomains }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.domains.all()).toEqual([]);
    expect(client.domains.loaded).toBe(false);

    const loaded = await client.domains.listAll();
    expect(loaded).toEqual(mockDomains);
    expect(fetchCount).toBe(1);
    expect(client.domains.loaded).toBe(true);

    expect(client.domains.find("dom-1")).toEqual(mockDomains[0]);
    expect(client.domains.search("example")).toEqual([mockDomains[0]]);
    expect(client.domains.search("acme")).toEqual([mockDomains[1]]);
  });

  it("caches channel numbers and supports instant lookups and search", async () => {
    const mockChannelNumbers = [
      {
        id: "cn-1",
        workspace_id: "ws_1",
        phone_number_id: "pn-1",
        channel_id: "ch-1",
        cid: "+35621000000",
        name: "Main Line",
        country: "MT",
        label: "Office",
        user_id: null,
        priority: 1,
        is_exclusive: false,
        capabilities: ["Voice"],
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/channel-numbers")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockChannelNumbers }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.channelNumbers.all()).toEqual([]);
    expect(client.channelNumbers.loaded).toBe(false);

    const loaded = await client.channelNumbers.listAll();
    expect(loaded).toEqual(mockChannelNumbers);
    expect(fetchCount).toBe(1);
    expect(client.channelNumbers.loaded).toBe(true);

    expect(client.channelNumbers.find("cn-1")).toEqual(mockChannelNumbers[0]);
    expect(client.channelNumbers.search("35621000000")).toEqual([
      mockChannelNumbers[0],
    ]);
  });

  it("caches invoices and supports instant lookups, search, and download", async () => {
    const mockInvoices = [
      {
        id: "inv-1",
        number: "INV-2026-001",
        issue_date: "2026-01-01",
        due_date: "2026-01-15",
        currency: "EUR",
        total: "150.00",
        balance: "0.00",
        status: "Paid",
      },
      {
        id: "inv-2",
        number: "INV-2026-002",
        issue_date: "2026-02-01",
        due_date: "2026-02-15",
        currency: "EUR",
        total: "200.00",
        balance: "200.00",
        status: "Unpaid",
      },
    ];
    let fetchCount = 0;

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/invoices/inv-1/download")) {
        return {
          ok: true,
          status: 200,
          blob: async () => new Blob(["pdf-content"]),
        };
      }
      if (url.includes("/invoices")) {
        fetchCount++;
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockInvoices }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    expect(client.invoices.all()).toEqual([]);
    expect(client.invoices.loaded).toBe(false);

    const loaded = await client.invoices.load();
    expect(loaded).toEqual(mockInvoices);
    expect(fetchCount).toBe(1);
    expect(client.invoices.loaded).toBe(true);

    expect(client.invoices.find("inv-1")).toEqual(mockInvoices[0]);
    expect(client.invoices.search("002")).toEqual([mockInvoices[1]]);
    expect(client.invoices.search("Paid")).toEqual([mockInvoices[0]]);

    const blob = await client.invoices.download("inv-1");
    expect(blob).toBeInstanceOf(Blob);
  });

  it("caches payment methods and supports primary card updates and deletion", async () => {
    const mockCards = [
      {
        id: "pm-1",
        last_four: "4242",
        last_four_digits: "4242",
        status: "Active",
        expiry_month: 12,
        expiry_year: 2028,
        is_primary: true,
      },
      {
        id: "pm-2",
        last_four: "1234",
        last_four_digits: "1234",
        status: "Active",
        expiry_month: 6,
        expiry_year: 2027,
        is_primary: false,
      },
    ];

    const mockFetch = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        if (
          url.includes("/payment-methods/pm-2/set-as-primary") &&
          init?.method === "POST"
        ) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              data: { ...mockCards[1], is_primary: true },
            }),
          };
        }
        if (
          url.includes("/payment-methods/pm-1") &&
          init?.method === "DELETE"
        ) {
          return {
            ok: true,
            status: 204,
          };
        }
        if (url.includes("/payment-methods")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: [...mockCards] }),
          };
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    await client.paymentMethods.load();
    expect(client.paymentMethods.all()).toHaveLength(2);
    expect(client.paymentMethods.search("1234")).toEqual([mockCards[1]]);

    await client.paymentMethods.setAsPrimary("pm-2");
    expect(client.paymentMethods.find("pm-1")?.is_primary).toBe(false);
    expect(client.paymentMethods.find("pm-2")?.is_primary).toBe(true);

    await client.paymentMethods.delete("pm-1");
    expect(client.paymentMethods.find("pm-1")).toBeUndefined();
    expect(client.paymentMethods.all()).toHaveLength(1);
  });

  it("caches subscription and workspace profile", async () => {
    const mockSub = {
      id: "sub-1",
      number: "SUB-100",
      status: "Active",
      interval: 1,
      interval_unit: "Month",
      trial_days_remaining: 0,
      currency: "EUR",
      plan: { code: "pro", seats: 5 },
      addons: [],
      taxes: [],
      total: "99.00",
    };

    const mockProfile = {
      id: "ws-1",
      name: "Acme Corp",
      status: "active",
      currency: "EUR",
    };

    let subFetches = 0;
    let wsFetches = 0;

    const mockFetch = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        if (url.includes("/subscription")) {
          subFetches++;
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: mockSub }),
          };
        }
        if (url.includes("/workspace") && init?.method === "PATCH") {
          const body = JSON.parse(init.body as string);
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: { ...mockProfile, ...body } }),
          };
        }
        if (url.includes("/workspace")) {
          wsFetches++;
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: mockProfile }),
          };
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    const sub = await client.subscriptions.load();
    expect(sub).toEqual(mockSub);
    expect(client.subscriptions.current()).toEqual(mockSub);
    // Cached call should not fetch again
    await client.subscriptions.get();
    expect(subFetches).toBe(1);

    const ws = await client.workspace.load();
    expect(ws).toEqual(mockProfile);
    expect(client.workspace.current()).toEqual(mockProfile);
    // Cached call should not fetch again
    await client.workspace.get();
    expect(wsFetches).toBe(1);

    const updated = await client.workspace.update({ name: "Acme Worldwide" });
    expect(updated.name).toBe("Acme Worldwide");
    expect(client.workspace.current()?.name).toBe("Acme Worldwide");
  });

  it("caches voices and supports search, voiceAgents filtering, and synthesis", async () => {
    const mockVoices = [
      {
        id: "v-1",
        name: "Ava",
        language_code: "en-US",
        gender: "Female",
        scope: "VoiceAgent",
        provider: "ElevenLabs",
        provider_id: "ava-1",
      },
      {
        id: "v-2",
        name: "Brian",
        language_code: "en-GB",
        gender: "Male",
        scope: "Tts",
        provider: "Aws",
        provider_id: "brian-1",
      },
    ];

    const mockFetch = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        if (
          url.includes("/voices/v-1/tts/synthesize") &&
          init?.method === "POST"
        ) {
          return {
            ok: true,
            status: 200,
            blob: async () => new Blob(["audio-bytes"]),
          };
        }
        if (url.includes("/voices")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: mockVoices }),
          };
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    await client.voices.load();
    expect(client.voices.all()).toHaveLength(2);
    expect(client.voices.find("v-1")).toEqual(mockVoices[0]);
    expect(client.voices.search("Ava")).toEqual([mockVoices[0]]);
    expect(client.voices.voiceAgents()).toEqual([mockVoices[0]]);

    const blob = await client.voices.synthesize("v-1", "<speak>Hello</speak>");
    expect(blob).toBeInstanceOf(Blob);
  });

  it("caches prompts and supports search, creation, update, and deletion", async () => {
    const mockPrompts = [
      {
        id: "pr-1",
        entity_id: "phone-1",
        name: "Welcome Prompt",
        scope: "call-flow",
        default_track_id: "tr-1",
        tracks: {
          en: {
            id: "tr-1",
            category: "tts",
            duration_ms: 1200,
            path: "/path/to/audio.wav",
          },
        },
      },
    ];

    const mockFetch = vi
      .fn()
      .mockImplementation(async (url: string, init?: RequestInit) => {
        if (url.includes("/prompts/pr-1") && init?.method === "PATCH") {
          const body = JSON.parse(init.body as string);
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: { ...mockPrompts[0], ...body } }),
          };
        }
        if (url.includes("/prompts/pr-1") && init?.method === "DELETE") {
          return {
            ok: true,
            status: 204,
          };
        }
        if (url.includes("/prompts") && init?.method === "POST") {
          const body = JSON.parse(init.body as string);
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: { id: "pr-2", ...body } }),
          };
        }
        if (url.includes("/prompts")) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ data: [...mockPrompts] }),
          };
        }
        throw new Error(`Unexpected URL: ${url}`);
      });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    await client.prompts.load();
    expect(client.prompts.all()).toHaveLength(1);
    expect(client.prompts.search("Welcome")).toEqual([mockPrompts[0]]);

    const created = await client.prompts.create({
      name: "Voicemail Prompt",
      entity_id: "phone-1",
      tracks: {},
    });
    expect(created.id).toBe("pr-2");
    expect(client.prompts.find("pr-2")).toBeDefined();

    const updated = await client.prompts.update("pr-1", {
      name: "Updated Welcome Prompt",
    });
    expect(updated.name).toBe("Updated Welcome Prompt");
    expect(client.prompts.find("pr-1")?.name).toBe("Updated Welcome Prompt");

    await client.prompts.delete("pr-1");
    expect(client.prompts.find("pr-1")).toBeUndefined();
  });

  it("supports file upload links, S3 direct uploads, and track helpers", async () => {
    const s3Url = "https://s3.amazonaws.com/typecall-bucket/upload-test.wav";
    let s3Uploaded = false;

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation(async (url: any, init?: RequestInit) => {
        if (String(url) === s3Url && init?.method === "PUT") {
          s3Uploaded = true;
          return {
            ok: true,
            status: 200,
          } as Response;
        }
        return {
          ok: false,
          status: 404,
          statusText: "Not Found",
        } as Response;
      });

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/files/link/upload")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            data: { url: s3Url, path: "tracks/upload-test.wav" },
          }),
        };
      }
      if (url.includes("/files/link/download")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            data: { url: "https://cdn.typecall.com/tracks/download-test.wav" },
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    const dl = await client.files.getDownloadLink("tracks/download-test.wav");
    expect(dl.url).toBe("https://cdn.typecall.com/tracks/download-test.wav");

    const trackFile = new File(["audio-content"], "test.wav", {
      type: "audio/wav",
    });
    const trackResult = await client.files.uploadTrack(trackFile, "entity-123");
    expect(trackResult.name).toBe("test.wav");
    expect(trackResult.path).toBe("tracks/upload-test.wav");
    expect(s3Uploaded).toBe(true);

    fetchSpy.mockRestore();
  });

  it("supports listing call logs and events with query filters and fallback", async () => {
    const mockLogs = [
      {
        id: "cl-1",
        src_handle: "tel:+1234567890",
        dst_handle: "usr:user_1",
        originated_at: "2026-09-28T12:00:00Z",
        category: "direct",
        status: "answered",
      },
    ];

    const mockEvents = [
      {
        id: "ev-1",
        payload_type: "CallStarted",
        occurred_at: "2026-09-28T12:00:00Z",
        position: 1,
      },
    ];

    const mockFetch = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes("/analytics/call-logs/cl-1/events")) {
        return {
          ok: true,
          status: 200,
          json: async () => ({ data: mockEvents }),
        };
      }
      if (url.includes("/analytics/call-logs")) {
        expect(url).toContain("user_id%5B%5D=usr_1");
        return {
          ok: true,
          status: 200,
          json: async () => ({
            data: mockLogs,
            meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 },
          }),
        };
      }
      throw new Error(`Unexpected URL: ${url}`);
    });

    const client = new TypecallAdmin({
      accessToken: "test_jwt",
      fetch: mockFetch as unknown as typeof fetch,
    });
    client.setWorkspaceId("ws_1");

    const res = await client.analytics.listCallLogs({
      user_id: ["usr_1"],
      page: 1,
    });
    expect(res.data).toHaveLength(1);
    expect(res.data[0].id).toBe("cl-1");

    const events = await client.analytics.listCallEvents("cl-1");
    expect(events).toEqual(mockEvents);
  });
});

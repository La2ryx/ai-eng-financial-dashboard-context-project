import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildAlertsUrl,
  buildMovementsUrl,
  fetchAlerts,
  fetchFacets,
  fetchMovements,
  isValidDateRange,
} from "./dashboard-api";

const range = { startDate: "2026-01-10", endDate: "2026-03-31" };

afterEach(() => vi.unstubAllGlobals());

describe("dashboard API helpers", () => {
  it("accepts valid inclusive date ranges and rejects malformed or reversed dates", () => {
    expect(isValidDateRange(range)).toBe(true);
    expect(isValidDateRange({ startDate: "2026-02-30", endDate: "2026-03-31" })).toBe(false);
    expect(isValidDateRange({ startDate: "2026/01/10", endDate: "2026-03-31" })).toBe(false);
    expect(isValidDateRange({ startDate: "2026-04-01", endDate: "2026-03-31" })).toBe(false);
  });

  it("uses the all-business movements route without an unsupported business_type query", () => {
    const url = new URL(buildMovementsUrl(range, null), "http://localhost");
    expect(url.pathname).toBe("/api/metrics");
    expect(url.searchParams.get("start_date")).toBe(range.startDate);
    expect(url.searchParams.get("end_date")).toBe(range.endDate);
    expect(url.searchParams.has("business_type")).toBe(false);
  });

  it.each(["B2B", "B2C"] as const)("uses the dedicated %s movement route", (type) => {
    const url = new URL(buildMovementsUrl(range, type), "http://localhost");
    expect(url.pathname).toBe(`/api/metrics/${type.toLowerCase()}`);
    expect(url.searchParams.has("business_type")).toBe(false);
  });

  it("applies the same period and business type to monthly alerts", () => {
    const url = new URL(buildAlertsUrl(range, "B2C"), "http://localhost");
    expect(url.pathname).toBe("/api/metrics/alerts");
    expect(url.searchParams.get("group_by")).toBe("month");
    expect(url.searchParams.get("threshold")).toBe("0.3");
    expect(url.searchParams.get("start_date")).toBe(range.startDate);
    expect(url.searchParams.get("end_date")).toBe(range.endDate);
    expect(url.searchParams.get("business_type")).toBe("B2C");
  });

  it("loads facets, movements, and alerts from their requested endpoints", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchFacets();
    await fetchMovements(range, "B2B");
    await fetchAlerts(range, null);

    expect(fetchMock.mock.calls.map(([url]) => new URL(String(url), "http://localhost").pathname)).toEqual([
      "/api/metrics/facets",
      "/api/metrics/b2b",
      "/api/metrics/alerts",
    ]);
  });

  it("surfaces unsuccessful API responses", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchFacets()).rejects.toThrow("503");
  });
});

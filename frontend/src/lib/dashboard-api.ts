import type {
  BusinessType,
  FinancialMovement,
  MetricsAlert,
  MetricsFacets,
} from "./financial-types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export interface DateRange {
  startDate: string;
  endDate: string;
}

export function isValidDateRange(range: DateRange): boolean {
  const isValidDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  };

  return (
    isValidDate(range.startDate) &&
    isValidDate(range.endDate) &&
    range.startDate <= range.endDate
  );
}

function addDateRange(params: URLSearchParams, range: DateRange): void {
  params.set("start_date", range.startDate);
  params.set("end_date", range.endDate);
}

export function buildMovementsUrl(
  range: DateRange,
  businessType: BusinessType | null,
): string {
  const params = new URLSearchParams();
  addDateRange(params, range);
  const route = businessType ? `/api/metrics/${businessType.toLowerCase()}` : "/api/metrics";
  return `${API_BASE_URL}${route}?${params.toString()}`;
}

export function buildAlertsUrl(
  range: DateRange,
  businessType: BusinessType | null,
): string {
  const params = new URLSearchParams({ group_by: "month", threshold: "0.3" });
  addDateRange(params, range);
  if (businessType) params.set("business_type", businessType);
  return `${API_BASE_URL}/api/metrics/alerts?${params.toString()}`;
}

async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export function fetchFacets(): Promise<MetricsFacets> {
  return getJson(`${API_BASE_URL}/api/metrics/facets`);
}

export function fetchMovements(
  range: DateRange,
  businessType: BusinessType | null,
): Promise<FinancialMovement[]> {
  return getJson(buildMovementsUrl(range, businessType));
}

export function fetchAlerts(
  range: DateRange,
  businessType: BusinessType | null,
): Promise<MetricsAlert[]> {
  return getJson(buildAlertsUrl(range, businessType));
}

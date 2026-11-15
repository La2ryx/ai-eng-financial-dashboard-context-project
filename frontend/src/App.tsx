import { lazy, Suspense, useEffect, useState } from "react";
import { AlertsTable } from "@/components/dashboard/alerts-table";
import { DateBusinessFilters } from "@/components/dashboard/date-business-filters";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { fetchAlerts, fetchFacets, fetchMovements, isValidDateRange, type DateRange } from "@/lib/dashboard-api";
import {
  type BusinessType,
  type FinancialMovement,
  type KPIMetrics,
  type MetricsAlert,
  type MetricsFacets,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import { computeKPIs, computeMonthlyData } from "@/lib/financial-utils";

const IncomeOutcomeChart = lazy(() =>
  import("@/components/dashboard/income-outcome-chart").then((module) => ({
    default: module.IncomeOutcomeChart,
  })),
);
const ProfitPercentChart = lazy(() =>
  import("@/components/dashboard/profit-percent-chart").then((module) => ({
    default: module.ProfitPercentChart,
  })),
);

function formatDate(value: string): string {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function App() {
  const [facets, setFacets] = useState<MetricsFacets | null>(null);
  const [draftRange, setDraftRange] = useState<DateRange>({ startDate: "", endDate: "" });
  const [draftBusinessType, setDraftBusinessType] = useState<BusinessType | null>(null);
  const [appliedRange, setAppliedRange] = useState<DateRange | null>(null);
  const [appliedBusinessType, setAppliedBusinessType] = useState<BusinessType | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [hasNoMovements, setHasNoMovements] = useState(false);
  const [alerts, setAlerts] = useState<MetricsAlert[]>([]);
  const [facetsLoading, setFacetsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(true);
  const [filterRevision, setFilterRevision] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [alertsError, setAlertsError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchFacets()
      .then((result) => {
        if (!active) return;
        setFacets(result);
        const range = { startDate: result.min_date, endDate: result.max_date };
        setDraftRange(range);
        setAppliedRange(range);
        setLoading(true);
        setAlertsLoading(true);
      })
      .catch(() => {
        if (active) {
          setError("Unable to load available date range from the API.");
          setLoading(false);
          setAlertsLoading(false);
        }
      })
      .finally(() => {
        if (active) setFacetsLoading(false);
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!appliedRange) return;
    let active = true;

    fetchMovements(appliedRange, appliedBusinessType)
      .then((movements: FinancialMovement[]) => {
        if (!active) return;
        setHasNoMovements(movements.length === 0);
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        if (active) setError("Unable to load financial data. Check the backend API and try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    fetchAlerts(appliedRange, appliedBusinessType)
      .then((result) => { if (active) setAlerts(result); })
      .catch(() => { if (active) setAlertsError("Unable to load alerts. Please try again."); })
      .finally(() => { if (active) setAlertsLoading(false); });

    return () => { active = false; };
  }, [appliedRange, appliedBusinessType, filterRevision]);

  function applyFilters() {
    if (!isValidDateRange(draftRange)) {
      setValidationMessage("Enter valid dates and make sure the start date is on or before the end date.");
      return;
    }
    setValidationMessage(null);
    setLoading(true);
    setAlertsLoading(true);
    setError(null);
    setAlertsError(null);
    setMetrics(null);
    setMonthlyData([]);
    setAlerts([]);
    setAppliedRange({ ...draftRange });
    setAppliedBusinessType(draftBusinessType);
    setFilterRevision((revision) => revision + 1);
  }

  const period = appliedRange
    ? `${formatDate(appliedRange.startDate)} – ${formatDate(appliedRange.endDate)}${appliedBusinessType ? ` · ${appliedBusinessType}` : " · All business"}`
    : "Loading available period…";

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period={period} />

          <p className="sr-only" role="status" aria-live="polite">
            {facetsLoading ? "Loading available date range." : loading ? "Loading financial dashboard data." : ""}
          </p>

          {facets ? (
            <DateBusinessFilters
              range={draftRange}
              businessType={draftBusinessType}
              minDate={facets.min_date}
              maxDate={facets.max_date}
              validationMessage={validationMessage}
              onRangeChange={setDraftRange}
              onBusinessTypeChange={setDraftBusinessType}
              onApply={applyFilters}
            />
          ) : null}

          {error ? (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground"
            >
              {error}
            </div>
          ) : null}

          {hasNoMovements && !loading && !error ? (
            <p className="rounded-lg border border-border/60 p-4 text-sm text-muted-foreground" role="status">
              No financial movements were found for this selection.
            </p>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <Suspense
              fallback={
                <div
                  role="status"
                  className="flex h-[360px] items-center justify-center rounded-lg border border-border/60 text-sm text-muted-foreground"
                >
                  Loading charts…
                </div>
              }
            >
              <IncomeOutcomeChart data={monthlyData} loading={loading} />
              <ProfitPercentChart data={monthlyData} loading={loading} />
            </Suspense>
          </section>

          <section aria-label="Financial alerts">
            <AlertsTable alerts={alerts} loading={alertsLoading} error={alertsError} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;

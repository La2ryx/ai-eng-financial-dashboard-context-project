import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { KPIRow } from "@/components/dashboard/kpi-row";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import {
  type FinancialMovement,
  type KPIMetrics,
  type MonthlyDataPoint,
} from "@/lib/financial-types";
import {
  buildDateRangeQuery,
  computeKPIs,
  computeMonthlyData,
} from "@/lib/financial-utils";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

async function fetchFinancialData(
  startDate: string | null,
  endDate: string | null,
): Promise<FinancialMovement[]> {
  const query = buildDateRangeQuery(startDate, endDate);
  const searchParams = new URLSearchParams(query);
  const response = await fetch(`${API_BASE_URL}/api/metrics?${searchParams}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch financial data: ${response.status}`);
  }

  return response.json();
}

function App() {
  const [metrics, setMetrics] = useState<KPIMetrics | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  useEffect(() => {
    setLoading(true);
    fetchFinancialData(startDate, endDate)
      .then((movements) => {
        setMetrics(computeKPIs(movements));
        setMonthlyData(computeMonthlyData(movements));
      })
      .catch(() => {
        setError(
          "No se pudo cargar la informacion financiera. Revisa la API de backend.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [startDate, endDate]);

  const periodLabel =
    startDate || endDate
      ? `${startDate || "Start"} → ${endDate || "End"}`
      : "2024 - Full Year";

  return (
    <main className="dark min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8">
          <DashboardHeader period={periodLabel} />

          <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-end">
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              Start date
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-0"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              End date
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="rounded-md border border-border bg-background px-3 py-2 text-foreground outline-none ring-0"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                setStartDate("");
                setEndDate("");
              }}
              className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80"
            >
              Reset
            </button>
          </div>

          {error ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive-foreground">
              {error}
            </div>
          ) : null}

          <section aria-label="Key performance indicators">
            <KPIRow metrics={metrics} loading={loading} />
          </section>

          <section
            aria-label="Financial charts"
            className="grid grid-cols-1 gap-4 xl:grid-cols-2"
          >
            <IncomeOutcomeChart data={monthlyData} loading={loading} />
            <ProfitPercentChart data={monthlyData} loading={loading} />
          </section>
        </div>
      </div>
    </main>
  );
}

export default App;

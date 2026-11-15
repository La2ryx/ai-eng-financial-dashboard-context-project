import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/financial-utils";
import type { MetricsAlert } from "@/lib/financial-types";

interface AlertsTableProps {
  alerts: MetricsAlert[];
  loading: boolean;
  error: string | null;
}

export function AlertsTable({ alerts, loading, error }: AlertsTableProps) {
  return (
    <Card className="border-border/60">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Unusual outcome increases</CardTitle>
        <CardDescription>
          Outcome totals more than 30% above the average of preceding periods. The first period has no baseline.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground" role="status">Loading alerts…</p>
        ) : error ? (
          <p className="py-8 text-center text-sm text-destructive" role="alert">{error}</p>
        ) : alerts.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No periods exceeded the alert threshold for this selection.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="sr-only">Monthly outcome alerts, including actual totals, historical baseline, and percentage increase</caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="px-3 py-3">Period</th>
                  <th scope="col" className="px-3 py-3 text-right">Outcome total</th>
                  <th scope="col" className="px-3 py-3 text-right">Baseline average</th>
                  <th scope="col" className="px-3 py-3 text-right">Increase</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert) => (
                  <tr key={alert.period} className="border-b border-border/50 last:border-0">
                    <th scope="row" className="px-3 py-3 font-medium">{alert.period}</th>
                    <td className="px-3 py-3 text-right tabular-nums">{formatCurrency(alert.outcome_total)}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{formatCurrency(alert.baseline_average)}</td>
                    <td className="px-3 py-3 text-right font-semibold tabular-nums">{(alert.increase_ratio * 100).toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

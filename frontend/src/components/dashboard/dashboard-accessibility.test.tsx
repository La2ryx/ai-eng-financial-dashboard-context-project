import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { IncomeOutcomeChart } from './income-outcome-chart'
import { AlertsTable } from './alerts-table'
import { DateBusinessFilters } from './date-business-filters'
import { KPIRow } from './kpi-row'
import { ProfitPercentChart } from './profit-percent-chart'
import type { KPIMetrics, MonthlyDataPoint } from '@/lib/financial-types'

const metrics: KPIMetrics = {
  totalIncome: 1200,
  totalOutcome: 300,
  profit: 900,
  profitPercent: 75,
}

const monthlyData: MonthlyDataPoint[] = [
  { month: 'Jan 2026', income: 1200, outcome: 300, profitPercent: 75 },
]

describe('dashboard accessibility', () => {
  it('gives KPI values an accessible group name', () => {
    const markup = renderToStaticMarkup(<KPIRow metrics={metrics} />)

    expect(markup).toContain('role="group"')
    expect(markup).toContain('aria-label="Financial key performance indicators"')
    expect(markup).toContain('Total Income')
    expect(markup).toContain('Profit Margin')
  })

  it('provides a labeled income/outcome chart and semantic data table', () => {
    const markup = renderToStaticMarkup(
      <IncomeOutcomeChart data={monthlyData} />,
    )

    expect(markup).toContain('Monthly income and outcome chart. A data table follows.')
    expect(markup).toContain('<caption>Monthly income and outcome values</caption>')
    expect(markup).toContain('<th scope="col">Income</th>')
    expect(markup).toContain('<td>$1,200</td>')
  })

  it('provides a labeled profit chart and semantic data table', () => {
    const markup = renderToStaticMarkup(<ProfitPercentChart data={monthlyData} />)

    expect(markup).toContain('Monthly profit margin chart. A data table follows.')
    expect(markup).toContain('<caption>Monthly profit margin values</caption>')
    expect(markup).toContain('<th scope="col">Profit margin</th>')
    expect(markup).toContain('<td>75.0%</td>')
  })

  it('renders alert data with accessible table headers and percentage conversion', () => {
    const markup = renderToStaticMarkup(
      <AlertsTable
        loading={false}
        error={null}
        alerts={[{
          period: '2026-02',
          outcome_total: 1500,
          baseline_average: 1000,
          increase_ratio: 0.5,
        }]}
      />,
    )

    expect(markup).toContain('<caption class="sr-only">Monthly outcome alerts')
    expect(markup).toContain('<th scope="col"')
    expect(markup).toContain('Outcome total')
    expect(markup).toContain('$1,500')
    expect(markup).toContain('50.0%')
  })

  it('distinguishes empty, loading, and error states for alerts', () => {
    expect(renderToStaticMarkup(<AlertsTable alerts={[]} loading error={null} />)).toContain('Loading alerts')
    expect(renderToStaticMarkup(<AlertsTable alerts={[]} loading={false} error={null} />)).toContain('No periods exceeded')
    expect(renderToStaticMarkup(<AlertsTable alerts={[]} loading={false} error="API unavailable" />)).toContain('role="alert"')
  })

  it('renders associated date and business filter labels with keyboard-focus styling', () => {
    const markup = renderToStaticMarkup(
      <DateBusinessFilters
        range={{ startDate: '2026-01-01', endDate: '2026-12-31' }}
        businessType={null}
        minDate="2026-01-01"
        maxDate="2026-12-31"
        validationMessage="Invalid range"
        onRangeChange={() => {}}
        onBusinessTypeChange={() => {}}
        onApply={() => {}}
      />,
    )

    expect(markup).toContain('for="start-date"')
    expect(markup).toContain('for="end-date"')
    expect(markup).toContain('for="business-type"')
    expect(markup).toContain('aria-describedby="date-range-error"')
    expect(markup).toContain('focus-visible:ring-2')
  })
})

import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { IncomeOutcomeChart } from './income-outcome-chart'
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
})

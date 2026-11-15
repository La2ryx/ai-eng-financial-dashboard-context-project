/**
 * API response contracts for a future dashboard-spec implementation.
 *
 * These types mirror the FastAPI response models in backend/app/routes.py.
 * They are specification artifacts only and are not imported by the live app.
 */

export type OperationType = "income" | "outcome";

export type Category =
  | "suppliers"
  | "sales"
  | "operational"
  | "administrative"
  | "others";

export type BusinessType = "B2B" | "B2C";

export type GroupBy = "day" | "week" | "month";

/** JSON serialization of Python's date value: YYYY-MM-DD. */
export type ApiDate = string;

export interface FinancialMovement {
  create_date: ApiDate;
  amount: number;
  operation_type: OperationType;
  category: Category;
  business_type: BusinessType;
}

export interface MetricsFacets {
  operation_types: OperationType[];
  business_types: BusinessType[];
  categories: Category[];
  min_date: ApiDate;
  max_date: ApiDate;
}

export interface MetricsSummaryItem {
  /** ISO date for day, ISO week key for week, or YYYY-MM for month. */
  period: string;
  income: number;
  outcome: number;
  net: number;
}

export interface TopCategoryItem {
  category: Category;
  operation_type: OperationType;
  total_amount: number;
}

export interface MetricsComparison {
  current_period: number;
  previous_period: number;
  delta_abs: number;
  /** Null when the previous period's net value is zero. */
  delta_pct: number | null;
}

export interface MetricsAlert {
  /** Group key returned by the selected group_by value. */
  period: string;
  outcome_total: number;
  baseline_average: number;
  /** Fractional increase (for example, 0.3 means 30%), not percentage points. */
  increase_ratio: number;
}

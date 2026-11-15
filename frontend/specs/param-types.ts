/**
 * Query parameter contracts for the current backend routes.
 *
 * Optional query fields are omitted rather than sent as empty strings. These
 * declarations document planned UI/API integration and are not live app types.
 */
import type { BusinessType, Category, GroupBy, OperationType } from "./api-types";

export interface MetricsParams {
  start_date?: string;
  end_date?: string;
  category?: Category;
  operation_type?: OperationType;
}

/** Query parameters for /api/metrics/b2b and /api/metrics/b2c. */
export interface BusinessTypeMovementsParams {
  start_date?: string;
  end_date?: string;
  category?: Category;
  operation_type?: OperationType;
}

export interface MetricsSummaryParams {
  group_by?: GroupBy;
  start_date?: string;
  end_date?: string;
  category?: Category;
  operation_type?: OperationType;
  business_type?: BusinessType;
}

export interface TopCategoriesParams {
  operation_type?: OperationType;
  limit?: number;
  start_date?: string;
  end_date?: string;
  business_type?: BusinessType;
}

export interface MetricsComparisonParams {
  /** Required by the backend. Inclusive calendar dates in YYYY-MM-DD form. */
  start_date: string;
  /** Required by the backend. Inclusive calendar dates in YYYY-MM-DD form. */
  end_date: string;
  business_type?: BusinessType;
}

export interface MetricsAlertsParams {
  threshold?: number;
  group_by?: GroupBy;
  start_date?: string;
  end_date?: string;
  business_type?: BusinessType;
}

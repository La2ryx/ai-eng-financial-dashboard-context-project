import type { BusinessType } from "@/lib/financial-types";
import type { DateRange } from "@/lib/dashboard-api";

interface DateBusinessFiltersProps {
  range: DateRange;
  businessType: BusinessType | null;
  minDate: string;
  maxDate: string;
  validationMessage: string | null;
  onRangeChange: (range: DateRange) => void;
  onBusinessTypeChange: (value: BusinessType | null) => void;
  onApply: () => void;
}

const controlClassName =
  "h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function DateBusinessFilters({
  range,
  businessType,
  minDate,
  maxDate,
  validationMessage,
  onRangeChange,
  onBusinessTypeChange,
  onApply,
}: DateBusinessFiltersProps) {
  return (
    <section aria-label="Dashboard filters" className="rounded-lg border border-border/60 bg-card p-4">
      <div className="grid grid-cols-1 items-end gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_auto]">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="start-date" className="text-sm font-medium">Start date</label>
          <input
            className={controlClassName}
            id="start-date"
            type="date"
            min={minDate}
            max={maxDate}
            value={range.startDate}
            onChange={(event) => onRangeChange({ ...range, startDate: event.target.value })}
            aria-invalid={Boolean(validationMessage)}
            aria-describedby={validationMessage ? "date-range-error" : undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="end-date" className="text-sm font-medium">End date</label>
          <input
            className={controlClassName}
            id="end-date"
            type="date"
            min={minDate}
            max={maxDate}
            value={range.endDate}
            onChange={(event) => onRangeChange({ ...range, endDate: event.target.value })}
            aria-invalid={Boolean(validationMessage)}
            aria-describedby={validationMessage ? "date-range-error" : undefined}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="business-type" className="text-sm font-medium">Business type</label>
          <select
            className={controlClassName}
            id="business-type"
            value={businessType ?? "all"}
            onChange={(event) => onBusinessTypeChange(
              event.target.value === "all" ? null : event.target.value as BusinessType,
            )}
          >
            <option value="all">All business</option>
            <option value="B2B">B2B</option>
            <option value="B2C">B2C</option>
          </select>
        </div>
        <button
          className="h-10 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          type="button"
          onClick={onApply}
        >
          Apply filters
        </button>
      </div>
      {validationMessage ? (
        <p id="date-range-error" className="mt-3 text-sm text-destructive" role="alert">
          {validationMessage}
        </p>
      ) : null}
    </section>
  );
}

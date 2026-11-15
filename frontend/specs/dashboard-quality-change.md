# Dashboard accessibility and chart rendering change

**Branch:** `feature/dashboard-quality`

**Scope:** Implemented UI quality improvement; separate from the feature specifications.

## Changes

- KPI collection has an accessible group name.
- Loading is announced as a polite status and request failures use an alert region.
- Both charts expose a chart label and a screen-reader-only semantic table with the plotted values, so the financial series have a non-visual equivalent.
- Recharts line transitions are disabled to avoid repeated animation when data renders. This is a low-risk rendering-behavior reduction, not a measured performance claim.

## Validation

See the feature-branch verification entry in [`verification.md`](../../verification.md#dashboard-quality-change-validation) for exact test, lint, and build results. A real assistive-technology audit and a before/after performance benchmark are not claimed by this change.

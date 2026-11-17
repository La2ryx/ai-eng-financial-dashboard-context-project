# Dashboard accessibility and chart rendering change

**Branch:** `feature/dashboard-quality`

**Scope:** Implemented UI quality improvement; separate from the feature specifications.

## Changes

- KPI collection has an accessible group name.
- Loading is announced as a polite status and request failures use an alert region.
- Both charts expose a chart label and a screen-reader-only semantic table with the plotted values, so the financial series have a non-visual equivalent.
- Recharts line transitions are disabled to avoid repeated animation when data renders. This is a low-risk rendering-behavior reduction, not a measured performance claim.

## Validation

See the stage-three entry in [`verification.md`](../../verification.md#stage-three-dashboard-quality-skills-pass) for skill discovery and the recorded test, lint, and build results. The external data-dashboard skill was applied in guidance-only mode because its full gate kit is not installed. A real assistive-technology audit and a before/after performance benchmark are not claimed by this change.

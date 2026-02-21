# VisualManager_V6 Template README

## Scope
Version `VM_V6.html` is the current optimized template for OAS Narrative Postfix usage.
Only versioned templates kept in repository now:
- `VM_V2.html` (baseline)
- `VM_V6.html` (current)

## What changed in V6
- Added full points menu legend controls and wiring consistency:
  - Legend Show/Hide
  - Legend position: Auto, Top, Bottom, Left, Right
- Added Y-axis and Targets icons into the default modebar set for cartesian visuals.
- Improved reset behavior:
  - Modebar Reset now restores options to Visual Settings baseline/defaults while preserving mapping.
  - Visual Settings now has **Reset (keep mapping)** button.
- Upgraded Visual Settings statistics controls from single dropdown to multi-select + color controls.
- Added regression outlier controls in Visual Settings and modebar stats:
  - show/hide outliers
  - method: STD / IQR / MAD
  - threshold multiplier
  - outlier color
- Added expand/collapse-all controls in both Visual Manager and Visual Settings sections.
- Added palette preset dropdown in Visual Settings (Tableau 10, Power BI, Oracle Analytics, Pastel, Vibrant, Custom) with Custom color list support.
- Fixed stats/regression synchronization so disabling regression removes regression-only overlays, while enabling regression outliers ensures regression overlay is active.
- Improved axis-title defaults and runtime application so mapped column labels are used by default and manual titles reliably apply.
- Improved table visual spacing so toolbar/modebar controls remain visible above table content.

- Removed duplicate Points popover path so the toolbar opens only the enhanced Points/Labels/Legend menu.
- Extended scatter visual mapping with optional Y2 measure and added per-series statistics overlays (Mean/Median/CI/Regression + regression outliers) for scatter traces.
- Improved generic runtime axis-title defaults for more visual mapping patterns and renamed option section labels for clearer UX.

- Added per-measure color source control (Palette vs Custom) so palette changes apply immediately unless a measure is explicitly set to Custom color.
- Enhanced scatter statistics controls with Combined vs Per-series mode, Mean/Median axis scope (Y or X+Y), and Regression axis scope (Y-on-X or Both).

- Fixed `regHist` (Regression Linear/Poly2 + Histogram) to honor Visual Settings Statistics/Regression overlays, including mean/median/CI/regression and regression outlier markers where applicable.
- Raised Visual Settings modal/backdrop z-index to stay above sticky visual headers/toolbars while scrolling.
- Added axis automargin runtime defaults to reduce truncation of long or 90-degree X-axis labels.
- Measure color can now be reset back to palette behavior by switching the measure color source to `Palette`.

- Added a modebar `Statistics Table` icon that opens a per-visual stats table; for non-stat visuals it falls back to mapped data/trace values.
- Improved global axis runtime layout (`automargin`, title standoff, tick overflow) to reduce truncated X labels and title/value overlap across visuals.
- Added table-specific header/toolbar layout fixes and visual card type tagging so table title + modebar remain visible.
- Strengthened reset cleanup to clear additive overlays (targets/reference/stat overlays/regression outliers/trend) that could persist as stray lines.

- Strengthened global axis spacing defaults (title standoff, adaptive bottom/left margin for rotated ticks, and robust numeric tick-angle parsing) to reduce X-label truncation and title overlap.
- Note: external `Branch_VisualManager` template links were referenced for comparison, but direct network fetch/clone was blocked in this runtime (HTTP proxy 403), so this pass applied global compatibility fixes directly in `VM_V6.html`.

## Compatibility
- OAS Postfix placeholders remain preserved in template.
- Designed to keep Visual Settings as source-of-truth defaults and modebar as fast runtime override.


## Branch_VisualManager template check (latest)
- Verified the following links were checked from this environment:
  - `MultiY_v2.html`
  - `LineTrend_v2.html`
  - `Reg_Hist_v2.html`
  - `BoxPlot_v2.html`
- Current result: direct access is blocked by the runtime proxy (`403 CONNECT tunnel failed`), so automated diff/import from that branch cannot be completed in this environment.
- Recommended handoff: add those four files directly into this repo (or as attachments) and I can immediately merge missing modebar/visual-setting features into `VM_V6.html` in the next patch.

## Follow-up (work branch template comparison update)

Based on available work-branch source templates (`BoxPlot V1.js`, `Multi Y V1.js`, `Trends V1.js`), V6 was further aligned with chart-specific controls in Visual Settings:

- **Box visual settings expanded**: added Mean line toggle, Notch toggle, Point jitter control, and Violin side selector (Both/Positive/Negative).
- **Box renderer wiring expanded**: new settings are applied in `box`, `violin`, `strip`, `swarm`, and `raincloud` modes.
- **Reg+Hist settings expanded**: added Histogram bins control in Visual Settings for `regHist`.
- **Regression method fix for Reg+Hist**: `trendMethod=poly2` now renders a real quadratic regression line (instead of always linear), and outlier detection uses the selected regression curve.

These additions are specifically targeted to close feature gaps from the branch templates for Box/Trend/Regression workflows.

# VisualManager V3 (VM_V3.html) — Project Guide

## What this project is
VisualManager is an Oracle Analytics (OAS) Narrative/Postfix-compatible visualization framework delivered as a self-contained HTML template. It lets report authors:
- Load tabular JSON-like data from OAS Narrative output.
- Configure multiple visuals in one canvas/grid.
- Map dimensions/measures interactively.
- Apply per-visual transforms, filters, styling, and runtime controls.
- Export visuals and inspect supporting statistics.

`VM_V3.html` is a **copy-ready** template file intended for direct use in OAS Postfix.

---

## Version lineage (V1 → V2 → V3)

### V1 (conceptual baseline)
V1 established the core model:
- Data parsing from Narrative payloads.
- Basic visual registry with configurable mapping and options.
- Per-visual rendering with Plotly.
- Initial section split and grid card layout behavior.

### V2 (baseline in this repository)
`VM_V2.html` significantly expanded capabilities:
- Rich visual registry (line/bar/scatter/area/pie/donut/box/histogram/table/correlation/pivot/gauge and more).
- Visual settings with more complete control surfaces.
- Card-level toolbar/modebar (custom actions + runtime interactions).
- Statistics overlays and regression options.
- Sectioning, persistence, and faster re-render paths.
- Better axis/title defaults and improved automargins.

### V3 (this release)
`VM_V3.html` is created as the next copy-ready template and includes the complete V2 functionality set plus parity fixes driven by v2 specialized chart templates:
- **Multi Y visual enhancements**: Y1/Y2 chart type support for line, spline, step, area, and bar.
- **Reg+Hist mode enhancements**: scatter, scattergl, histogram, hist+kde, and bar distribution modes.
- **Legend controls parity**: quick popover chips for Show/Hide + Auto/Top/Bottom/Left/Right.
- **Visual-space/modebar resilience**: header toolbar behavior improved for narrower cards.

---

## Related specialized templates and what V3 absorbs

From the chart-specific templates in this repo:
- `BoxPlot_v2.html`
- `LineTrend_v2.html`
- `MultiY_v2.html`
- `Reg_Hist_v2.html`

V3 consolidates core interaction patterns that matter inside VisualManager:
- Compact chart controls/modebar behavior.
- Better spacing and runtime axis handling.
- Extended chart mode options (especially MultiY and Reg+Hist patterns).
- Runtime actions for legend, zoom/pan, y-axis controls, targets, export, and quick stats.

---

## Functional overview of VisualManager (V3)

### 1) Data and model
- Reads data payload from hidden OAS-hosted container blocks.
- Normalizes rows and columns into internal context.
- Maintains an in-memory `STATE` object for:
  - Globals (theme, layout, visuals-per-row).
  - Section split context.
  - Visual list and per-visual options/mapping/filter/transform.

### 2) Visual registry architecture
Each visual type is registered with:
- `defaultVisual()`
- `buildMappingUI()`
- `buildOptionsUI()`
- `render()`

This structure allows extension without changing the global rendering framework.

### 3) Per-visual runtime toolbars
Cards include a custom modebar-like toolbar with actions such as:
- Reset/Home
- Points/Labels/Legend
- Y-axis controls
- Targets/reference controls
- Filter/outlier controls
- Zoom/Pan tools
- Statistics table
- Export (PNG/SVG/JSON/CSV where applicable)
- Fullscreen
- Settings

### 4) Statistics and regression
Supported patterns include:
- Mean, Median, CI overlays
- Regression overlays (linear/poly2 where applicable)
- Regression outlier detection options (method/threshold)
- Optional stats table view for quick numeric interpretation

### 5) Layout and responsiveness
- Grid with configurable visuals-per-row.
- Card header + toolbar management for dense control sets.
- Axis automargin/spacing defaults to reduce label clipping.
- Runtime relayout/restyle where possible to avoid expensive full redraws.

### 6) Interactivity and productivity
- Persisted settings (where enabled).
- Keyboard shortcuts for active visual operations.
- Quick menu popovers for high-frequency actions.

---

## What we are trying to achieve with VisualManager
The project goal is to provide a **single reusable enterprise visual template** for OAS Narrative that balances:
1. **Analyst flexibility** (many chart types + settings),
2. **Runtime usability** (fast toolbar controls, low friction),
3. **Postfix compatibility** (copy/paste friendly, no external app shell),
4. **Maintainability** (registry-based visual definitions and shared helpers).

In short: one file teams can deploy in OAS that behaves like a compact visualization workbench.

---

## How to use VM_V3 in OAS Postfix
1. Open `VM_V3.html`.
2. Copy the complete file content.
3. Paste into your OAS Narrative/Postfix template location.
4. Ensure data placeholders are mapped as expected in your OAS project.
5. Run and validate:
   - Visual mappings
   - Modebar actions
   - Section splits
   - Export and stats behaviors

---

## Files in this repository relevant to V3
- `VM_V3.html` — new VisualManager V3 template (copy-ready).
- `VM_V2.html` — previous baseline implementation.
- `VisualManager_V2_README.md` — prior template notes.
- `VisualManager_V6_README.md` — enhancement and parity notes used as guidance.
- `BoxPlot_v2.html`, `LineTrend_v2.html`, `MultiY_v2.html`, `Reg_Hist_v2.html` — specialized feature references.

---

## Notes for future evolution (V4+)
- Continue consolidating specialized-template behavior into common VisualManager controls.
- Expand performance handling for very large datasets (adaptive sampling, trace strategy switching).
- Add stronger schema-aware mapping assistance and safer defaults for mixed-type columns.
- Keep OAS placeholders and portability as first-class constraints.

---

## V3 UX enhancements (Visual Manager + Visual Settings)

To improve look-and-feel, grouping, and discoverability, V3 includes UI organization updates:
- Renamed manager tabs for clearer intent (`Layout & Appearance`, `Visual Catalog`, `Data & Defaults`, `Help & Roadmap`).
- Added quick-jump chips in manager and visual settings to move directly to key groups.
- Added cleaner section-card styling for grouped settings blocks.
- Added one-click **Formatting Presets** (`Executive`, `Compact`, `Analysis`) to speed up chart formatting setup.

Formatting-related controls are now easier to access in grouped sections:
- Titles and card appearance
- Axes and scales
- Axis ticks/formatting
- Conditional formatting
- Filters
- Statistics/regression controls
- Per-visual behavior/style options

---

## BI-inspired enhancement roadmap (next)

Popular BI tools (Power BI/Tableau/Looker/Qlik) commonly provide higher-level analytic workflows beyond base chart rendering. Recommended next additions:

1. **Drill interactions**
   - Drill-down hierarchies (Year → Quarter → Month)
   - Drill-through to detail views with context filters

2. **Cross-filter and linked brushing**
   - Clicking in one visual filters/highlights related visuals
   - Optional interaction policy per visual

3. **Explain/insight layer**
   - Auto-explain outliers/spikes and top contributing dimensions
   - Lightweight narrative summaries for selected marks

4. **Forecast + what-if controls**
   - Built-in trend forecasting modes
   - Parameter sliders for scenario analysis

5. **Small multiples as a common engine**
   - Reusable trellis/small-multiples controls across major chart families

6. **Operational features**
   - Alert rules on KPI thresholds
   - Scheduled exports/subscriptions

7. **Semantic consistency**
   - Reusable business measure definitions
   - Time-intelligence helpers (YoY, MoM, YTD)

These are recommended as phased V4+ work items after the current V3 parity and UX improvements.

---

## Newly implemented advanced analytics features (V3 update)

The following requested enhancements are now implemented as first-pass capabilities in `VM_V3.html`:

1. **Drill + hierarchy**
   - Line visual supports hierarchy drilling across multiple mapped X columns.
   - Interaction: **Shift + click** on a plotted point cycles drill level.

2. **Cross-filtering graph**
   - Added global cross-filter graph toggle in Visual Manager layout settings.
   - Click on a visual (when emit is enabled) propagates active X filter to other visuals.
   - Added clear action for active cross-filter in manager settings.

3. **Small multiples generalized engine (initial)**
   - Trellis/small-multiples behavior is now applied at line-render level through subplot grid assignment, with configurable columns.

4. **Forecast + what-if parameters**
   - Added line-level forecast options (`None`, `Linear Trend`) and forecast horizon points.
   - Added what-if percentage adjustment to project scenario-adjusted series values.

5. **Insight / explain panel**
   - Statistics panel now includes an insight summary (trend direction + slope) when enabled.

6. **Alert automation (local runtime)**
   - Added per-visual alert checks in insight panel using configured operator/threshold and latest value evaluation.

7. **Semantic model / time intelligence hardening (initial)**
   - Added semantic date grain selector and time-calculation options (`MoM %`, `YoY %`, `YTD`) in line visual settings.

> Note: these are V3 first-pass implementations focused on runtime behavior in the template engine. Enterprise production versions can extend this with backend-driven subscriptions, durable alert delivery channels, and semantic-layer governance.

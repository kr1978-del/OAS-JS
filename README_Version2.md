# OAS Postfix Advanced Plotly

This repository contains an advanced, self‑contained Plotly.js Postfix script for OAS/Narrative pages. It renders full‑width, responsive charts from a single data source and supports per‑chart configuration via UI and PV (page variable) defaults.

Primary script: [OAS-Postfix-Advanced-Plotly.js](OAS-Postfix-Advanced-Plotly.js)

Contents
- Overview
- Quick start
- Data schema and input
- Supported chart types
- Features
- Modebar controls (UI)
- PV configuration (defaults)
- Persistence (PV and local storage)
- Legend positions
- Limits and SPC indices in status
- Troubleshooting
- Roadmap (enhancements)
- Versioning

---

## Overview

The script renders one chart per numeric measure, grouped into a responsive grid. It reads a JSON array (with special keys for date, line, and cell) and automatically finds all numeric fields as measures.

- Required keys in your rows: `dt`, `line`, `cell`
- Measures: any other numeric fields (e.g. `m1`, `m2`, … or named metrics)
- One card per measure; each card supports changing chart type, filters, legend position, density overlays, and more.

The script avoids common inline‑script pitfalls and provides clear runtime error messages in the UI when data is missing or malformed.

---

## Quick start

1) Add your data to the page (before the Postfix block):

```html
<script id="box-data" type="application/json">
[
  {"dt":"2025-W01","line":"L1","cell":"A","m1":1.23,"m2":2.5},
  {"dt":"2025-W01","line":"L2","cell":"B","m1":1.95,"m2":3.1},
  {"dt":"2025-W02","line":"L1","cell":"A","m1":1.10,"m2":2.8}
]
</script>
```

2) Paste the full contents of [OAS-Postfix-Advanced-Plotly.js](OAS-Postfix-Advanced-Plotly.js) in your Narrative Postfix.

3) (Optional) Set PV defaults on the page (see PV Configuration below).

4) Load the page: charts should render full width, with a modebar on each chart for settings.

---

## Data schema and input

- Each row must include:
  - `dt`   (string)  Date or period label (category; e.g., YYYY-MM, week key, day)
  - `line` (string)  Series/category name (e.g., production line)
  - `cell` (string)  A finer sub-category (shown in tooltips, and usable as X attribute)
- Measures: all other numeric fields become separate measures shown as separate charts.

Notes:
- Numbers can contain commas or periods as decimal/grouping separators; the script normalizes common formats.
- The script treats `dt` and `cell` as categories (X axis).
- X attribute can be toggled between `Date (dt)` and `Cell` in the Settings.

---

## Supported chart types

Per-series (default mode):
- Boxplot
- Violin
- Histogram (group/stack/overlay)
- Scatter
- Line
- Bar
- Heatmap
- Pie / Donut
- Gauge
- Waterfall
- Bubble

“All series” mode (combined distribution per X):
- Boxplot (All)
- Violin (All)
- Histogram (All)

Orientation:
- Vertical or Horizontal for: Bar, Histogram, Box, Violin, Waterfall

---

## Features

- Full-width responsive layout (auto resizes on window resize).
- One card per numeric measure with:
  - Chart type switching
  - Orientation (where applicable)
  - Group/Stack/Overlay modes (bar/hist)
  - Density overlay on histogram (secondary axis)
  - Legend toggle and positions
  - Median and regression overlays (where applicable)
  - Per-series color pickers
  - LSL/USL/TGT limit lines
  - Filters: exclude zeros, 1.5×IQR, ±3×IQR, min/max range
  - Status table with quartiles and capability indices (Cp, Cpk, Pp, Ppk) when limits provided
  - Downloads: Data CSV, Status CSV, Image PNG; All‑charts PNG grid; All‑charts Status CSV
  - Fullscreen per chart
- Title/X/Y labels and font size per chart.

---

## Modebar controls (UI)

Each chart provides the following buttons:
- Settings: change chart type, X attribute, legend and labels, orientation, combine mode, density, limits, colors, and titles.
- Filter: zeros, outliers/extremes, min/max.
- Status: toggle per‑chart stats table (filters-aware).
- Zoom: helper controls for X/Y zoom and reset.
- Theme: toggle light/dark (affects all charts).
- Download: data/status CSV, PNG export, all‑charts composite PNG, all‑charts status CSV.
- Fullscreen: maximize a single chart (ESC to exit).

---

## PV configuration (defaults)

These optional PVs preconfigure labels, layout, and default settings. Missing PVs gracefully fall back to defaults.

Embed as data attributes on the hidden params element (already included in the file):

- Layout and labels
  - `GraphsPerRow` → `data-gpr` (1..3; default 1)
  - `PV_Attribute01` → `data-date-title` (default `week`)
  - `PV_Attribute02` → `data-line-title` (default `Line`)
  - `PV_Attribute03` → `data-cell-title` (default `Cell`)
  - `PV_LegendPos` → `data-legend-pos` (default `top-center`)
  - `PV_LegendShow` → `data-legend-show` (`1` = show; `0` = hide)
  - `PV_MeasureTitles` → `data-mtitles` (pipe-separated; optional)
  - `P1Title`..`P160Title` → `data-p1`..`data-p160` (individual measure names; optional)

- Persisted defaults
  - `PV_PlotSettings` → `data-plot-settings`
    - JSON or base64(JSON) with a structure of:
      ```
      {
        "theme":"light|dark",
        "charts": {
          "<measure_key>": {
            "chartType":"box|violin|...",
            "seriesMode":"perLine|all",
            "barMode":"group|stack|overlay",
            "orient":"v|h",
            "showLegend":true,
            "legendPos":"auto|top-left|top-center|top-right|bottom-center|left|right",
            "showMed":false,
            "showReg":false,
            "dense":false,
            "kde":false,
            "labels":"off|extremes|all|auto",
            "fmin":null,
            "fmax":null,
            "exZero":false,
            "exOut15":false,
            "exExt3":true,
            "LSL":null,
            "USL":null,
            "TGT":null
          }
        }
      }
      ```
    - Tip: Use “Copy settings (JSON)” or “Copy settings (base64)” in Settings to produce a ready-to-paste value.

Notes:
- PV placeholders like `@{PV_Name}{default}` are read safely; if unresolved, defaults are used.

---

## Persistence (PV and local storage)

- PV defaults: shared for all viewers; useful for publishing read‑only dashboards.
- LocalStorage: each user can tweak charts and “Save to local” for their browser.
  - Key: `OAS_BOX_STATE_V4`
  - Use “Clear local” in Settings to reset.

---

## Legend positions

Allowed values for `PV_LegendPos` and per‑chart Setting:
- `auto` (defaults to page-level PV or top‑center)
- `top-left`, `top-center`, `top-right`
- `bottom-center`
- `left`, `right`

---

## Limits and SPC indices in status

When both LSL and USL are provided for a chart:
- The per‑date status table calculates Cp, Cpk (sample sigma) and Pp, Ppk (population sigma).
- Lines for LSL/USL/TGT render across the plot area.

Note: Indices shown are indicative; validate with your quality methodology.

---

## Troubleshooting

- Nothing renders; “Plotly not found”
  - Ensure the page can load `/analyticsRes/custom/plotly.min.js`
  - Adjust the `<script src="...">` path if your environment differs.

- “box-data not found” or “Invalid JSON in box-data”
  - Ensure a JSON array is present earlier on the page in an element with `id="box-data"`.
  - Recommended:
    ```html
    <script id="box-data" type="application/json">[ ... ]</script>
    ```
  - Make sure the JSON uses double quotes, no trailing commas, and valid numbers.

- Charts render but axes look wrong
  - Use Settings → “Orientation” for horizontal charts.
  - For histograms, “Combine mode” affects stacking/grouping/overlay.

- Manual Y scale not applied
  - In Settings, set Y scale to “Manual” and provide min/max; leaving blank auto-fills from data.

- Legend overlaps chart
  - Switch legend position in Settings (e.g., `right` or `bottom-center`).

- Local tweaks keep coming back
  - Clear local persisted state via Settings → “Clear local”.

- Important inline‑script caution
  - Avoid putting the literal string `</script>` inside any JavaScript string in Postfix. Browsers treat it as the end of the script tag, which truncates the code.

---

## Roadmap (enhancements)

The following are desired next steps aligned with earlier requests. They’ll be added incrementally on top of this stable base:

- Two‑measure XY regression (select X and Y measures; show regression line, r and r²)
- Correlation matrix across selected measures
- Additional visuals: Funnel, Pyramid, Radar/Spider, Treemap, Sunburst, Word cloud, Candlestick, Bullet
- SPC chart types (X̄–R, X̄–S, p/np, c/u) with rules visualization
- Layered donut (multi‑ring)
- Data‑bar table view (tabular values with bars aligned)
- 3D variants where appropriate
- Multi‑pane dashboards (2–4 charts sharing the same X, independent Y scales)

If you have priorities, open an issue describing the desired behavior, inputs (PV, data schema), and a mock or reference.

---

## Versioning

This script matches the “V4” state persistence (LocalStorage key `OAS_BOX_STATE_V4`). Changes affecting persistence will bump the version and be noted here.

Changelog (high level):
- v4
  - Stable baseline for advanced Plotly Postfix in OAS
  - Full-width responsive rendering
  - Per‑chart Settings, Filters, Downloads, Status (with Cp/Cpk/Pp/Ppk)
  - Histogram density overlay
  - PV defaults + local persistence
  - Legend positions and orientation
  - LSL/USL/TGT limit lines

---

## Contributing

- Please include a minimal snippet of your `#box-data` JSON when reporting issues (redact sensitive values).
- If you encounter a runtime error, copy the first error line from browser DevTools and the affected chart type/settings.
- PRs are welcome; keep changes incremental and note any persistence or PV schema updates.

License: MIT (unless specified otherwise in the repository).
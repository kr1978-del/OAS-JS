# Chart Properties Matrix by Chart Type (Complete)

This document enumerates the 30 chart types from the requirements and maps them to our engine’s current support and applicable properties. It merges base-version properties with the new two-panel UI prototype. If a control isn’t listed for a chart type, it should be hidden or disabled.

Legend
- Tabs: Overview, Data layers, Events, Roles, Titles, Axes, Measures, Format, Analytics, Rules
- Analytics sections: TSA = Time-series analytics (limits/rules), Dist = Distribution tools (bins/KDE/ECDF/box/violin), Regr = Regression & summary
- Support: Supported, Supported (via preset), Planned, Not in current

Engine types observed in code
- Standard: line, area, stacked-area, bar, stacked-bar, scatter, bubble, hist, box, violin, pie, donut, candlestick, ohlc, heikin
- Enhanced in UI/core: spc-xbar, spc-r, spc-individuals, capability, kpi-card, correlation-matrix, waterfall
- Enhanced visible in core: spc-s, spc-mr, gauge

Core (shared)
- Always visible tabs: Overview, Roles, Titles, Axes, Measures, Format, Rules
- Conditional tabs/sections: Data layers (Line/Area), Events (time-series & financial), Analytics (TSA/Dist/Regr per chart type)

---

## Financial charts & visuals (15)

1) Price Line / Area (time series) — Supported
- Tabs: Overview, Data layers, Events, Roles, Titles, Axes, Measures, Format, Analytics(TSA), Rules
- Key: normalize to 100, SMA/EMA, connect gaps, event markers
- Not applicable: render style per-measure = limited to line/area

2) Candlestick — Supported
- Tabs: Overview, Events, Roles (OHLC + Volume), Titles, Axes, Measures, Format (price colors/overlays/volume), Analytics(TSA), Rules
- Key: up/down colors, hollow up, wicks, SMA/EMA/BB, volume panel (ratio, color mode)
- Not applicable: Data layers; Distribution tools; Regression

3) OHLC (bar) — Supported
- Tabs: Similar to Candlestick
- Key: bar width, up/down colors; same overlays as candles
- Not applicable: Data layers; Dist; Regression

4) Heikin-Ashi — Supported
- Tabs: Similar to Candlestick
- Key: same overlays as candles; HA values warning if not precomputed

5) Volume (with Price) — Supported (via preset within financial charts)
- Tabs: Same as Candlestick with Volume enabled; Axes uses split domain
- Key: volume ratio, color by up/down, volume MA

6) Volume Profile / Market Profile — Planned
- Key: side histogram aligned to price axis; bin size; value area; POC line
- Analytics: Dist (bins) where applicable

7) Waterfall (PnL / contribution) — Supported
- Tabs: Overview, Roles (ordered categories, deltas), Titles, Axes, Format, Rules
- Key: connector lines; subtotal/total styling; number formatting

8) Treemap / Sunburst — Planned
- Tabs: Overview, Roles (labels, parents, values, color metric), Titles, Format
- Key: tiling algo; color scale; pathbar

9) Heatmap – Correlation / Factor Exposures — Supported (Correlation matrix)
- Type: correlation-matrix
- Tabs: Overview, Roles (matrix inputs), Titles, Axes (minimal), Format, Analytics(optional), Rules
- Key: color scale, masking, clustering

10) Scatter / Bubble (Risk–Return) — Supported
- Tabs: Overview, Roles (X,Y,Size(Bubble),Series,Tooltip,Shape), Titles, Axes, Measures, Format, Analytics(Regr), Rules

11) Yield Curve — Supported (via Line preset)
- Tabs: As Line; Roles: tenor (x), yield (y), curve group (series)

12) 3D Surface — Planned
- Key: surface traces; contours; camera presets; performance guardrails

13) Sankey — Planned
- Key: nodes, links (source/target/value); color by group; hoverformatter

14) Funnel / Funnel-area — Planned
- Key: percent vs absolute; connector; sort direction

15) Calendar Heatmap — Planned
- Key: pre-binned heatmap; weekday/week numbering; missing days shading

---

## Statistical charts (15)

1) Histogram — Supported
- Tabs: Overview, Roles (measure; series optional), Titles, Axes, Measures, Format, Analytics(Dist), Rules
- Key: bins, normalization, KDE overlay, ECDF markers (Analytics)

2) Box Plot — Supported
- Tabs: Overview, Roles (measure + optional group), Titles, Axes, Measures, Format, Analytics(Dist), Rules
- Key: quartile algo; whisker method; jitter points

3) Violin Plot — Supported
- Tabs: Overview, Roles (measure + optional group), Titles, Axes, Measures, Format, Analytics(Dist), Rules
- Key: bandwidth; inner display; jitter/width

4) Strip / Beeswarm — Planned (as strip)
- Key: jitter; point size/opacity; dodge by subgroup

5) ECDF / CDF — Planned
- Key: cumulative curve; show median/percentiles

6) Q–Q Plot — Planned
- Key: target distribution; confidence band

7) KDE / Density Curve — Planned (overlay in Hist/Violin)
- Key: bandwidth; boundary handling

8) Scatter with Regression — Supported (via Scatter)
- Tabs: as Scatter with Analytics(Regr)

9) Correlation Heatmap — Supported (correlation-matrix)
- See Financial(9)

10) Pareto — Planned
- Key: sorted bar + cumulative line on secondary axis; target line

11) SPC / Control Charts (X̄-R, I-MR, p, np, c, u) — Partially Supported
- Supported: spc-xbar, spc-r, spc-s (core), spc-individuals, spc-mr (core)
- Planned: p, np, c, u
- Tabs: Overview, Roles (time index + subgroup stats), Titles, Axes, Format, Analytics(TSA rules), Rules

12) Capability (Histogram + Specs + Cpk) — Supported
- Tabs: Overview, Roles (measure, specs), Titles, Axes, Measures, Format, Analytics(Dist + specs), Rules

13) ACF / PACF — Planned
- Key: lags count; CI method; seasonal highlights

14) Scatter Matrix (SPlom) — Planned
- Key: diagonal hist/box; sample cap

15) Slopegraph / Dumbbell — Planned
- Key: before→after; percent change labels; highlight movers

---

## Enhanced visuals present in engine
- KPI Card — Supported (kpi-card): Overview, Titles, Format (theme, border, icon/delta), Rules
- Gauge — Supported (core): Overview, Titles, Format; Roles (value)

---

## Candlestick: Applicable vs Not Applicable

Applicable
- Tabs: Overview, Events, Roles (dt + OHLC + Volume), Titles, Axes, Measures, Format (price-specific), Analytics(TSA), Rules
- Controls: price up/down colors; hollow up; wicks width; SMA/EMA/VWAP/Bollinger; volume panel ratio & color mode; connect gaps; range selector/slider; y-scale linear/log; event markers; hoverformat; session breaks

Not Applicable
- Data layers (line/area overlays handled via Format overlays instead)
- Distribution tools (bins/KDE/ECDF/box/violin)
- Regression panel
- Render style per measure (line/bar/area)
- Bubble size/shape; column width

---

Implementation notes
- Use this matrix to drive conditional visibility in the Properties UI.
	- Price-only controls must appear for: candlestick, ohlc, heikin (and financial presets with volume).
	- Layers only for line/area families.
	- Events only for time-series and financial.
	- Regression only for scatter/bubble.
	- Distribution tools only for histogram/box/violin families.
- For types marked “Supported (via preset)”, expose them as presets in Overview rather than separate chart types.

This matrix is comprehensive across the 30 requirement types plus engine-specific enhanced visuals, and reflects current implementation status based on code and recent changes.

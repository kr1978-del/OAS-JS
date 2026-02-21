Financial charts & visuals

1) Price Line / Area (time series)

Use: Close/Index over time; normalized performance.

Requires: dt (x), one or more measures (e.g., Close, Return); optional line group; optional cell in hover.

Traces: scatter (or scattergl), mode:"lines"; area = fill:"tozeroy".

Settings: date range-selector/slider; y-scale linear/log; normalize to 100; rolling SMA/EMA overlays; event markers (earnings, splits); hoverformat; missing data connect gaps; per-measure render mode (line/bar/area); percent change vs absolute; multi-axis when mixing measures.

2) Candlestick

Use: OHLC candles with up/down color and wicks.

Requires: dt, open, high, low, close; optional volume.

Traces: candlestick; optional lower panel bar for volume.

Settings: up/down colors; hollow vs filled candles; session breaks; wicks width; price axis in absolute/%; after-hours toggle; overlays (SMA/EMA, VWAP, Bollinger Bands); crosshair + OHLC on hover.

3) OHLC (bar)

Use: Lightweight alternative to candles.

Requires: dt, open, high, low, close.

Traces: ohlc.

Settings: bar width; up/down colors; same overlays as candlestick.

4) Heikin-Ashi (derived)

Use: Smoothed trend candles.

Requires: Derived HA-Open/HA-Close/High/Low (precompute or compute in JS).

Traces: candlestick with HA values.

Settings: same as candlestick; warning banner if not precomputed.

5) Volume (with Price)

Use: Volume confirmation under price.

Requires: dt, volume, optional up/down sign from price change.

Traces: bar (secondary x-aligned panel).

Settings: panel ratio; color by up/down; moving average of volume.

6) Volume Profile / Market Profile

Use: Volume distribution by price (side histogram).

Requires: price, volume (aggregate); or build from tick data.

Traces: horizontal bar aligned to y=price axis, or bespoke shapes.

Settings: bin size; session range; value area %, POC line, composite vs session.

7) Waterfall (PnL / contribution)

Use: Drivers of change (PnL, variance).

Requires: ordered categories, value deltas, total markers.

Traces: waterfall.

Settings: connector lines; subtotal/total styling; number formatting.

8) Treemap / Sunburst (sector & portfolio)

Use: Hierarchical contribution by sector → industry → ticker.

Requires: labels, parents, values; optional color metric (return).

Traces: treemap or sunburst.

Settings: tiling algo; color scale (diverging for return); hovertemplate; pathbar.

9) Heatmap – Correlation / Factor Exposures

Use: Correlations, risk exposures, calendar returns.

Requires: matrix (2D array) or (x,y,value).

Traces: heatmap (or imshow).

Settings: color scale; z-hover; annotation of cells; clustering order; masking diag.

10) Scatter / Bubble (Risk–Return, Efficient Frontier)

Use: Compare assets: x=volatility, y=return, size=market-cap, color=sector.

Requires: x, y, optional size/color/group.

Traces: scatter (mode:"markers"), size/color encodings.

Settings: log axes; trendline overlay (if precomputed); quadrant lines; lasso select.

11) Yield Curve

Use: Term structure of rates.

Requires: tenor (x), yield (y), curve group (date).

Traces: scatter lines; multiple curves by line.

Settings: basis (simple/act-365); interpolation; on-hover tenor formatting.

12) 3D Surface – Term Structure / Implied Vol Surface

Use: Rate surface (tenor × date → yield); vol surface (strike × tenor → IV).

Requires: x, y, z grids.

Traces: surface (or contour).

Settings: camera presets; contours on z; slice planes; performance guardrails.

13) Sankey (cash-flow / allocations)

Use: Sources→Uses of funds, allocation flows.

Requires: nodes, links (source, target, value).

Traces: sankey.

Settings: node thickness/padding; color by group; hoverformatter for currency.

14) Funnel / Funnel-area (pipeline)

Use: Deal pipeline or conversion steps.

Requires: stage, value.

Traces: funnel or funnelarea.

Settings: percent vs absolute; connector; sort direction.

15) Calendar Heatmap (daily returns)

Use: Drilling into seasonality.

Requires: dt, value.

Traces: pre-binned heatmap with calendar layout.

Settings: weekday/week numbering; color normalization; missing days shading.

Statistical charts

1) Histogram

Use: Distribution shape.

Requires: one measure.

Traces: histogram.

Settings: bin count/size; auto vs fixed bins; normalization (count, prob, density, percent); overlay vs stacked by group; outlier clipping; σ bands overlay; stats table (N, mean, σ, skew, kurtosis).

2) Box Plot

Use: Median, IQR, whiskers, outliers.

Requires: one measure; optional group/category.

Traces: box.

Settings: quartile algo; whisker method (IQR×k or min/max); show outliers; notch (median CI); orientation; add jittered points (strip) overlay; stats table.

3) Violin Plot

Use: Distribution + summary.

Requires: one measure; optional group.

Traces: violin.

Settings: bandwidth; side (full/half/split); inner display (box, points, quartiles); point jitter/width.

4) Strip / Beeswarm

Use: Raw values per category.

Requires: one measure + category.

Traces: strip (beeswarm effect approximated via jitter).

Settings: jitter; point size/opacity; dodge by subgroup.

5) ECDF / CDF

Use: Cumulative distribution.

Requires: one measure.

Traces: scatter lines from sorted values with cumulative y.

Settings: show median/percentiles markers; compare groups.

6) Q–Q Plot

Use: Normality (or vs custom dist).

Requires: sample quantiles (+ theoretical quantiles).

Traces: scatter points; 45° reference line.

Settings: distribution target; confidence band (precomputed).

7) KDE / Density Curve

Use: Smooth pdf estimation.

Requires: one measure.

Traces: scatter line of density; optional fill.

Settings: bandwidth; boundary handling; compare groups (facets or overlay).

8) Scatter with Regression

Use: Relationship, fit, CI.

Requires: x, y; optional group.

Traces: points + precomputed fit line + CI band as scatter fill.

Settings: regression type (OLS, robust); show R², RMSE; residuals toggle.

9) Correlation Heatmap

Use: Pearson/Spearman/Kendall correlation matrix.

Requires: matrix or long-form pairs.

Traces: heatmap.

Settings: method; mask upper triangle; significance markers; reorder by clustering.

10) Pareto

Use: 80/20 analysis (defects, costs).

Requires: category, count/value.

Traces: sorted bar + cumulative scatter line on secondary axis.

Settings: cumulative target (e.g., 80% line); annotation of break.

11) SPC / Control Charts (X̄-R, I-MR, p, np, c, u)

Use: Stability and special-cause detection.

Requires: time index + subgroup stats (precomputed means/ranges or proportions).

Traces: scatter line for series + horizontal lines for CL/UCL/LCL.

Settings: rules (Western Electric/AIAG flags); ±1/2/3σ shading; subgroup size; show violations; spec limits vs control limits.

12) Capability (Histogram + Specs + Cpk)

Use: Process capability summary.

Requires: measure, LSL/USL, target; Cpk/Cp (precomputed).

Traces: histogram + vertical spec lines + density overlay.

Settings: binning; show Cpk, Ppk badges; sigma level selector.

13) ACF / PACF

Use: Time-series dependence structure.

Requires: precomputed ACF/PACF lags and values.

Traces: bar for lags + confidence band.

Settings: lags count; CI method; seasonal lags highlighting.

14) Scatter Matrix (SPlom)

Use: Pairwise relationships across measures.

Requires: multiple measures.

Traces: splom.

Settings: diagonal hist/box; hover on correlation; sample cap for performance.

15) Slopegraph / Dumbbell

Use: Before→After comparisons.

Requires: entity, value at T1/T2.

Traces: scatter lines/markers; dumbbell bars.

Settings: label placement; highlight movers; percent change labels.

Cross-cutting settings to expose (high-value)

Performance: toggle scattergl for heavy point sets; typed arrays; restyle/relayout instead of replot; sample caps.

Interactivity: legend toggle, “isolate series” on legend double-click; unified hover vs per-point; tooltips with Date/Line/Cell.

Axes: linear/log; secondary y-axis; domain splits for multi-panel (e.g., price over volume).

Transforms: groupby, filter, sort, aggregate (precompute where possible in OAS).

Annotations: bands (spec/control/confidence), events, last-value labels.

Color: diverging for returns; up/down color for candles/bars; color by group.

Export: preserve fullscreen and toolbar behaviors; static export settings.
# VM_V3 Remaining Work / Gaps (Post latest implementation)

This checklist summarizes what is still left after the current VM_V3 enhancements (drill, cross-filtering, trellis/small-multiples baseline, forecast/what-if, insight panel, alert checks, and time-calc controls).

## 1) Drill + hierarchy (partially done)
**Current:**
- Shift+click drill level cycling exists for line visuals with multi-X mapping.

**Still left:**
- Breadcrumb UI (e.g., Year > Quarter > Month) with direct level jump.
- Drill support across more visuals (bar/scatter/treemap/pivot).
- Drill-through navigation to dedicated detail visual/page context.
- Configurable per-level labels and “drill up” action in toolbar.

## 2) Cross-filtering graph (partially done)
**Current:**
- Global cross-filter state and emit/apply behavior exists.

**Still left:**
- Multi-select cross-filter sets (currently single filter object).
- Visual relationship graph (source→target mapping by field).
- Include/exclude and highlight-only modes.
- Clear filter chip UI near report title.

## 3) Small multiples generalized engine (partially done)
**Current:**
- Trellis grid assignment baseline added.

**Still left:**
- Shared trellis engine for all relevant visual types with consistent axis sync.
- Per-panel title/label truncation and paging controls.
- Optional shared scales vs independent scales switch.
- Virtualized rendering for large panel counts.

## 4) Forecast + what-if (partially done)
**Current:**
- Linear forecast and what-if % scaling exist for line behavior.

**Still left:**
- Forecast methods: moving average, ETS-lite, seasonality-aware forecast.
- Confidence intervals for forecast points.
- Scenario manager (save/load named scenarios).
- What-if controls bound to selected measures only.

## 5) Insight / explain panel (partially done)
**Current:**
- Status panel shows basic slope/trend insight.

**Still left:**
- Root-cause style explain (dimension contribution ranking).
- Change-point/anomaly explain with confidence indicators.
- Natural language summary cards (concise + detailed modes).
- Explain panel export in PDF/CSV report bundles.

## 6) Alert/subscription automation (partially done)
**Current:**
- Runtime alert check in status panel.

**Still left:**
- Persistent alert rules (stored separately from visual draft state).
- Notification channels (email/webhook) and schedule runners.
- Alert suppression windows and hysteresis.
- Alert history/audit panel.

## 7) Semantic model / time intelligence hardening (partially done)
**Current:**
- Basic semantic grain selector and MoM/YoY/YTD toggles exist.

**Still left:**
- Central semantic dictionary for reusable measures/dimensions.
- Proper date-calendar model (fiscal calendars, week-year logic).
- Reusable calculated-measure definitions with validation.
- Unit/format governance and data-type constraints per field.

## 8) Visual Settings and Manager UX (improved, but still left)
**Current:**
- Grouping, quick-jump chips, presets, and improved section styling are in place.

**Still left:**
- Search/filter inside settings (find option by keyword).
- Pin/favorite common options across visuals.
- Basic/Advanced mode toggle for novice users.
- Keyboard-first settings navigation and better a11y labels.

## 9) Performance and robustness
**Still left:**
- Adaptive downsampling by viewport density (not fixed max only).
- Background worker path for heavy transforms.
- Better handling of mixed sparse/large data in one dashboard.
- Perf telemetry panel (render time, trace count, memory hints).

## 10) OAS deployment readiness extras
**Still left:**
- One-click “OAS deployment profile” toggle (safe defaults).
- Placeholder validation diagnostics panel before render.
- Optional stripped production build without debug code paths.
- Version banner + migration notes auto-shown in manager Help tab.

---

## File for testing in OAS
Use **`VM_V3_OAS_READY.html`** (full copy of latest VM_V3 template) for direct copy/paste into OAS Postfix.

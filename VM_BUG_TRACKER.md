# VM Bug & Enhancement Tracker

This tracker is split into two sections as requested:
- **Bugs** (defects/regressions)
- **Enhancements** (new features/UX improvements)

Status legend:
- `Done` = implemented and present in current files
- `Partial` = some work done, but still incomplete
- `Pending` = not yet implemented
- `Needs Validation` = implemented claim exists, but behavior still reported as not working in user testing

---

## Bugs

| Bug ID | Bug Description | Requested In | Current Status | Notes / Evidence |
|---|---|---|---|---|
| B-001 | Table/Pivot scroll bleed (rows visible above sticky header) | Earlier bug list + repeated chats | Done | Sticky header and table-wrap spacing updates are present. |
| B-002 | Column Properties UI alignment/overlap with Conditional Formatting | Multiple repeated chats | Done | Column Properties and Table CF are separated into dedicated sections; compact grid UI added. |
| B-003 | Line/Scatter extra unexplained line appears by default | Repeated chats | Partial | Ref-lines are opt-in; stats/trend defaults hardened. User still reports extra line in some scenarios, so full redesign still pending. |
| B-004 | Axis labels not mapped to column names across many visuals | Repeated chats | Partial | Mapped-axis fallback exists in many renderers, but broad all-visual normalization still incomplete. |
| B-005 | Hover labels show generic X/Y instead of mapped names | Repeated chats | Partial | Improved in line/selected paths; full cross-visual parity still pending. |
| B-006 | Apply is slow for single-visual setting changes | Repeated chats | Partial | Prior optimization reduced full-grid rerenders; deeper performance refactor still pending. |
| B-007 | Funnel mapping resets/defaults incorrectly (stage none/not rendering) | Earlier bug list | Done | Mapping normalization/fallback updates added previously. |
| B-008 | Sunburst mapped columns not respected | Earlier bug list | Done | Mapping normalization/fallback updates added previously. |
| B-009 | Heatmap mapping issues/errors (including `firstKey` runtime issues) | Earlier bug list | Done | Runtime helper and mapping fixes were applied in prior passes. |
| B-010 | Bubble visual runtime error (`firstKey is not defined`) | Earlier bug list | Done | Shared helper scope fixed in prior pass. |
| B-011 | Control Chart mapping issues | Earlier bug list | Done | Mapping fallback updates applied previously. |
| B-012 | Pivot headers repeating; suppression refinement needed | Later backlog chats | Partial | Added suppress repeated row-header option and render-path suppression; further multi-level suppression refinement may still be needed. |
| B-013 | Type/View exists but not expanding/working in some visuals | Later backlog chats | Partial | Type/View moved to Mapping and works for compatible sets; some visual-specific expansions remain pending. |
| B-014 | Legend overlaps axis titles/values (esp. right legend + y2) | Later backlog chats | Partial | Increased right-legend margin compensation (including larger y2 case); needs validation on dense dashboards. |
| B-015 | Donut 100% rendering not correct | Later backlog chats | Pending | Requested repeatedly; redesign polish still pending. |
| B-016 | Download menu UI not modern and PDF pagination splits visuals across pages | Later backlog chats | Pending | Requested; not yet fully redesigned/pagination-hardened. |

---

## Enhancements

| Enh ID | Enhancement Request | Requested In | Current Status | Notes / Evidence |
|---|---|---|---|---|
| E-001 | Separate full-width collapsible Column Properties section | Repeated chats | Done | Implemented outside Visual Behavior section. |
| E-002 | Compact Column Properties controls (small width/height, no spinner, short align labels L/C/R) | Repeated chats | Done | Compact CSS and short alignment labels applied. |
| E-003 | Table/Pivot default row limit should be 0 | Repeated chats | Done | Defaults and option fallbacks switched to 0. |
| E-004 | Table/Pivot column sorting options | Repeated chats | Done | Table header click sort + Pivot row/col sort options available. |
| E-005 | Move Type/View from Format tab to Mapping tab | Repeated chats | Done | Type/View moved to Mapping for compatible visuals. |
| E-006 | Bulk add visuals + auto-map nth measure across created visuals | Mid backlog chats | Done | Add Count and auto-map logic were added earlier. |
| E-007 | Visual-type-aware Format option controls | Mid backlog chats | Partial | Quick-nav filtering done; deeper per-control matrix still pending. |
| E-008 | Line+Bar with up to 6 line trends (Y1) + single bar (Y2) | Mid backlog chats | Needs Validation | Implemented claim exists; user reported mixed confidence; keep open for validation. |
| E-009 | Multi-Y visual up to Y1..Y6 with per-axis type selection | Mid backlog chats | Needs Validation | Implemented claim exists; keep open pending user functional validation. |
| E-010 | Stacked Bar expanded Type/View variants (H/V grouped/stacked/100%) | Mid backlog chats | Partial | Claimed added, but user reported not visible/working in places. |
| E-011 | Add visuals-per-row and visual-height controls for end users | Later chats | Done | Manager-level controls exist for layout sizing. |
| E-012 | Conditional Formatting for Pivot table | Later chats | Partial | Pivot now exposes Table/Pivot CF section and applies CF rules to pivot value cells; parity enhancements still pending. |
| E-013 | Conditional Formatting for most/all visuals | Later chats | Partial | Generic CF exists for many charts, but full parity still pending. |
| E-014 | Single-measure visuals: configurable target/min/max from columns or manual | Later chats | Partial | Target controls exist for cartesian/selected visuals; not complete across all single-measure visuals. |
| E-015 | Column properties across all possible visuals | Later chats | Partial | Strong in table/pivot; broader cross-visual formatting matrix remains pending. |
| E-016 | Modern redesign for Gauge/KPI/Scorecard/Progress + additional view types | Later chats | Pending | Requested multiple times; not yet completed. |
| E-017 | Deep apply-performance refactor (strict single-visual update path) | Later chats | Partial | Some optimizations done; deep refactor still pending. |
| E-018 | Modernized download menu (Raw data excel + Visuals PDF) | Later chats | Pending | Requested; redesign work pending. |

---

## Last 3-message Focus Checklist (as requested)

### Bugs from recent asks
1. **B-003** Extra line in line/scatter → **Partial**
2. **B-004** Axis labels not mapped everywhere → **Partial**
3. **B-005** Hover X/Y naming not mapped everywhere → **Partial**
4. **B-006** Apply latency across visuals → **Partial**
5. **B-013** Type/View not expanding in all visuals → **Partial**
6. **B-014** Legend overlap with axes/y2 → **Partial**
7. **B-015** Donut 100% not correct → **Pending**
8. **B-016** PDF split/alignment + old download menu UX → **Pending**
9. **B-012** Pivot repeated header suppression → **Partial**

### Enhancements from recent asks
1. **E-001/E-002** Column Properties separate + compact UI → **Done**
2. **E-003** Table/Pivot row limit default 0 → **Done**
3. **E-004** Table/Pivot sort options → **Done**
4. **E-005** Move Type/View to Mapping tab → **Done**
5. **E-010** Stacked bar expanded view modes → **Partial**
6. **E-012/E-013** Pivot CF + broad CF expansion → **Partial**
7. **E-015** Column properties across most visuals → **Partial**
8. **E-016** Modern KPI/Gauge/Scorecard/Progress redesign → **Pending**
9. **E-017** Deep performance refactor → **Partial**

---

## Update Log

- 2026-02-24 05:05 UTC: Tracker restructured into separate **Bugs** and **Enhancements** sections with distinct IDs, detailed status fields, and an explicit “Last 3-message Focus Checklist” to track what is done vs pending.

- 2026-02-24 05:23 UTC: Partial/pending backlog pass: added Pivot conditional-format application on value cells, added Pivot suppress-repeated-row-header option, widened right-legend margin compensation for y2 layouts, and synced V4/minimal/bundles. Updated statuses for B-012 and E-012 to Partial.

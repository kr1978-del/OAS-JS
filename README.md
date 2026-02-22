# OAS-JS
A future-ready, modular analytics dashboard tailored for Oracle Analytics Server (OAS), supporting advanced charting, dynamic criteria, export options, AI insights, and responsive mobile/touch design.

## Complete file for OAS Narrative Postfix (copy/paste)
Use this as the **complete current version** to paste directly in Narrative View Postfix:

- `VM_V3_FOR_OAS_POSTFIX_COPY_READY.txt`

Equivalent HTML source (same content):
- `VM_V3_FOR_OAS_POSTFIX.html`

## Latest functional fixes
- Candidate Columns multi-select keeps lightweight behavior and shows `✓` ticks for selected columns.
- Auto Visual now attempts **automatic mapping** from selected candidate columns when adding a visual.
- Visual Settings footer uses **Close** label (instead of Cancel).
- Target lines now resolve correctly from **manual values** and **min/max columns** in line visuals (and matching legend helper traces there).
- Scatter/Regression chart title rendering adjusted to avoid clipping at the top.


## Developer docs and QA assets
- `VM_V3_DEVELOPER_HELP.html` — comprehensive Visual Manager/Visual Settings/modebar guide with navigation links.
- `VM_V3_TEST_DATA.json` — sample dataset for validating visual mappings and settings.


## Current implementation status (updated)
### Done
- Search box in Visual Settings is now available across all tabs (Mapping, Format, Filter, Advanced).
- Expand all / Collapse all in Visual Settings is available from all tabs.
- Manager/help sections default to collapsed.
- Fullscreen modal layering improved (dialogs open above fullscreen host).
- Modebar `remove` and `fs` made available for all visual groups.
- Deep QA matrix now includes all 34 visual types with per-tab + modebar pass/fail status (`VM_V3_QA_MATRIX.md`).
- Visual Settings Format tab now includes expanded quick-nav chips/submenus for all major option groups (presets, style, stats, legend, labels, sort, axes/ticks, targets, references, palette, outliers, axis settings, modebar, conditional formatting).
- Expand all / Collapse all now applies to all settings sections in the active tab.
- Fullscreen modebar icon is forced available across visual types for consistency.
- Modebar uses a compact header pattern: **Settings icon** (if enabled) + **Visual Actions** (three-dots) + always-visible **Fullscreen** icon, so actions remain accessible on narrow cards.
- Visual title in card header now supports up to two wrapped lines before ellipsis (prevents abrupt truncation for long titles).
- Visual title formatting in **Format** tab can be applied as a global default (with per-visual settings still overriding for that specific chart).
- Visual Settings sections now support accordion behavior (opening one section closes other sections unless using Expand all).
- Fullscreen enter/exit now uses lightweight card class toggling (instead of browser fullscreen API per visual action) for smoother performance.

### Planned next
- Full per-option-value certification (toggle every control in Format/Filter/Advanced and assert visual output deltas).
- Additional fine-grained UI compaction and spacing normalization for ultra-small laptop widths.

- `VM_V3_QA_MATRIX.md` — current QA matrix and status by feature area.


## Narrative auto-mapping helper (column name + order)
If you want Narrative mappings generated automatically from criteria column order, use:

- `node generate_narrative_placeholders.js --columns "Site Line Design,Cell ID,Cell Age (days),Latest Comb drop" --start 2 --json`

Example output:
```json
{
  "Site Line Design":"@{2}",
  "Cell ID":"@{3}",
  "Cell Age (days)":"@{4}",
  "Latest Comb drop":"@{5}"
}
```

You can also pass a file: `--file columns.txt` (comma/newline list or JSON array).

- `OAS_NARRATIVE_JSON_GENERATOR.html` — paste-ready Static Text utility with **two input modes**:
  - SQL mode: parse Advanced tab `s_#` aliases.
  - XML mode: parse `<saw:columns>` and prefer `<saw:columnHeading><saw:text>` captions (recommended for formula columns).

  - Note: generator avoids literal `@{...}` in script source to prevent OAS pre-processing inside Static Text, and auto-disambiguates duplicate labels as `Label [s_n]`.


## Current version files (history files removed)
Use these as the active/current set:
- `VM_V3_FOR_OAS_POSTFIX.html`
- `VM_V3_FOR_OAS_POSTFIX_COPY_READY.txt`
- `OAS_NARRATIVE_JSON_GENERATOR.html`
- `generate_narrative_placeholders.js`
- `VM_V3_DEVELOPER_HELP.html`
- `VM_V3_TEST_DATA.json`

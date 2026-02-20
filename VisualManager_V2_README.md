# VisualManager_V2 Template README

## Objective
VisualManager_V2.html is a single-file dashboard template that renders a grid of Plotly-based visuals with a built-in Visual Manager. The goal is to let report builders configure visuals (mapping, options, filters, layout) directly in the browser, without rebuilding the template.

## What This Template Does
- Renders many visual types from one registry-driven engine.
- Provides a Visual Manager modal for global layout, appearance, and data override.
- Provides per-visual settings for mapping, options, filters, and advanced layout.
- Uses a custom header toolbar (modebar) so controls are consistent across browsers and OAS versions.
- Supports both automatic grid layout and custom grid designer.

## Key Concepts
- Visual registry: each visual type defines default settings and a render function.
- STATE: saved configuration (globals, visuals, data, sections).
- Per-visual overrides: each visual can override global settings.
- Runtime updates: some toolbar actions use Plotly.relayout or restyle for fast updates.

## Primary Features
- Visual types: line, bar, pie, scatter, histogram, box, heatmap, KPI, table, pivot, and more.
- Visual settings modal:
  - Mapping tab for field/measure selection.
  - Options tab for chart behavior and conditional formatting.
  - Filter tab for per-visual data filters.
  - Advanced tab for layout overrides.
- Global manager modal:
  - Layout control: columns, spacing, card height.
  - Appearance: theme and palette.
  - Modebar icon defaults.
  - Sections: split visuals by a column value.
  - Custom grid designer: drag/resize tiles and map visuals.
- Custom header toolbar (modebar): reset, points, filter, zoom, remove, download, fullscreen, settings.

## How To Use
1. Open Visual Manager using the toolbar button in the title bar.
2. Add visuals from the Visuals tab.
3. Open any visual settings from the header toolbar (settings icon).
4. Map fields, set options, and apply changes.
5. Use Layout tab for grid settings or switch to Custom grid for manual placement.

## Data Sources
- In OAS narratives, data is expected from a hidden div like #box-data.
- For testing, you can paste JSON data into the Visual Manager Data tab.

## Modebar (Header Toolbar)
- Plotly native modebar is disabled to keep UI consistent.
- The custom toolbar routes actions to Plotly APIs:
  - Reset / Autoscale: Plotly.relayout
  - Zoom / Pan / Select / Lasso: Plotly.relayout dragmode
  - Export: Plotly.downloadImage
  - Fullscreen: requestFullscreen
  - Settings: opens per-visual settings

## Layout Modes
- Auto: grid with fixed columns and card height.
- Custom: tile-based layout with drag/resize.

## Persistence
- Configuration is stored in localStorage when persistence is enabled.
- There is a reset option in the Help tab.

## File Structure
- VisualManager_V2.html is a single file with HTML, CSS, and JavaScript.
- Registry, renderers, UI, and state management all live inside the file.

## Current Work Focus
- Make global palette selection easier and consistent across visuals.
- Improve performance when applying settings or switching visual types.
- Ensure custom header toolbar icons work consistently.

## Troubleshooting Tips
- If modebar icons do not respond, check that the toolbar buttons exist in the header and that click handlers are attached.
- If a visual does not render, check mapping requirements in the Mapping tab.
- If performance is slow, try changing a single visual and avoid full grid re-render.

## Related Files
- VisualManager_V2.html is the main template.
- VisualManager.html is the earlier version.
- LineTrend_v2.html and other files contain older visual patterns and reference styles.

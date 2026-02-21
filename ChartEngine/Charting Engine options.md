# OAS-JS Chart Dashboard — Comprehensive Functional & Feature Requirements (v2)

## 1. Overview
The OAS-JS Chart Dashboard is a flexible, modern analytics UI for visualizing, exploring, and analyzing process, quality, and operational data. It supports all major statistical, business, and process control chart types, interactive filtering, event overlays, conditional formatting, pivot tables, gauges, and more. The dashboard is designed to be highly configurable, allowing users to build custom charts by drag & drop, supporting multi-measure and multi-chart layouts.

## 2. Data Handling & Configuration

### 2.1. Dataset Input
- **Input Format:** Data is provided as a JSON array, with columns for measures (metrics), attributes (dimensions), and optional metadata.
- **Sanitization:** Handles trailing commas, BOM, and malformed JSON gracefully.
- **Column Recognition:** Automatically detects all columns, tags as "measure" or "attribute" by type or user-override.
- **Data Types:** Supports standard types: Line (string), Date, DateTime, Int, Decimal, Varchar. User can override/annotate types in chart settings.

### 2.2. Flexible Chart Assignment
- **Empty Plot as Default:** On dashboard load, presents an empty chart card with all available columns listed as draggable chips (measures, attributes).
- **Drag & Drop Chart Assignment:** User can drag columns to X axis, one or more Y axes, series/group/color, mouseover/tooltip, and advanced slots (LSL/USL/Target, event line, etc).
- **Multi-measure Charts:** User can assign multiple measures (Y axes) to a single chart (e.g., overlay line/bar, dual axes, correlation pairs).
- **Multi-chart per card:** Option to plot different chart types (e.g., bar and line) for selected measures in the same card.
- **Aggregation:** No aggregation is performed by default. User can specify aggregation (AVG, SUM, MIN, MAX, COUNT, NONE) per measure in chart properties.
- **Dynamic Chart Layout:** User can create as many chart cards as desired; each card can contain multiple measures, attributes, and chart types.

### 2.3. Data Type & Display Formatting
- **Explicit Data Type Assignment:** In chart properties, user can specify column data types if auto-detection is incorrect.
- **Decimal Places:** User can set decimal places for Y axis, X axis (if numeric), and mouseover tooltips independently.
- **Date/Time Formatting:** Supports multiple date/time formats for axis, tooltip, event overlay.

## 3. Chart Types Supported

### 3.1. Statistical & Process Charts
- **Line Chart (single/multi Y axis)**
- **Bar Chart (single/multi, stacked)**
- **Area Chart (stacked/overlaid)**
- **Scatter Plot**
- **Bubble Chart**
- **Box Plot**
- **Violin Plot**
- **Histogram**
- **Pie/Donut**
- **SPC Control Chart (Xbar, R, S, Individuals, Moving Range, EWMA, CUSUM)**
- **Pareto Chart**
- **Capability Analysis (Cp, Cpk, Pp, Ppk, etc.)**
- **Correlation Matrix (n x n measures; heatmap or table)**
- **Run Chart**
- **Trend Chart**
- **Event Overlay Chart (vertical lines with icons for events)**
- **Gauges (single/multi value, donut, bullet, radial)**
- **Pivot Table (with conditional formatting, aggregation)**

### 3.2. Business & Modern Visuals
- **KPI Cards**
- **Gauge Cards**
- **Pivot Table/Interactive Table**
- **Modern Card Visuals (with metrics, sparklines, indicators)**

### 3.3. Chart Engine Selection
- **Chart Engine Choice:** Internally supports Plotly, ApexCharts, ECharts. For some chart types (e.g., gauge, heatmap, advanced pivots), the dashboard may auto-select the optimal engine, or user can override.

## 4. Chart Properties & User Interactions

### 4.1. Chart Builder (Drag & Drop UI)
- **Empty Plot on Add:** Presents all columns as draggable chips for assignment.
- **Y Axis (Measures):** Drag one or more measures to create multi-Y charts.
- **X Axis (Attributes):** Drag attribute(s) to X axis (category, time, or numeric).
- **Series/Grouping/Color:** Assign attribute(s) for color/series grouping.
- **Tooltip/Mouseover:** Assign columns for tooltip display; set decimal places.
- **Advanced Slots:** LSL, USL, Target (for capability/SPC), event lines (date, label, icon, color).
- **Chart Type:** Single dropdown; supports multi-chart overlay (e.g., bar/line) in one card.
- **Aggregation:** User can set aggregation type per measure.
- **Data Type Override:** Specify or correct column data type for axes, series, measures.
- **Conditional Formatting:** Set rules for color, icon, font, background based on value ranges for charts and tables.
- **Decimal Formatting:** Specify decimal places for axes, tooltips, labels.

### 4.2. Event Overlay (Time Series)
- **Event Line Add:** For time-series charts, user can add events as vertical lines, each with optional icon, label, color.
- **Event Icon Selection:** Choose icon/glyph per event (e.g., ⚡, 🛑, 🟢, 🔔).
- **Multiple Events:** Overlay any number of events per chart.
- **Event Data Source:** Drag column to event slot or manually enter event list.

### 4.3. Pivot Table & Table Options
- **Pivot Table Builder:** Drag columns to Rows, Columns, Values, Filters.
- **Aggregation per Value:** Choose aggregation (SUM, AVG, COUNT, etc.) per value column.
- **Conditional Formatting:** Color cells, text, or icons based on value rules.
- **Sorting & Filtering:** Sort and filter by any column.
- **Export:** Download pivot/table as CSV, Excel, PDF.
- **Group By:** Custom grouping by attribute.

### 4.4. Conditional Formatting Everywhere
- **Charts:** Color points, bars, lines, backgrounds, labels, icons based on value or rule (e.g., if value > USL, color red, show ⚠).
- **Tables/Pivot:** Format cell/background/text/icon by value or rule.

## 5. Custom Toolbar (Modebar)

### 5.1. Custom Buttons (Per Chart Card)
- **Settings (Chart Properties)**
- **Filters**
- **Zoom & Axis**
- **Theme Toggle (Light/Dark)**
- **Add Chart/Card**
- **Remove Chart/Card**
- **Reset Chart**
- **Download (PNG, SVG, CSV, Excel)**
- **Fullscreen**
- **Capability Analysis** only for Histogram other wise hide.
- **Insights (Quick Stats)**
- **Pivot Table Builder**
- **Gauge Builder**
- **Engine Selector (Plotly/ApexCharts/ECharts per chart)**

### 5.2. Display
- **Always visible, top-right of card.**
- **Icons/glyphs or SVG (emoji fallback if icons missing).**
- **Popups are draggable, resizable, never clipped.**

## 6. Filtering & Outlier Handling

### 6.1. Filter Panel
- **Exclude Zeros**
- **Exclude Outliers (1.5×IQR)**
- **Exclude Extremes (±3×IQR)**
- **Range Filter (Min/Max)**
- **Clear Filters**
- **Clear Exclusions**
- **Alt+Click Data Point:** Exclude point from chart.

## 7. Chart Properties Panel

### 7.1. General Chart Settings
- **Title, Subtitle, Colors**
- **Legend Position & Visibility**
- **Card Border/Radius/Color/Shadow**
- **Plot Background Color/Image/Opacity**
- **Line Type/Shape/Width**
- **Panel Axes Control (same axes for all panels)**
- **Axes Types/Scales/Ranges**
- **Gridlines/Tick Labels**
- **Decimal Places (axes, tooltips)**
- **Aggregation (per measure)**
- **Data Type Override (for axes, measures, series, events)**
- **Trilles columns, Rows plot multiple charts based on series or if multiple measures dragged plor seperate chart for measure. Give option to choose same x axes or different x axes.
- **Tootltip provision to dra data set columns
- **Chart instructions (Text box to enter)
- **provision to choose different color per measure and for multi chart provision to choose which measure as line and which as bar/area.

### 7.2. Advanced Statistical Options
- **SPC Sigma Level**
- **LSL/USL/Target (manual or column based)**
- **Subgroup Size (manual or column based)**
- **Show Limits in Legend**
- **Show Outliers, Extremes**
- **Correlation Analysis (select n measures)**
- **Pareto Analysis (select measure, aggregation)**

### 7.3. Gauge & KPI Options
- **Gauge Type Selection**
- **Min/Max/Target**
- **Value Mapping**
- **Conditional Formatting (color, icon)**

## 8. Engine Selection

### 8.1. Chart Engine
- **Default:** Plotly.js for most charts.
- **Alternate Engines:** For specific chart types (gauges, advanced pivots, heatmaps, large data), ApexCharts or ECharts can be selected by user or auto-chosen by dashboard.
- **Engine Selector:** Per chart card, allows user to switch rendering engine.

## 9. Appearance & Theming

### 9.1. Theming
- **Light/Dark Toggle (global and per card)**
- **Custom Colors (title, legend, card border, background)**
- **High-contrast modes for accessibility**

### 9.2. Layout
- **Responsive Grid/Card Layout**
- **Cards Stack Vertically or in Grid**
- **Header Shows Chart Title**

## 10. Download & Export
- **Chart Download:** PNG, SVG, Excel, PDF.
- **Table/Pivot Download:** CSV, Excel, PDF.
- **Export All Charts/Cards:** As a bundle.

## 11. Error Handling & Usability
- **Invalid JSON:** Friendly error message.
- **No Data:** “No data rows” message.
- **Chart Rendering Errors:** Pop up message, rest of dashboard continues.
- **Keyboard Navigation:** Popups and toolbar accessible by keyboard.
- **Tooltips:** All toolbar and chart controls have tooltips.
- **Accessibility:** High-contrast, ARIA labels, screen reader support.
- **Performance:** Handles large datasets by lazy-rendering, efficient chart engine selection.

## 12. Future Enhancements (Roadmap)
- **Advanced Analytics:** Moving average, EWMA, CUSUM, regression, forecasting.
- **User-defined Calculated Measures**
- **Drilldown/Linked Charts**
- **Customizable pivot table formulas**
- **Interactive dashboard layouts (drag/drop cards, resize/move cards)**
- **User authentication & sharing**
- **Integration with external data sources**
- **Annotation/Commenting on charts**

---

## Summary

This requirements document defines a flexible, modern analytics dashboard supporting:
- Multi-measure, multi-chart assignment per card
- Drag/drop chart builder UI
- All major statistical, business, and process control charts
- Gauge and modern KPI visuals
- Pivot/table with conditional formatting
- Explicit data typing, decimal formatting, aggregation control
- Full event overlay support for time series
- Robust custom toolbar and popups
- Engine selection per chart type
- Accessibility, error handling, and future extensibility

Persistence & User Mode Specification
This specification outlines a two-mode system: an "Edit Mode" for report authors and a "Read-Only Mode" for consumers. The goal is to allow authors to define a persistent, static configuration for the charts that all consumers will see, while still allowing consumers temporary, session-only interaction.

1. High-Level Concept: Base Configuration vs. Session Interaction
Base Configuration (The "Golden Copy"):

This is the set of chart properties defined by a report author in Edit Mode.
It is saved as a static block of text (JSON) directly within the OAS analysis definition itself. This is typically done by storing the JSON string in a hidden element, like a Narrative view or a data attribute on an HTML element.
This configuration is universal. Every user on every browser will see the charts rendered with these exact settings when they first open the report.
Session Interaction (Temporary Changes):

When a Read-Only User interacts with a chart (e.g., applying a filter, zooming), these changes are temporary and exist only for their current viewing session.
These changes are never saved back to the Base Configuration. If the user refreshes the page or closes the browser, these temporary changes are lost, and the report reverts to the Base Configuration.
2. User Roles & Functionality
A. "Edit Mode" (for Report Authors)

Purpose: To define and save the default appearance and behavior of the charts.
Workflow:
The author opens the analysis in OAS's standard edit mode.
The "Chart Properties" (⚙️) icon on the modebar is visible and fully functional.
The author uses the full properties panel (Assignments, Axes, General, Limits) to configure every aspect of the chart (type, colors, titles, LSL/USL, etc.).
When the author saves the OAS analysis, the current state of all charts is serialized into a JSON string. This string is then saved into the designated static text area within the analysis.
This saved JSON becomes the new Base Configuration for all users.
B. "Read-Only Mode" (for Consumers)

Purpose: To view and interact with the pre-configured report.
Workflow:
A consumer opens the saved analysis. The charts render exactly as defined in the Base Configuration.
The "Chart Properties" (⚙️) icon on the modebar is hidden or disabled. The consumer cannot make permanent changes to the chart's style, type, or data assignments.
Permitted Interactions: The consumer can use the other modebar icons to temporarily interact with the chart:
Filter (▽): Apply temporary filters.
Zoom (🔍): Zoom in and out of the chart.
Download (💾): Download the current view of the chart.
Stats Table (Σ): View the statistical summary.
Theme (🌓): Change the theme for their current session.
The "Reset" Button (🔄): This is the most critical feature for the consumer. When clicked, it will:
Discard all temporary session interactions (filters, zoom levels).
Re-apply the original Base Configuration that was saved by the report author.
It does not revert to a hardcoded application default; it reverts to the specific default for that report.

It serves as a blueprint for dashboard development, ensuring clarity, flexibility, and ease of use for advanced analytics and enterprise reporting.
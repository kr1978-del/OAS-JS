# Plotly Chart Engine - Enhanced Complete Documentation
## With Statistical Features, UI Panel Structure, and Property Matrix

> **Version**: 2.0  
> **Last Updated**: October 2025  
> **Purpose**: Complete implementation guide for Plotly chart engine with UI design specifications

---

## Table of Contents

1. [Chart Types Master Table](#chart-types-master-table)
2. [Property Applicability Matrix](#property-applicability-matrix)
3. [UI Panel Structure](#ui-panel-structure)
4. [Enhanced Statistical Features](#enhanced-statistical-features)
5. [Conditional Formatting](#conditional-formatting)
6. [Time Series Events](#time-series-events)
7. [Data Binding Interface](#data-binding-interface)

---

## Chart Types Master Table

### Property Applicability Legend
- **M** = Mandatory (Required for chart to render)
- **O** = Optional (Can be configured but not required)
- **C** = Conditional (Available based on other settings)
- **NA** = Not Applicable (Not relevant for this chart type)

| Chart Type | ID | Measures | Attributes | X-Axis | Y-Axis | Color | Size | Orientation | Stack | Trend | Events | Conditional Format |
|------------|-----|----------|------------|--------|--------|-------|------|-------------|-------|-------|--------|-------------------|
| **Line** | `line` | M(1+) | M(1) | M | M | O | NA | NA | O | O | O | O |
| **Bar** | `bar` | M(1+) | M(1) | M | M | O | NA | O | O | NA | NA | O |
| **Column** | `column` | M(1+) | M(1) | M | M | O | NA | NA | O | NA | NA | O |
| **Scatter** | `scatter` | M(2) | O | M | M | O | O | NA | NA | O | O | O |
| **Bubble** | `bubble` | M(3) | O | M | M | O | M | NA | NA | O | O | O |
| **Pie** | `pie` | M(1) | M(1) | NA | NA | O | NA | NA | NA | NA | NA | O |
| **Donut** | `donut` | M(1) | M(1) | NA | NA | O | NA | NA | NA | NA | NA | O |
| **Area** | `area` | M(1+) | M(1) | M | M | O | NA | NA | O | O | O | O |
| **Histogram** | `histogram` | M(1) | O | M | M | O | NA | O | O | NA | NA | O |
| **Box Plot** | `box` | M(1) | O | M | M | O | NA | O | NA | NA | NA | O |
| **Violin** | `violin` | M(1) | O | M | M | O | NA | O | NA | NA | NA | O |
| **Heatmap** | `heatmap` | M(1) | M(2) | M | M | M | NA | NA | NA | NA | NA | M |
| **Treemap** | `treemap` | M(1) | M(2+) | NA | NA | O | NA | NA | NA | NA | NA | O |
| **Sunburst** | `sunburst` | M(1) | M(2+) | NA | NA | O | NA | NA | NA | NA | NA | O |
| **Waterfall** | `waterfall` | M(1) | M(1) | M | M | O | NA | O | NA | NA | O | O |
| **Funnel** | `funnel` | M(1) | M(1) | NA | NA | O | NA | O | NA | NA | NA | O |
| **Gauge** | `gauge` | M(1) | NA | NA | NA | O | NA | NA | NA | NA | NA | M |
| **Bullet** | `bullet` | M(1) | O | NA | NA | O | NA | O | NA | NA | NA | M |
| **Candlestick** | `candlestick` | M(4) | M(1) | M | M | NA | NA | NA | NA | O | O | O |
| **OHLC** | `ohlc` | M(4) | M(1) | M | M | NA | NA | NA | NA | O | O | O |
| **Radar** | `radar` | M(3+) | M(1) | NA | NA | O | O | NA | NA | NA | NA | O |
| **Sankey** | `sankey` | M(1) | M(2) | NA | NA | O | NA | NA | NA | NA | NA | O |
| **Choropleth** | `choropleth` | M(1) | M(1) | NA | NA | M | NA | NA | NA | NA | NA | M |
| **3D Scatter** | `scatter3d` | M(3) | O | M | M | O | O | NA | NA | O | NA | O |
| **3D Surface** | `surface` | M(1) | NA | M | M | M | NA | NA | NA | NA | NA | O |
| **Parallel Coords** | `parcoords` | M(3+) | O | NA | NA | O | NA | NA | NA | NA | NA | O |
| **Gantt** | `gantt` | M(2) | M(1) | M | M | O | NA | NA | NA | NA | O | O |
| **Indicator** | `indicator` | M(1) | NA | NA | NA | O | NA | NA | NA | NA | NA | M |

---

## Property Applicability Matrix

### Complete Property Matrix by Category

| Property Category | Property Name | Line | Bar | Scatter | Pie | Histogram | Box | Heatmap | Treemap | Gauge | 3D | Map | Gantt |
|------------------|---------------|------|-----|---------|-----|-----------|-----|---------|---------|-------|----|----|-------|
| **DATA BINDING** |
| Measure Fields | `measures[]` | M | M | M | M | M | M | M | M | M | M | M | M |
| Attribute Fields | `attributes[]` | M | M | O | M | O | O | M | M | NA | O | M | M |
| Color By | `colorBy` | O | O | O | O | O | O | M | O | O | O | M | O |
| Size By | `sizeBy` | NA | NA | O | NA | NA | NA | NA | NA | NA | O | NA | NA |
| Tooltip Fields | `tooltipFields[]` | O | O | O | O | O | O | O | O | O | O | O | O |
| **AXES** |
| X-Axis Type | `xAxisType` | M | M | M | NA | M | M | M | NA | NA | M | NA | M |
| Y-Axis Type | `yAxisType` | M | M | M | NA | M | M | M | NA | NA | M | NA | M |
| X-Axis Scale | `xScale` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Y-Axis Scale | `yScale` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| X-Axis Min | `xMin` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| X-Axis Max | `xMax` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Y-Axis Min | `yMin` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Y-Axis Max | `yMax` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Start From Zero | `startFromZero` | O | M | O | NA | O | NA | NA | NA | NA | O | NA | O |
| **VISUAL** |
| Orientation | `orientation` | NA | O | NA | NA | O | O | NA | NA | O | NA | NA | NA |
| Stack Mode | `stackMode` | O | O | NA | NA | O | NA | NA | NA | NA | NA | NA | NA |
| Line Type | `lineType` | O | NA | C | NA | NA | NA | NA | NA | NA | C | NA | O |
| Line Width | `lineWidth` | O | NA | C | NA | NA | NA | NA | NA | NA | C | NA | O |
| Marker Size | `markerSize` | O | NA | O | NA | NA | C | NA | NA | NA | O | O | NA |
| Marker Symbol | `markerSymbol` | O | NA | O | NA | NA | C | NA | NA | NA | O | O | NA |
| Bar Width | `barWidth` | NA | O | NA | NA | O | O | NA | NA | NA | NA | NA | NA |
| Opacity | `opacity` | O | O | O | O | O | O | O | O | O | O | O | O |
| **STATISTICAL** |
| Regression Line | `regressionLine` | O | NA | O | NA | NA | NA | NA | NA | NA | O | NA | NA |
| Regression Type | `regressionType` | C | NA | C | NA | NA | NA | NA | NA | NA | C | NA | NA |
| R-Squared | `showRSquared` | C | NA | C | NA | NA | NA | NA | NA | NA | C | NA | NA |
| Confidence Interval | `confidenceInterval` | C | NA | C | NA | NA | NA | NA | NA | NA | C | NA | NA |
| Average Line | `avgLine` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Median Line | `medianLine` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Standard Deviation | `stdDeviation` | O | O | O | NA | O | O | NA | NA | NA | O | NA | NA |
| Density Curve | `densityCurve` | NA | NA | O | NA | O | NA | NA | NA | NA | NA | NA | NA |
| KDE Bandwidth | `kdeBandwidth` | NA | NA | C | NA | C | NA | NA | NA | NA | NA | NA | NA |
| Moving Average | `movingAvg` | O | NA | NA | NA | NA | NA | NA | NA | NA | NA | NA | NA |
| MA Period | `maPeriod` | C | NA | NA | NA | NA | NA | NA | NA | NA | NA | NA | NA |
| **BINNING** |
| Number of Bins | `nBins` | NA | NA | NA | NA | M | NA | NA | NA | NA | NA | NA | NA |
| Bin Size | `binSize` | NA | NA | NA | NA | O | NA | NA | NA | NA | NA | NA | NA |
| Bin Algorithm | `binAlgorithm` | NA | NA | NA | NA | O | NA | NA | NA | NA | NA | NA | NA |
| **EVENTS** |
| Show Events | `showEvents` | O | NA | O | NA | NA | NA | NA | NA | NA | NA | NA | O |
| Event Data | `eventData[]` | C | NA | C | NA | NA | NA | NA | NA | NA | NA | NA | C |
| Event Icons | `eventIcons` | C | NA | C | NA | NA | NA | NA | NA | NA | NA | NA | C |
| Event Position | `eventPosition` | C | NA | C | NA | NA | NA | NA | NA | NA | NA | NA | C |
| **CONDITIONAL FORMATTING** |
| Enable CF | `enableConditionalFormat` | O | O | O | O | O | O | M | O | M | O | O | O |
| CF Rules | `conditionalRules[]` | C | C | C | C | C | C | C | C | C | C | C | C |
| CF Type | `cfType` | C | C | C | C | C | C | C | C | C | C | C | C |
| CF Colors | `cfColors[]` | C | C | C | C | C | C | C | C | C | C | C | C |
| CF Thresholds | `cfThresholds[]` | C | C | C | C | C | C | C | C | C | C | C | C |
| **GRID & LAYOUT** |
| Show X Grid | `showXGrid` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Show Y Grid | `showYGrid` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Grid Line Style | `gridLineStyle` | O | O | O | NA | O | O | NA | NA | NA | O | NA | O |
| Trellis Rows | `trellisRows` | O | O | O | O | O | O | NA | NA | NA | NA | NA | NA |
| Trellis Columns | `trellisCols` | O | O | O | O | O | O | NA | NA | NA | NA | NA | NA |
| **LEGEND** |
| Show Legend | `showLegend` | O | O | O | O | O | O | O | O | NA | O | O | O |
| Legend Position | `legendPosition` | O | O | O | O | O | O | O | O | NA | O | O | O |
| Legend Orientation | `legendOrientation` | O | O | O | O | O | O | O | O | NA | O | O | O |
| **LABELS** |
| Title | `title` | O | O | O | O | O | O | O | O | O | O | O | O |
| Subtitle | `subtitle` | O | O | O | O | O | O | O | O | O | O | O | O |
| X-Axis Label | `xAxisLabel` | O | O | O | NA | O | O | O | NA | NA | O | NA | O |
| Y-Axis Label | `yAxisLabel` | O | O | O | NA | O | O | O | NA | NA | O | NA | O |
| Data Labels | `showDataLabels` | O | O | O | O | O | NA | O | O | O | NA | NA | O |
| Label Format | `labelFormat` | O | O | O | O | O | NA | O | O | O | NA | NA | O |
| **THRESHOLDS** |
| Target Line | `targetLine` | O | O | O | NA | O | NA | NA | NA | M | NA | NA | O |
| Target Value | `targetValue` | C | C | C | NA | C | NA | NA | NA | M | NA | NA | C |
| Min Threshold | `minThreshold` | O | O | O | NA | O | NA | NA | NA | M | NA | NA | O |
| Max Threshold | `maxThreshold` | O | O | O | NA | O | NA | NA | NA | M | NA | NA | O |
| Threshold Zones | `thresholdZones[]` | O | O | O | NA | O | NA | NA | NA | M | NA | NA | O |
| **AGGREGATION** |
| Aggregation Type | `aggregationType` | O | O | NA | O | O | O | M | M | NA | NA | M | NA |
| Group By | `groupBy[]` | O | O | O | NA | O | O | O | O | NA | NA | O | NA |
| **INTERACTION** |
| Hover Mode | `hoverMode` | O | O | O | O | O | O | O | O | O | O | O | O |
| Click Action | `clickAction` | O | O | O | O | O | O | O | O | O | O | O | O |
| Zoom Enable | `enableZoom` | O | O | O | NA | O | O | O | NA | NA | O | O | O |
| Pan Enable | `enablePan` | O | O | O | NA | O | O | O | NA | NA | O | O | O |
| Selection Mode | `selectionMode` | O | O | O | O | O | O | O | O | NA | O | O | O |

---

## UI Panel Structure

### Panel Organization for Chart Properties

The chart properties UI should be organized into collapsible panels for better user experience. Here's the recommended structure:

```
┌─────────────────────────────────────────────────────────────┐
│                     Chart Engine UI Layout                   │
├───────────────────────┬─────────────────────────────────────┤
│                       │                                     │
│   DATA PANEL (Fixed)  │     PROPERTIES PANEL (Scrollable)   │
│                       │                                     │
│  ┌─────────────────┐  │  ┌─────────────────────────────┐   │
│  │ Dataset Fields  │  │  │ ▼ Chart Type Selection     │   │
│  │                 │  │  └─────────────────────────────┘   │
│  │ Measures:       │  │  ┌─────────────────────────────┐   │
│  │ □ Sales        │  │  │ ▶ 1. Data Mapping          │   │
│  │ □ Profit       │  │  └─────────────────────────────┘   │
│  │ □ Quantity     │  │  ┌─────────────────────────────┐   │
│  │                 │  │  │ ▼ 2. Axes Configuration    │   │
│  │ Attributes:     │  │  │   • X-Axis Settings        │   │
│  │ □ Date         │  │  │   • Y-Axis Settings        │   │
│  │ □ Category     │  │  │   • Scale Options          │   │
│  │ □ Region       │  │  └─────────────────────────────┘   │
│  │ □ Product      │  │  ┌─────────────────────────────┐   │
│  │                 │  │  │ ▶ 3. Visual Properties     │   │
│  └─────────────────┘  │  └─────────────────────────────┘   │
│                       │  ┌─────────────────────────────┐   │
│  ┌─────────────────┐  │  │ ▶ 4. Statistical Features  │   │
│  │ Drag fields     │  │  └─────────────────────────────┘   │
│  │ here or select  │  │  ┌─────────────────────────────┐   │
│  │ from above      │  │  │ ▶ 5. Conditional Format    │   │
│  └─────────────────┘  │  └─────────────────────────────┘   │
│                       │  ┌─────────────────────────────┐   │
│                       │  │ ▶ 6. Events & Annotations  │   │
│                       │  └─────────────────────────────┘   │
│                       │  ┌─────────────────────────────┐   │
│                       │  │ ▶ 7. Grid & Layout         │   │
│                       │  └─────────────────────────────┘   │
│                       │  ┌─────────────────────────────┐   │
│                       │  │ ▶ 8. Labels & Legends      │   │
│                       │  └─────────────────────────────┘   │
│                       │  ┌─────────────────────────────┐   │
│                       │  │ ▶ 9. Thresholds & Targets  │   │
│                       │  └─────────────────────────────┘   │
│                       │  ┌─────────────────────────────┐   │
│                       │  │ ▶ 10. Interaction Options  │   │
│                       │  └─────────────────────────────┘   │
└───────────────────────┴─────────────────────────────────────┘
```

### Detailed Panel Contents

#### Panel 1: Data Mapping
```yaml
Data Mapping:
  ├─ X-Axis: [Drag field or select] [Manual input option]
  ├─ Y-Axis: [Drag field or select] [Manual input option]
  ├─ Color By: [Drag field or select]
  ├─ Size By: [Drag field or select] (if applicable)
  ├─ Additional Measures: [+ Add measure]
  ├─ Group By: [Drag field or select]
  ├─ Aggregation: [Dropdown: Sum/Avg/Count/Min/Max]
  └─ Tooltip Fields: [Multi-select fields]
```

#### Panel 2: Axes Configuration
```yaml
Axes Configuration:
  ├─ X-Axis:
  │   ├─ Type: [Linear/Log/Date/Category]
  │   ├─ Scale: [Auto/Manual]
  │   ├─ Min: [Input or drag field]
  │   ├─ Max: [Input or drag field]
  │   ├─ Label: [Text input]
  │   └─ Format: [Format string]
  ├─ Y-Axis:
  │   ├─ Type: [Linear/Log]
  │   ├─ Start from Zero: [Checkbox]
  │   ├─ Scale: [Auto/Manual]
  │   ├─ Min: [Input or drag field]
  │   ├─ Max: [Input or drag field]
  │   ├─ Label: [Text input]
  │   └─ Format: [Format string]
  └─ Secondary Y-Axis: [Enable checkbox]
```

#### Panel 3: Visual Properties
```yaml
Visual Properties:
  ├─ Colors:
  │   ├─ Color Scheme: [Dropdown]
  │   ├─ Custom Colors: [Color pickers]
  │   └─ Opacity: [Slider 0-100%]
  ├─ Lines (if applicable):
  │   ├─ Type: [Solid/Dashed/Dotted]
  │   ├─ Width: [Slider 1-10]
  │   └─ Smoothing: [Linear/Spline/Step]
  ├─ Markers (if applicable):
  │   ├─ Show: [Checkbox]
  │   ├─ Size: [Slider or field]
  │   └─ Symbol: [Dropdown]
  ├─ Bars (if applicable):
  │   ├─ Width: [Slider 0-100%]
  │   ├─ Gap: [Slider 0-100%]
  │   └─ Stack Mode: [None/Normal/Percent]
  └─ Orientation: [Horizontal/Vertical]
```

#### Panel 4: Statistical Features
```yaml
Statistical Features:
  ├─ Regression:
  │   ├─ Show: [Checkbox]
  │   ├─ Type: [Linear/Polynomial/Lowess/Exponential]
  │   ├─ Order: [Number input] (if polynomial)
  │   ├─ Show R²: [Checkbox]
  │   └─ Confidence Interval: [Checkbox]
  ├─ Reference Lines:
  │   ├─ Average: [Checkbox]
  │   ├─ Median: [Checkbox]
  │   ├─ Standard Deviation: [Checkbox]
  │   └─ Custom: [+ Add reference line]
  ├─ Density:
  │   ├─ Show Density Curve: [Checkbox]
  │   ├─ KDE Bandwidth: [Auto/Manual]
  │   └─ Show Rug Plot: [Checkbox]
  ├─ Moving Average:
  │   ├─ Enable: [Checkbox]
  │   ├─ Period: [Number input]
  │   └─ Type: [Simple/Weighted/Exponential]
  └─ Histogram (if applicable):
      ├─ Bins: [Auto/Manual number]
      ├─ Normalization: [Count/Percent/Density]
      └─ Cumulative: [Checkbox]
```

#### Panel 5: Conditional Formatting
```yaml
Conditional Formatting:
  ├─ Enable: [Checkbox]
  ├─ Format Type: [Color Scale/Data Bars/Icons]
  ├─ Rules:
  │   ├─ Rule 1:
  │   │   ├─ Condition: [Greater/Less/Equal/Between]
  │   │   ├─ Value: [Input or drag field]
  │   │   ├─ Color: [Color picker]
  │   │   └─ Icon: [Icon selector]
  │   └─ [+ Add rule]
  ├─ Color Scale:
  │   ├─ Type: [2-Color/3-Color/Data bars]
  │   ├─ Min Color: [Color picker]
  │   ├─ Mid Color: [Color picker] (if 3-color)
  │   └─ Max Color: [Color picker]
  └─ Apply To: [All/Series/Specific points]
```

#### Panel 6: Events & Annotations
```yaml
Events & Annotations:
  ├─ Time Series Events:
  │   ├─ Enable: [Checkbox]
  │   ├─ Event Data:
  │   │   ├─ Date: [Date field]
  │   │   ├─ Label: [Text field]
  │   │   ├─ Icon: [Icon selector]
  │   │   └─ Color: [Color picker]
  │   ├─ Position: [Top/Bottom/On line]
  │   └─ [+ Add event]
  ├─ Annotations:
  │   ├─ Text Annotations: [+ Add text]
  │   ├─ Shapes: [+ Add shape]
  │   └─ Images: [+ Add image]
  └─ Alerts:
      ├─ Enable: [Checkbox]
      └─ Alert Rules: [+ Configure]
```

#### Panel 7: Grid & Layout
```yaml
Grid & Layout:
  ├─ Grid Lines:
  │   ├─ X-Grid: [Show/Hide]
  │   ├─ Y-Grid: [Show/Hide]
  │   ├─ Style: [Solid/Dashed/Dotted]
  │   └─ Color: [Color picker]
  ├─ Small Multiples:
  │   ├─ Enable: [Checkbox]
  │   ├─ Rows: [Field or number]
  │   ├─ Columns: [Field or number]
  │   └─ Share Axes: [None/X/Y/Both]
  ├─ Margins:
  │   ├─ Top: [Number px]
  │   ├─ Right: [Number px]
  │   ├─ Bottom: [Number px]
  │   └─ Left: [Number px]
  └─ Background:
      ├─ Color: [Color picker]
      └─ Image: [Upload]
```

#### Panel 8: Labels & Legends
```yaml
Labels & Legends:
  ├─ Titles:
  │   ├─ Main Title: [Text input]
  │   ├─ Subtitle: [Text input]
  │   ├─ Title Font: [Font selector]
  │   └─ Title Size: [Number]
  ├─ Data Labels:
  │   ├─ Show: [Checkbox]
  │   ├─ Position: [Auto/Inside/Outside]
  │   ├─ Format: [Format string]
  │   └─ Rotation: [Angle slider]
  ├─ Legend:
  │   ├─ Show: [Checkbox]
  │   ├─ Position: [Top/Right/Bottom/Left]
  │   ├─ Orientation: [Horizontal/Vertical]
  │   └─ Interactive: [Checkbox]
  └─ Tooltips:
      ├─ Enable: [Checkbox]
      ├─ Template: [Template editor]
      └─ Shared: [Checkbox]
```

#### Panel 9: Thresholds & Targets
```yaml
Thresholds & Targets:
  ├─ Target Line:
  │   ├─ Show: [Checkbox]
  │   ├─ Value: [Input or drag field]
  │   ├─ Label: [Text]
  │   └─ Style: [Line style options]
  ├─ Threshold Zones:
  │   ├─ Zone 1:
  │   │   ├─ Min: [Value]
  │   │   ├─ Max: [Value]
  │   │   ├─ Color: [Color picker]
  │   │   └─ Label: [Text]
  │   └─ [+ Add zone]
  ├─ Alerts:
  │   ├─ Above Max: [Color/Icon]
  │   └─ Below Min: [Color/Icon]
  └─ KPI Indicators:
      ├─ Show Delta: [Checkbox]
      └─ Delta Reference: [Previous/Target]
```

#### Panel 10: Interaction Options
```yaml
Interaction Options:
  ├─ Mouse Interactions:
  │   ├─ Hover Mode: [X/Y/Closest/None]
  │   ├─ Click Action: [None/Select/Drill/Custom]
  │   └─ Double Click: [Reset/Zoom/Custom]
  ├─ Navigation:
  │   ├─ Enable Zoom: [Checkbox]
  │   ├─ Enable Pan: [Checkbox]
  │   ├─ Scroll Zoom: [Checkbox]
  │   └─ Reset Button: [Show/Hide]
  ├─ Selection:
  │   ├─ Mode: [Box/Lasso/None]
  │   ├─ Persist: [Checkbox]
  │   └─ Multi-select: [Checkbox]
  └─ Export:
      ├─ Show Toolbar: [Checkbox]
      └─ Export Formats: [PNG/SVG/PDF]
```

---

## Enhanced Statistical Features

### 1. Scatter Plot Regression Analysis

```yaml
Regression Features for Scatter:
  Simple Linear Regression:
    - Equation: y = mx + b
    - Show equation on chart
    - R-squared value
    - P-value
    - Confidence intervals (95%, 99%)
  
  Polynomial Regression:
    - Order: 2-6
    - Show equation
    - R-squared
    - RMSE
  
  Non-linear Regression:
    - Exponential: y = ae^(bx)
    - Logarithmic: y = a*ln(x) + b
    - Power: y = ax^b
    - Lowess smoothing
  
  Multiple Regression:
    - 3D scatter with regression plane
    - Partial regression plots
    - Residual plots
  
  Advanced Statistics:
    - Correlation coefficient
    - Covariance
    - Outlier detection (Z-score, IQR)
    - Cook's distance
    - Leverage points
```

### 2. Histogram Density Features

```yaml
Density Curve Options:
  Kernel Density Estimation (KDE):
    - Bandwidth selection:
      - Scott's rule
      - Silverman's rule
      - Manual bandwidth
    - Kernel types:
      - Gaussian
      - Epanechnikov
      - Uniform
      - Triangular
  
  Distribution Fitting:
    - Normal distribution overlay
    - Show μ (mean) and σ (std dev)
    - Goodness of fit tests:
      - Shapiro-Wilk
      - Anderson-Darling
      - Kolmogorov-Smirnov
  
  Additional Overlays:
    - Probability density function
    - Cumulative distribution
    - Q-Q plot reference
    - P-P plot reference
```

### 3. Time Series Analysis Features

```yaml
Time Series Statistical Features:
  Trend Analysis:
    - Linear trend
    - Polynomial trend
    - Seasonal decomposition
    - Hodrick-Prescott filter
  
  Smoothing:
    - Simple moving average
    - Weighted moving average
    - Exponential smoothing
    - LOESS/LOWESS
  
  Forecasting:
    - Linear projection
    - ARIMA models
    - Seasonal patterns
    - Confidence bands
  
  Change Detection:
    - Change points
    - Anomaly detection
    - Breakout detection
    - Level shifts
```

---

## Conditional Formatting

### Conditional Formatting Rules Structure

```yaml
Conditional Formatting System:
  Rule Types:
    Value-based:
      - Greater than
      - Less than
      - Equal to
      - Between
      - Top N
      - Bottom N
      - Above average
      - Below average
    
    Percentile-based:
      - Top N%
      - Bottom N%
      - Quartiles
      - Percentile ranges
    
    Text-based:
      - Contains
      - Starts with
      - Ends with
      - Exact match
      - Regular expression
    
    Date-based:
      - Today
      - Yesterday
      - This week/month/year
      - Date range
      - Relative dates
  
  Formatting Options:
    Colors:
      - Background color
      - Text color
      - Border color
      - Gradient fills
    
    Icons:
      - Arrows (up/down/flat)
      - Shapes (circle/triangle/square)
      - Symbols (check/cross/warning)
      - Traffic lights
      - Rating stars
      - Custom SVG icons
    
    Data Bars:
      - Positive/negative
      - Gradient bars
      - Solid bars
      - Direction (LTR/RTL)
    
    Color Scales:
      - 2-color scale
      - 3-color scale
      - Diverging scales
      - Sequential scales
      - Custom scales
```

### Conditional Formatting Examples

```javascript
// Example conditional formatting configuration
const conditionalFormattingRules = [
  {
    id: 'rule1',
    name: 'High Values',
    type: 'value',
    condition: 'greater_than',
    value: 1000,
    format: {
      backgroundColor: '#4CAF50',
      textColor: '#FFFFFF',
      fontWeight: 'bold',
      icon: 'arrow-up',
      iconColor: '#2E7D32'
    }
  },
  {
    id: 'rule2',
    name: 'Negative Growth',
    type: 'value',
    condition: 'less_than',
    value: 0,
    format: {
      backgroundColor: '#FFEBEE',
      textColor: '#C62828',
      icon: 'arrow-down',
      iconColor: '#D32F2F'
    }
  },
  {
    id: 'rule3',
    name: 'Top Performers',
    type: 'percentile',
    condition: 'top_percent',
    value: 10,
    format: {
      backgroundColor: '#FFD700',
      icon: 'star',
      iconColor: '#FFA000'
    }
  }
];
```

---

## Time Series Events

### Event System for Time Series Charts

```yaml
Time Series Event Configuration:
  Event Types:
    Point Events:
      - Single date events
      - Milestone markers
      - Anomaly indicators
      - Alert points
    
    Range Events:
      - Period highlights
      - Maintenance windows
      - Campaign periods
      - Seasonal markers
    
    Recurring Events:
      - Weekly patterns
      - Monthly markers
      - Quarterly boundaries
      - Annual events
  
  Event Properties:
    Visual:
      - Icon library:
        - Material Icons
        - Font Awesome
        - Custom SVG
      - Icon size: Small/Medium/Large
      - Icon color: Custom colors
      - Icon position:
        - Above line
        - Below line
        - On line
        - Floating
    
    Interaction:
      - Tooltip content
      - Click action
      - Hover effects
      - Animation
    
    Labels:
      - Text label
      - Label position
      - Label rotation
      - Connect line to point
```

### Event Icon Library

```yaml
Built-in Event Icons:
  Business Events:
    - launch: 🚀 Product launch
    - campaign: 📢 Marketing campaign
    - meeting: 📅 Important meeting
    - milestone: 🎯 Milestone reached
    - contract: 📄 Contract signed
  
  Financial Events:
    - earnings: 💰 Earnings report
    - dividend: 💵 Dividend payment
    - merger: 🤝 Merger/Acquisition
    - ipo: 📈 IPO
    - split: ✂️ Stock split
  
  Operational Events:
    - maintenance: 🔧 Maintenance
    - outage: ⚠️ Service outage
    - upgrade: ⬆️ System upgrade
    - incident: 🚨 Incident
    - deployment: 🚢 Deployment
  
  Seasonal Events:
    - holiday: 🎄 Holiday
    - sale: 🏷️ Sale period
    - peak: ⛰️ Peak season
    - quarter: 📊 Quarter end
    - fiscal: 📋 Fiscal year end
  
  Custom Events:
    - custom1-10: Custom icons
    - svg: SVG upload
    - emoji: Emoji support
    - text: Text only
```

### Event Configuration Example

```javascript
// Example event configuration
const timeSeriesEvents = [
  {
    date: '2024-01-15',
    type: 'point',
    icon: 'launch',
    iconSize: 'medium',
    iconColor: '#4CAF50',
    position: 'above',
    label: 'Product Launch',
    tooltip: 'Version 2.0 Released',
    clickAction: 'showDetails'
  },
  {
    startDate: '2024-02-01',
    endDate: '2024-02-14',
    type: 'range',
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: '#FF0000',
    label: 'Valentine Campaign',
    position: 'bottom'
  },
  {
    date: '2024-03-31',
    type: 'recurring',
    recurrence: 'quarterly',
    icon: 'quarter',
    iconColor: '#2196F3',
    label: 'Q1 End'
  }
];
```

---

## Data Binding Interface

### Drag-and-Drop System

```yaml
Data Binding UI Components:
  Drop Zones:
    Required Fields:
      - Visual indicator: Red border
      - Helper text: "Required - Drag field here"
      - Validation: Real-time
    
    Optional Fields:
      - Visual indicator: Dashed border
      - Helper text: "Optional - Drag field"
      - Clear button: X icon
    
    Multi-value Fields:
      - Support multiple drops
      - Reorder capability
      - Remove individual items
  
  Input Options:
    Drag from Dataset:
      - Drag indicator on hover
      - Preview on drag
      - Compatibility check
      - Invalid drop indication
    
    Manual Input:
      - Text input field
      - Number input with validation
      - Date picker for dates
      - Formula editor
    
    Expression Builder:
      - Basic calculations
      - Field references
      - Functions library
      - Preview results
  
  Field Compatibility:
    Measure Fields:
      - Accept: Numeric types
      - Reject: Text, Boolean
      - Auto-aggregate if needed
    
    Attribute Fields:
      - Accept: Any type
      - Auto-convert dates
      - Category detection
    
    Mixed Fields:
      - Smart type detection
      - Conversion options
      - Warning messages
```

### Input Component Examples

```html
<!-- Drag and Drop Zone -->
<div class="drop-zone" data-field-type="measure" data-required="true">
  <div class="drop-area">
    <i class="icon-drag">⋮⋮</i>
    <span class="placeholder">Drag measure field or enter value</span>
    <button class="manual-input-toggle">📝</button>
  </div>
  <input type="text" class="manual-input hidden" placeholder="Enter value or formula">
  <button class="clear-field">✕</button>
</div>

<!-- Multi-value Drop Zone -->
<div class="multi-drop-zone" data-field-type="dimension">
  <div class="dropped-items">
    <div class="dropped-item">
      <i class="icon-drag">⋮⋮</i>
      <span>Category</span>
      <button class="remove">✕</button>
    </div>
    <div class="dropped-item">
      <i class="icon-drag">⋮⋮</i>
      <span>Region</span>
      <button class="remove">✕</button>
    </div>
  </div>
  <div class="add-more">
    <button>+ Add field</button>
  </div>
</div>
```

---

## Implementation Priority Matrix

### Feature Implementation Phases

| Phase | Features | Priority | Complexity |
|-------|----------|----------|------------|
| **Phase 1: Core** | Basic chart types (Line, Bar, Scatter, Pie) | High | Low |
| | Basic axes configuration | High | Low |
| | Simple data binding | High | Medium |
| | Basic visual properties | High | Low |
| **Phase 2: Enhanced** | Statistical features (Regression, Averages) | Medium | Medium |
| | Conditional formatting | Medium | Medium |
| | Grid and layout options | Medium | Low |
| | Legend and labels | High | Low |
| **Phase 3: Advanced** | Time series events | Low | High |
| | Advanced statistics (KDE, Forecasting) | Low | High |
| | Small multiples/Trellis | Low | Medium |
| | Complex interactions | Low | Medium |
| **Phase 4: Specialized** | 3D charts | Low | High |
| | Geographic charts | Low | High |
| | Financial charts | Low | Medium |
| | Custom expressions | Low | High |

---

## Code Generation Templates

### Property Panel Component Template

```typescript
// Template for generating property panels
interface PropertyPanel {
  id: string;
  title: string;
  icon: string;
  collapsed: boolean;
  enabled: boolean;
  properties: Property[];
}

interface Property {
  id: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'color' | 'drag-drop';
  required: boolean;
  enabledWhen?: Condition;
  options?: Option[];
  validation?: ValidationRule;
  defaultValue?: any;
  dataBinding?: {
    acceptTypes: DataType[];
    allowManualInput: boolean;
    allowExpressions: boolean;
  };
}

// Example panel configuration
const axesPanel: PropertyPanel = {
  id: 'axes',
  title: 'Axes Configuration',
  icon: '📊',
  collapsed: false,
  enabled: true,
  properties: [
    {
      id: 'xAxis',
      label: 'X-Axis Field',
      type: 'drag-drop',
      required: true,
      dataBinding: {
        acceptTypes: ['number', 'date', 'string'],
        allowManualInput: true,
        allowExpressions: true
      }
    },
    {
      id: 'xScale',
      label: 'X-Axis Scale',
      type: 'select',
      required: false,
      options: [
        { value: 'linear', label: 'Linear' },
        { value: 'log', label: 'Logarithmic' },
        { value: 'date', label: 'Date' },
        { value: 'category', label: 'Category' }
      ],
      defaultValue: 'linear'
    },
    {
      id: 'yStartFromZero',
      label: 'Start Y-Axis from Zero',
      type: 'checkbox',
      required: false,
      defaultValue: false,
      enabledWhen: {
        chartType: ['bar', 'column', 'area']
      }
    }
  ]
};
```

---

## Validation Rules

### Chart-Specific Validation

```javascript
// Validation configuration
const validationRules = {
  line: {
    minDataPoints: 2,
    requiredFields: ['x', 'y'],
    warnings: {
      tooManyPoints: 10000,
      message: 'Large dataset may impact performance'
    }
  },
  scatter: {
    minDataPoints: 1,
    requiredFields: ['x', 'y'],
    optionalFields: ['size', 'color'],
    regression: {
      minPointsForRegression: 3,
      maxPolynomialOrder: 6
    }
  },
  histogram: {
    minDataPoints: 1,
    requiredFields: ['values'],
    binning: {
      minBins: 1,
      maxBins: 100,
      defaultBins: 'auto'
    }
  },
  pie: {
    minSlices: 1,
    maxSlices: 50,
    requiredFields: ['values', 'labels'],
    warnings: {
      tooManySlices: 20,
      message: 'Consider using a different chart type for better readability'
    }
  }
};
```

---

## Summary

This enhanced documentation provides:

1. **Complete Property Matrix**: All properties marked as Mandatory (M), Optional (O), Conditional (C), or Not Applicable (NA) for each chart type

2. **UI Panel Structure**: 10 organized, collapsible panels grouping related properties

3. **Enhanced Statistical Features**: 
   - Advanced regression analysis for scatter plots
   - Density curves and distribution fitting for histograms
   - Time series analysis and forecasting

4. **Event System**: Comprehensive event handling for time series with icon library

5. **Conditional Formatting**: Rule-based formatting system with multiple condition types

6. **Data Binding Interface**: Drag-and-drop system with manual input options

7. **Implementation Guidelines**: Priority matrix and code templates

This structure enables:
- Efficient property management
- Intuitive user interface
- Flexible data binding
- Advanced analytical capabilities
- Rich visualization options

Use this documentation as the blueprint for building your Plotly-based chart engine with a professional, user-friendly interface.
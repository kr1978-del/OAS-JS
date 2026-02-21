# Plotly Chart Engine - Complete Documentation
## Chart Types, Properties, and Settings Reference Guide

> **Version**: 1.0  
> **Last Updated**: October 2025  
> **Purpose**: Comprehensive guide for implementing a Plotly-based chart engine with all configurable properties

---

## Table of Contents

1. [Overview](#overview)
2. [Universal Properties](#universal-properties)
3. [Chart Types Matrix](#chart-types-matrix)
4. [Detailed Chart Specifications](#detailed-chart-specifications)
5. [Property Compatibility Matrix](#property-compatibility-matrix)
6. [Implementation Guidelines](#implementation-guidelines)

---

## Overview

This documentation provides a complete reference for all Plotly chart types and their configurable properties. Each chart type includes:
- Data requirements (measures and attributes)
- Applicable visual properties
- Interactive features
- Statistical overlays
- Layout options

### Key Terminology
- **Measure**: Quantitative data (numbers, values)
- **Attribute**: Categorical data (labels, categories)
- **Dimension**: Data field used for grouping or categorization

---

## Universal Properties

These properties are available across all chart types unless specified otherwise:

### Layout Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| title | Main chart title | String | "" |
| subtitle | Secondary title | String | "" |
| width | Chart width | Number (px) | Auto |
| height | Chart height | Number (px) | Auto |
| margin | Chart margins | {t, r, b, l} | Auto |
| background_color | Chart background | Color | white |
| font_family | Global font | String | "Open Sans" |
| font_size | Base font size | Number | 12 |
| theme | Color theme | light/dark/custom | light |

### Legend Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| show_legend | Display legend | Boolean | true |
| legend_orientation | Layout direction | horizontal/vertical | vertical |
| legend_position | Location | top/right/bottom/left/float | right |
| legend_x | X position (float) | Number (0-1) | 1.02 |
| legend_y | Y position (float) | Number (0-1) | 1 |

### Interaction Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| hover_mode | Hover behavior | x/y/closest/false | closest |
| hover_template | Custom hover text | String template | Auto |
| click_mode | Click behavior | event/select/false | event |
| drag_mode | Drag interaction | zoom/pan/select/false | zoom |
| double_click | Double-click action | reset/autosize/false | reset |

### Export Properties
| Property | Description | Values | Default |
|----------|-------------|---------|---------|
| show_toolbar | Display toolbar | Boolean | true |
| toolbar_buttons | Available tools | Array | All |
| static_plot | Disable interactivity | Boolean | false |
| responsive | Responsive sizing | Boolean | true |

---

## Chart Types Matrix

### Basic Charts

#### 1. Line Chart
**Type ID**: `line`  
**Category**: Basic/Temporal

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1+ | Numeric columns |
| | attributes | 1 | X-axis column |
| **Axes** | x_scale | ✓ | linear/log/date/category |
| | y_scale | ✓ | linear/log |
| | x_min/x_max | ✓ | Number/Date |
| | y_min/y_max | ✓ | Number |
| | y_start_from_zero | ✓ | Boolean |
| | show_x_grid | ✓ | Boolean |
| | show_y_grid | ✓ | Boolean |
| **Line Styling** | line_type | ✓ | solid/dash/dot/dashdot |
| | line_width | ✓ | Number (1-10) |
| | line_smoothing | ✓ | linear/spline/hv/vh/hvh/vhv |
| | connectgaps | ✓ | Boolean |
| **Markers** | show_markers | ✓ | Boolean |
| | marker_size | ✓ | Number (2-20) |
| | marker_symbol | ✓ | circle/square/diamond/cross/x |
| **Fill** | fill_area | ✓ | none/tozeroy/tozerox/tonexty/tonextx |
| | fill_opacity | ✓ | Number (0-1) |
| **Statistical** | show_trend_line | ✓ | Boolean |
| | trend_type | ✓ | linear/lowess/moving_avg |
| | show_average_line | ✓ | Boolean |
| | show_median_line | ✓ | Boolean |
| | confidence_interval | ✓ | Boolean |
| **Stack** | stack_mode | ✓ | none/normal/percent |
| **Multi-Series** | view_mode | ✓ | overlay/separate |
| | small_multiples | ✓ | Boolean |
| | facet_row | Conditional | Column name |
| | facet_col | Conditional | Column name |

#### 2. Bar Chart
**Type ID**: `bar`  
**Category**: Basic/Categorical

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1+ | Numeric columns |
| | attributes | 1 | Category column |
| **Orientation** | orientation | ✓ | horizontal/vertical |
| **Axes** | x_scale | ✓ | category/linear/log |
| | y_scale | ✓ | linear/log |
| | y_start_from_zero | ✓ | Boolean (default: true) |
| | y_min/y_max | ✓ | Number |
| **Bar Styling** | bar_width | ✓ | Number (0-1) |
| | bar_gap | ✓ | Number (0-1) |
| | bar_color | ✓ | Color/Column |
| | bar_pattern | ✓ | none/lines/dots/custom |
| **Stack** | stack_mode | ✓ | none/stack/percent |
| | bar_mode | ✓ | group/overlay/relative |
| **Statistical** | show_average_line | ✓ | Boolean |
| | show_target_line | ✓ | Boolean |
| | target_value | Conditional | Number |
| | error_bars | ✓ | Boolean |
| | error_type | Conditional | percent/constant/data |
| **Labels** | show_values | ✓ | Boolean |
| | value_position | ✓ | inside/outside/auto |
| | value_format | ✓ | String format |
| **Sorting** | sort_order | ✓ | none/ascending/descending |
| | sort_by | ✓ | value/label |

#### 3. Scatter Plot
**Type ID**: `scatter`  
**Category**: Basic/Correlation

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 2+ | X and Y numeric |
| | size_measure | Optional | Numeric for bubble |
| | color_measure | Optional | Numeric/Category |
| **Axes** | x_scale | ✓ | linear/log/date |
| | y_scale | ✓ | linear/log/date |
| | x_min/x_max | ✓ | Number |
| | y_min/y_max | ✓ | Number |
| **Markers** | marker_size | ✓ | Fixed/Column |
| | size_range | Conditional | [min, max] |
| | marker_symbol | ✓ | Various shapes |
| | marker_opacity | ✓ | Number (0-1) |
| | marker_line_width | ✓ | Number |
| **Statistical** | show_regression | ✓ | Boolean |
| | regression_type | ✓ | linear/polynomial/lowess |
| | show_r_squared | ✓ | Boolean |
| | show_density | ✓ | Boolean |
| | density_type | Conditional | contour/heatmap |
| **Clustering** | show_clusters | ✓ | Boolean |
| | cluster_method | Conditional | kmeans/dbscan |
| | n_clusters | Conditional | Number |
| **Quadrants** | show_quadrants | ✓ | Boolean |
| | quadrant_x_value | Conditional | Number/mean/median |
| | quadrant_y_value | Conditional | Number/mean/median |

#### 4. Pie Chart
**Type ID**: `pie`  
**Category**: Basic/Part-to-whole

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1 | Numeric column |
| | attributes | 1 | Category column |
| **Visual** | hole_size | ✓ | Number (0-0.9) for donut |
| | rotation | ✓ | Number (degrees) |
| | direction | ✓ | clockwise/counterclockwise |
| | pull_slices | ✓ | Array/Auto |
| **Labels** | text_position | ✓ | inside/outside/none |
| | text_info | ✓ | label/value/percent/all |
| | insidetextorientation | ✓ | horizontal/radial/tangential |
| **Sorting** | sort | ✓ | Boolean |
| | sort_order | Conditional | ascending/descending |
| **Threshold** | other_threshold | ✓ | Number (percent) |
| | max_slices | ✓ | Number |

#### 5. Area Chart
**Type ID**: `area`  
**Category**: Basic/Temporal

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1+ | Numeric columns |
| | attributes | 1 | X-axis column |
| **Axes** | Same as Line Chart | ✓ | - |
| **Fill** | fill_opacity | ✓ | Number (0-1) |
| | fill_gradient | ✓ | Boolean |
| | gradient_type | Conditional | linear/radial |
| **Stack** | stack_mode | ✓ | none/normal/percent/stream |
| | normalize | ✓ | Boolean |
| **Line** | show_line | ✓ | Boolean |
| | line_width | ✓ | Number |

### Statistical Charts

#### 6. Histogram
**Type ID**: `histogram`  
**Category**: Statistical/Distribution

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1 | Numeric column |
| | group_by | Optional | Category column |
| **Binning** | n_bins | ✓ | Number/Auto |
| | bin_size | ✓ | Number/Auto |
| | bin_start | ✓ | Number |
| | bin_end | ✓ | Number |
| **Normalization** | hist_norm | ✓ | count/percent/probability/density |
| | cumulative | ✓ | Boolean |
| | cumulative_direction | Conditional | forward/backward |
| **Overlay** | show_kde | ✓ | Boolean |
| | kde_bandwidth | Conditional | Number/Auto |
| | show_rug | ✓ | Boolean |
| **Statistics** | show_mean | ✓ | Boolean |
| | show_median | ✓ | Boolean |
| | show_std | ✓ | Boolean |
| | show_quartiles | ✓ | Boolean |
| **Display** | bar_mode | ✓ | overlay/stack/group |
| | opacity | ✓ | Number (0-1) |
| | gap | ✓ | Number (0-1) |

#### 7. Box Plot
**Type ID**: `box`  
**Category**: Statistical/Distribution

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1 | Numeric column |
| | attributes | Optional | Category column |
| **Orientation** | orientation | ✓ | horizontal/vertical |
| **Box Style** | box_width | ✓ | Number (0-1) |
| | notched | ✓ | Boolean |
| | notch_width | Conditional | Number (0-1) |
| **Points** | show_points | ✓ | all/outliers/suspectedoutliers/none |
| | jitter | ✓ | Number (0-1) |
| | point_pos | ✓ | Number (-2 to 2) |
| **Statistics** | box_mean | ✓ | Boolean/sd |
| | whisker_width | ✓ | Number (0-1) |
| | q_method | ✓ | linear/exclusive/inclusive |
| **Comparison** | group_by | ✓ | Column name |
| | gap | ✓ | Number (0-1) |

#### 8. Violin Plot
**Type ID**: `violin`  
**Category**: Statistical/Distribution

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1 | Numeric column |
| | attributes | Optional | Category column |
| **Violin Style** | width | ✓ | Number |
| | side | ✓ | both/positive/negative |
| | bandwidth | ✓ | Number/Auto |
| **Inner Display** | inner_display | ✓ | box/quartiles/points/stick |
| | show_mean | ✓ | Boolean |
| | show_median | ✓ | Boolean |
| **Points** | points | ✓ | all/outliers/none |
| | jitter | ✓ | Number (0-1) |
| **Scale** | scale_mode | ✓ | width/count/area |

#### 9. Heatmap
**Type ID**: `heatmap`  
**Category**: Statistical/Matrix

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | x_attribute | ✓ | Column |
| | y_attribute | ✓ | Column |
| | z_measure | ✓ | Numeric column |
| **Color** | colorscale | ✓ | Various scales |
| | reverse_scale | ✓ | Boolean |
| | color_min/max | ✓ | Number/Auto |
| | show_scale | ✓ | Boolean |
| **Aggregation** | agg_function | ✓ | sum/mean/median/count/min/max |
| **Annotations** | show_values | ✓ | Boolean |
| | text_format | ✓ | Format string |
| | text_color | ✓ | auto/white/black/custom |
| **Gaps** | show_missing | ✓ | Boolean |
| | missing_color | ✓ | Color |
| **Dendogram** | show_dendrogram_row | ✓ | Boolean |
| | show_dendrogram_col | ✓ | Boolean |

### Advanced Charts

#### 10. Candlestick Chart
**Type ID**: `candlestick`  
**Category**: Financial

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | date | ✓ | Date column |
| | open | ✓ | Numeric |
| | high | ✓ | Numeric |
| | low | ✓ | Numeric |
| | close | ✓ | Numeric |
| **Visual** | increasing_color | ✓ | Color |
| | decreasing_color | ✓ | Color |
| | line_width | ✓ | Number |
| **Overlays** | show_volume | ✓ | Boolean |
| | ma_periods | ✓ | Array [5,20,50] |
| | show_bollinger | ✓ | Boolean |
| | bollinger_period | Conditional | Number |
| | bollinger_std | Conditional | Number |
| **Range** | range_selector | ✓ | Boolean |
| | range_buttons | ✓ | Array of periods |

#### 11. Waterfall Chart
**Type ID**: `waterfall`  
**Category**: Financial/Flow

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1 | Numeric column |
| | attributes | 1 | Category column |
| | measure_type | Optional | relative/total/absolute |
| **Visual** | increasing_color | ✓ | Color |
| | decreasing_color | ✓ | Color |
| | totals_color | ✓ | Color |
| **Connectors** | show_connectors | ✓ | Boolean |
| | connector_color | ✓ | Color |
| | connector_width | ✓ | Number |
| **Text** | text_position | ✓ | inside/outside/auto |
| | show_delta | ✓ | Boolean |

#### 12. Funnel Chart
**Type ID**: `funnel`  
**Category**: Process/Flow

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 1 | Numeric column |
| | attributes | 1 | Stage column |
| **Visual** | funnel_gap | ✓ | Number (0-1) |
| | text_position | ✓ | inside/outside/none |
| | text_info | ✓ | value/percent/both |
| **Connectors** | show_connectors | ✓ | Boolean |
| | connector_style | ✓ | line/fill |
| **Conversion** | show_conversion | ✓ | Boolean |
| | conversion_from | ✓ | previous/first |

#### 13. Gauge Chart
**Type ID**: `gauge`  
**Category**: KPI/Indicator

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | value | ✓ | Numeric |
| | target | Optional | Numeric |
| **Range** | min_value | ✓ | Number |
| | max_value | ✓ | Number |
| | threshold_values | ✓ | Array |
| | threshold_colors | ✓ | Array |
| **Visual** | gauge_type | ✓ | angular/bullet/number |
| | bar_thickness | ✓ | Number (0-1) |
| | show_needle | ✓ | Boolean |
| **Text** | show_value | ✓ | Boolean |
| | value_format | ✓ | Format string |
| | show_delta | ✓ | Boolean |

#### 14. Sunburst Chart
**Type ID**: `sunburst`  
**Category**: Hierarchical

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | values | ✓ | Numeric column |
| | parents | ✓ | Parent column |
| | labels | ✓ | Label column |
| **Visual** | color_by | ✓ | value/category/parent |
| | colorscale | ✓ | Various |
| | rotation | ✓ | Number |
| **Interaction** | max_depth | ✓ | Number |
| | clickable | ✓ | Boolean |
| | hover_template | ✓ | Template |
| **Text** | text_info | ✓ | label/value/percent/current path |

#### 15. Treemap
**Type ID**: `treemap`  
**Category**: Hierarchical

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | values | ✓ | Numeric column |
| | parents | ✓ | Parent column |
| | labels | ✓ | Label column |
| **Layout** | tiling_algorithm | ✓ | squarify/binary/slice/dice |
| | tiling_ratio | ✓ | Number |
| **Visual** | color_by | ✓ | value/category/parent |
| | colorscale | ✓ | Various |
| | show_path | ✓ | Boolean |
| **Text** | text_position | ✓ | top left/middle center |
| | text_info | ✓ | label/value/percent/all |

#### 16. Sankey Diagram
**Type ID**: `sankey`  
**Category**: Flow/Network

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | source | ✓ | Source nodes |
| | target | ✓ | Target nodes |
| | values | ✓ | Flow values |
| **Node** | node_pad | ✓ | Number |
| | node_thickness | ✓ | Number |
| | node_color | ✓ | Array/Auto |
| **Link** | link_color | ✓ | source/target/custom |
| | link_opacity | ✓ | Number (0-1) |
| **Layout** | arrangement | ✓ | snap/perpendicular/freeform |
| | iterations | ✓ | Number |

#### 17. Radar/Spider Chart
**Type ID**: `radar`  
**Category**: Multivariate

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | measures | 3+ | Numeric columns |
| | categories | ✓ | Dimension names |
| **Radial Axis** | r_min/r_max | ✓ | Number |
| | r_scale | ✓ | linear/log |
| | show_r_grid | ✓ | Boolean |
| | r_tick_count | ✓ | Number |
| **Angular** | theta_direction | ✓ | clockwise/counterclockwise |
| | theta_start | ✓ | Number (degrees) |
| **Visual** | fill | ✓ | none/toself |
| | fill_opacity | ✓ | Number (0-1) |
| | line_shape | ✓ | linear/spline |

#### 18. Parallel Coordinates
**Type ID**: `parallel_coordinates`  
**Category**: Multivariate

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | dimensions | 3+ | Numeric/Category columns |
| **Axes** | axis_order | ✓ | Array |
| | constraint_ranges | ✓ | Per dimension |
| | axis_scale | ✓ | Per dimension (linear/log) |
| **Lines** | line_color | ✓ | Column/Fixed |
| | line_opacity | ✓ | Number (0-1) |
| | line_width | ✓ | Number |
| **Interaction** | brushing | ✓ | Boolean |
| | reorderable | ✓ | Boolean |

### 3D Charts

#### 19. 3D Scatter
**Type ID**: `scatter3d`  
**Category**: 3D

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | x, y, z | ✓ | Numeric columns |
| | color | Optional | Column |
| | size | Optional | Column |
| **Camera** | camera_eye | ✓ | {x, y, z} |
| | camera_center | ✓ | {x, y, z} |
| | camera_up | ✓ | {x, y, z} |
| **Axes** | x/y/z_scale | ✓ | linear/log |
| | show_x/y/z_grid | ✓ | Boolean |
| | show_x/y/z_spikes | ✓ | Boolean |
| **Visual** | marker_size | ✓ | Fixed/Column |
| | marker_opacity | ✓ | Number (0-1) |
| | projection | ✓ | Boolean |

#### 20. 3D Surface
**Type ID**: `surface`  
**Category**: 3D

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | z_matrix | ✓ | 2D array |
| | x_coords | Optional | Array |
| | y_coords | Optional | Array |
| **Surface** | colorscale | ✓ | Various |
| | show_contours | ✓ | x/y/z/Boolean |
| | contour_width | ✓ | Number |
| **Lighting** | lighting_ambient | ✓ | Number (0-1) |
| | lighting_diffuse | ✓ | Number (0-1) |
| | lighting_specular | ✓ | Number (0-1) |
| | lighting_roughness | ✓ | Number (0-1) |

#### 21. 3D Mesh
**Type ID**: `mesh3d`  
**Category**: 3D

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | x, y, z | ✓ | Coordinates |
| | i, j, k | Optional | Triangle indices |
| | intensity | Optional | Values |
| **Visual** | color | ✓ | Fixed/Array |
| | opacity | ✓ | Number (0-1) |
| | flatshading | ✓ | Boolean |
| | contour | ✓ | Boolean |

### Geographic Charts

#### 22. Choropleth Map
**Type ID**: `choropleth`  
**Category**: Geographic

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | locations | ✓ | Location codes |
| | z_values | ✓ | Numeric values |
| **Map Settings** | scope | ✓ | world/usa/europe/asia/etc |
| | projection_type | ✓ | 20+ projection types |
| | center | ✓ | {lat, lon} |
| | zoom | ✓ | Number |
| **Visual** | colorscale | ✓ | Various |
| | show_land | ✓ | Boolean |
| | show_ocean | ✓ | Boolean |
| | show_countries | ✓ | Boolean |
| | show_lakes | ✓ | Boolean |
| **Borders** | border_color | ✓ | Color |
| | border_width | ✓ | Number |

#### 23. Scatter Map
**Type ID**: `scattergeo`  
**Category**: Geographic

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | lat | ✓ | Latitude |
| | lon | ✓ | Longitude |
| | size | Optional | Numeric |
| | color | Optional | Column |
| **Map Settings** | scope | ✓ | world/usa/europe/asia/etc |
| | projection_type | ✓ | 20+ projection types |
| **Markers** | marker_size | ✓ | Fixed/Column |
| | size_range | ✓ | [min, max] |
| | marker_color | ✓ | Fixed/Column |
| **Lines** | mode | ✓ | markers/lines/markers+lines |
| | line_width | ✓ | Number |

#### 24. Density Map
**Type ID**: `densitymapbox`  
**Category**: Geographic

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | lat | ✓ | Latitude |
| | lon | ✓ | Longitude |
| | z | Optional | Weights |
| **Map** | mapbox_style | ✓ | Various styles |
| | center | ✓ | {lat, lon} |
| | zoom | ✓ | Number |
| **Density** | radius | ✓ | Number |
| | colorscale | ✓ | Various |
| | opacity | ✓ | Number (0-1) |

### Specialized Charts

#### 25. Indicator/KPI
**Type ID**: `indicator`  
**Category**: KPI

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | value | ✓ | Current value |
| | reference | Optional | Reference value |
| **Display Mode** | mode | ✓ | number/delta/gauge/number+delta+gauge |
| **Number** | number_format | ✓ | Format string |
| | number_font_size | ✓ | Number |
| **Delta** | delta_reference | ✓ | Number |
| | delta_relative | ✓ | Boolean |
| | delta_increasing_color | ✓ | Color |
| | delta_decreasing_color | ✓ | Color |
| **Gauge** | gauge_axis_range | ✓ | [min, max] |
| | gauge_bar_color | ✓ | Color |
| | gauge_threshold | ✓ | Object |

#### 26. Icicle Chart
**Type ID**: `icicle`  
**Category**: Hierarchical

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | values | ✓ | Numeric |
| | parents | ✓ | Parent refs |
| | labels | ✓ | Text labels |
| **Layout** | orientation | ✓ | h/v |
| | pathbar_visible | ✓ | Boolean |
| **Visual** | root_color | ✓ | Color |
| | tiling | ✓ | Object |

#### 27. OHLC Chart
**Type ID**: `ohlc`  
**Category**: Financial

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | date | ✓ | Date column |
| | open | ✓ | Numeric |
| | high | ✓ | Numeric |
| | low | ✓ | Numeric |
| | close | ✓ | Numeric |
| **Visual** | increasing_line_color | ✓ | Color |
| | decreasing_line_color | ✓ | Color |
| | line_width | ✓ | Number |
| | tick_width | ✓ | Number |

#### 28. Carpet Plot
**Type ID**: `carpet`  
**Category**: Specialized

| Property Category | Properties | Applicable | Values |
|-------------------|------------|------------|--------|
| **Data Requirements** | a | ✓ | A-axis values |
| | b | ✓ | B-axis values |
| | x | Optional | X coordinates |
| | y | Optional | Y coordinates |
| **Axes** | aaxis | ✓ | Axis config |
| | baxis | ✓ | Axis config |
| **Visual** | carpet_color | ✓ | Color |
| | font | ✓ | Font config |

---

## Property Compatibility Matrix

### Quick Reference Table

| Property | Line | Bar | Scatter | Pie | Area | Histogram | Box | Heatmap | 3D | Map |
|----------|------|-----|---------|-----|------|-----------|-----|---------|----|----|
| **Data** |
| Multiple measures | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ |
| Multiple attributes | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Axes** |
| X/Y scale options | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Log scale | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| Start from zero | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| Grid lines | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| **Visual** |
| Orientation | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Stack mode | ✓ | ✓ | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ | ✗ |
| Markers | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✓ | ✓ |
| **Statistical** |
| Trend line | ✓ | ✗ | ✓ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |
| Average line | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Density | ✗ | ✗ | ✓ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✓ |
| **Interaction** |
| Zoom | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pan | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Layout** |
| Small multiples | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Legend | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Implementation Guidelines

### 1. Chart Selection Logic

```javascript
// Example chart selection logic
const chartSelectionRules = {
  // Time series data
  temporal: ['line', 'area', 'candlestick', 'ohlc'],
  
  // Categorical comparisons
  categorical: ['bar', 'column', 'lollipop'],
  
  // Part-to-whole
  composition: ['pie', 'donut', 'treemap', 'sunburst'],
  
  // Distribution
  distribution: ['histogram', 'box', 'violin', 'density'],
  
  // Correlation
  correlation: ['scatter', 'bubble', 'heatmap'],
  
  // Hierarchical
  hierarchical: ['treemap', 'sunburst', 'icicle', 'sankey'],
  
  // Geographic
  geographic: ['choropleth', 'scattergeo', 'densitymapbox'],
  
  // KPI/Metrics
  metrics: ['indicator', 'gauge', 'bullet']
};
```

### 2. Property Validation Rules

```javascript
// Example property validation
const propertyValidation = {
  line: {
    required: ['x', 'y'],
    optional: ['line_type', 'markers', 'fill', 'stack_mode'],
    conditional: {
      'trend_line': ['trend_type'],
      'stack_mode': ['normalize'],
      'markers': ['marker_size', 'marker_symbol']
    }
  },
  bar: {
    required: ['x', 'y'],
    optional: ['orientation', 'stack_mode', 'bar_mode'],
    conditional: {
      'stack_mode': ['bar_mode'],
      'error_bars': ['error_type', 'error_value']
    }
  }
  // ... more chart types
};
```

### 3. Data Requirements Validation

```javascript
// Example data validation
const dataRequirements = {
  line: {
    minMeasures: 1,
    maxMeasures: Infinity,
    minAttributes: 1,
    maxAttributes: 2,
    dataTypes: {
      x: ['numeric', 'date', 'category'],
      y: ['numeric']
    }
  },
  pie: {
    minMeasures: 1,
    maxMeasures: 1,
    minAttributes: 1,
    maxAttributes: 1,
    dataTypes: {
      values: ['numeric'],
      labels: ['category', 'string']
    }
  }
  // ... more chart types
};
```

### 4. Default Property Values

```javascript
// Example defaults
const chartDefaults = {
  global: {
    title: '',
    showLegend: true,
    legendOrientation: 'vertical',
    hoverMode: 'closest',
    responsive: true
  },
  line: {
    lineType: 'solid',
    lineWidth: 2,
    showMarkers: false,
    connectGaps: true,
    stackMode: 'none'
  },
  bar: {
    orientation: 'vertical',
    barMode: 'group',
    stackMode: 'none',
    showValues: false,
    yStartFromZero: true
  }
  // ... more chart types
};
```

### 5. Dynamic Property UI Generation

```javascript
// Example UI generation logic
const generatePropertyUI = (chartType) => {
  const properties = chartProperties[chartType];
  const ui = {
    sections: [],
    controls: []
  };
  
  // Group properties by category
  Object.keys(properties).forEach(category => {
    const section = {
      name: category,
      controls: []
    };
    
    properties[category].forEach(prop => {
      section.controls.push({
        type: prop.controlType,
        name: prop.name,
        label: prop.label,
        values: prop.values,
        default: prop.default,
        conditional: prop.conditional
      });
    });
    
    ui.sections.push(section);
  });
  
  return ui;
};
```

---

## Appendix A: Aggregation Functions

Available aggregation functions for charts that support data aggregation:

| Function | Description | Applicable Charts |
|----------|-------------|------------------|
| sum | Sum of values | Bar, Heatmap, Treemap |
| mean/avg | Average of values | All aggregatable |
| median | Middle value | All aggregatable |
| mode | Most frequent value | Categorical |
| count | Number of records | All aggregatable |
| distinct | Unique count | All aggregatable |
| min | Minimum value | All aggregatable |
| max | Maximum value | All aggregatable |
| first | First value | Time series |
| last | Last value | Time series |
| stddev | Standard deviation | Statistical |
| variance | Variance | Statistical |
| q1 | First quartile | Box, Statistical |
| q3 | Third quartile | Box, Statistical |

---

## Appendix B: Color Scales

Available color scales for charts:

### Sequential (Single Hue)
- Blues, Greens, Greys, Oranges, Purples, Reds

### Sequential (Multi-Hue)  
- Viridis, Plasma, Inferno, Magma, Cividis, Turbo

### Diverging
- RdBu, RdYlBu, RdYlGn, Spectral, PiYG, PRGn

### Categorical
- Plotly, D3, G10, T10, Dark24, Light24

### Custom
- User-defined color arrays

---

## Appendix C: Format Strings

Common format strings for value display:

| Format | Description | Example |
|--------|-------------|---------|
| `.0f` | Integer | 1234 |
| `.2f` | 2 decimals | 1234.56 |
| `.2%` | Percentage | 12.34% |
| `,.0f` | Thousands separator | 1,234 |
| `.2s` | SI prefix | 1.2k |
| `$,.2f` | Currency | $1,234.56 |
| `.3e` | Scientific | 1.234e+3 |

---

## Version History

- **v1.0** (October 2025): Initial comprehensive documentation
- Covers all major Plotly chart types
- Includes property compatibility matrix
- Provides implementation guidelines

---

## References

- [Plotly.js Documentation](https://plotly.com/javascript/)
- [Plotly Chart Types Gallery](https://plotly.com/javascript/basic-charts/)
- [Plotly API Reference](https://plotly.com/javascript/reference/)

---

*This documentation is designed to serve as a comprehensive reference for building a Plotly-based chart engine. It should be used in conjunction with the official Plotly documentation for the most up-to-date implementation details.*
# OAS-JS Portal: Complete Project Blueprint
**Version:** 2.0
**Date:** 2025-10-01
**Status:** Agreed plan for Phase 1 (Hyper-MVP).

## 1. Project Vision & Phased Rollout

This project aims to create a modern, responsive, and performant web portal for an existing Oracle Analytics Server (OAS) implementation. The project is divided into distinct phases to deliver value quickly and mitigate risk.

### Phase 1: The "Hyper-MVP" (Target: 2 Weeks)

**Goal:** Launch a functional, modern portal that dramatically improves the viewing experience for all existing classic reports and dashboards.

**Core Features:**
- **Modern Application Shell:** A React-based single-page application featuring a clean UI (`ArchitectUI` style) with a collapsible left navigation panel and a minimal top banner.
- **Seamless Classic Embedding:** All classic OAS dashboards will be embedded, with the legacy Oracle header and chrome hidden.
- **URL-Driven Design:** The application will use client-side routing, ensuring every view has a unique URL to support multi-tab workflows, browser history, and direct linking.
- **Automated CSS Re-Styling:** A single, master CSS file will be injected into embedded content to modernize the look of classic prompts, tables, and other elements. This includes responsive rules to stack prompts vertically on mobile devices.
- **Modern Tab Handling:** A custom UI component will replace the classic dashboard page tabs, appearing as a clean tab bar on desktop and a dropdown menu on mobile.
- **"Escape Hatch" for Downloads:** The modern UI will initially feature a disabled "Download" button. Next to it, an "Open in Classic" link will open the original dashboard in a new tab, providing users with a clear path to all advanced functions (like downloads) not yet implemented in the portal.

### Phase 2: Native Creation & Advanced Features (Post-MVP)

**Goal:** Enhance the portal with self-service capabilities and integrate the remaining advanced features.
- **Context-Aware Intelligent Download Menu:** A native download menu in the portal UI that accurately reflects the permissions configured in OAS.
- **New Charting Engine:** A self-service interface for users to create new, modern dashboards from scratch.
- **Modern Filter Panel:** A custom-built, slide-out filter panel for new dashboards.

---

## 2. Technical Architecture & Specifications

### 2.1. The "Navigation Engine" Analysis

The application's entire navigation structure will be driven by a single OAS analysis.

- **Analysis Name:** `App_Navigation_Source`
- **Schema:**
| Column Name | Type | Purpose | Example |
| :--- | :--- | :--- | :--- |
| `LINK_ID` | `VARCHAR` | A unique identifier for this link. | `sales_dash` |
| `PARENT_ID` | `VARCHAR` | The `LINK_ID` of the parent item. `NULL` for top-level items. | `dashboards` |
| `LINK_NAME` | `VARCHAR` | The text displayed for the link. | "Sales Dashboard" |
| `LINK_TYPE` | `VARCHAR` | `DASHBOARD`, `KEY_SITE`, `ADMIN_LINK`. | `DASHBOARD` |
| `TARGET_URL`| `VARCHAR` | Path to the dashboard. `NULL` for parent menu items. | `/shared/.../Sales` |
| `ICON` | `VARCHAR` | Name of the icon to display (e.g., from a library like FontAwesome).| `pe-7s-graph` |
| `REQUIRED_ROLE`| `VARCHAR` | Application role needed to see the link. `NULL` for public. | `App_Admins` |

### 2.2. Saving New Dashboard Configurations

(Phase 2) New dashboards created in the portal will have their configurations (layout, charts, data sources) saved as a JSON object to a file in the OAS Web Catalog (e.g., `/shared/New Dashboards/MyReport.portal.json`).

### 2.3. The "Variable Provider Analysis"

(Phase 2) To provide default values (from Presentation/Repository variables) to the new charting engine, a single analysis (`App_Variable_Provider`) will be created. The application will call this on load to fetch initial values for the filter panel.

---

## 3. Development & Testing Workflow

This project will follow a local-only development model to respect the security of the environment.

1.  **Development (Developer):** The developer will write code locally and package the entire application into a `.zip` file when a version is ready for testing.
2.  **Handoff:** The `.zip` file will be uploaded to a GitHub Issue for the OAS Admin to download.
3.  **Testing (OAS Admin):** The admin will download and unzip the package on a local machine within the secure environment.
4_  **Local Environment Setup (One-Time):**
    - Install Node.js (LTS version) from [https://nodejs.org/](https://nodejs.org/).
5.  **Running the Test Server:**
    - Open a command prompt in the unzipped application folder.
    - Run `npm install` (only required the first time for a new version).
    - Run `npm start`.
    - Access the application at `http://localhost:3000` to test against the live OAS instance.

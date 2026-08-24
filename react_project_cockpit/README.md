# ERPNext React + Tailwind CSS Project Tracking Dashboard

An enterprise-grade, high-performance **React + Tailwind CSS Project Tracking Dashboard** designed specifically for ERPNext / Frappe. The dashboard provides real-time hierarchical project rollups, multi-category task progress tracking, assigned user avatars, project creation dates, recent activity feeds, and deep project detail inspection.

---

## ⚡ Instant 1-Click Launch (Zero Dependencies)
Simply open the standalone single-page application directly in your web browser:
```
c:\Users\tanuj\Downloads\AI Agent\react_project_cockpit\index.html
```
Double-click `index.html` or drag it into **Google Chrome, Microsoft Edge, Mozilla Firefox, or Safari** to immediately use the full interactive dashboard!

---

## 🌟 Core Requirements & Features Implemented

### 1. Total Tasks Created Against Each Project
- Project cards and tables show total tasks created alongside a live breakdown: **Completed**, **Working / In Progress**, **Open**, and **Overdue**.
- Displays progress count in format: `6 / 7 Tasks Completed`.

### 2. Project Creation Date
- Explicitly displayed on all project cards, tables, and project detail drawers (`Created: YYYY-MM-DD`).

### 3. Project Priority Badges
- Color-coded enterprise priority badges:
  - 🔥 **Urgent** (Rose badge)
  - ▲ **High** (Amber badge)
  - ● **Medium** (Blue badge)
  - ▽ **Low** (Slate badge)

### 4. Project Status Badges
- Real-time status indicators:
  - 🟢 **Completed** (with active pulse)
  - 🔵 **Working / In Progress**
  - 🟣 **Pending Review**
  - 🌐 **Open**

### 5. Assigned Users
- Visual avatar stack on every project card and table row with user initials, gradient colors, role labels, and contact email tooltips.
- Task assignees with individual user badges and full team roster drawer.

### 6. Task-Wise Progress by Category
Dedicated category progress tracking for all 5 required domains:
- 💻 **Development**
- 🎨 **UI / Frontend**
- 🔄 **Migration**
- 🧪 **Testing & QA**
- 📄 **Documentation**
- Top category filter strip allows 1-click filtering by category.
- Mini progress meters and comparative **Category Matrix View** for all projects.

### 7. Overall Completion Percentage
- Dynamic mathematical rollup computed from linked tasks.
- Changing any task's status (e.g. from `Working` to `Completed`) instantly updates the overall project completion percentage and automatically transitions the parent project status.

### 8. Recent Task Activities
- Live operational activity stream tracking all recent task completions, status switches, progress adjustments, and new task additions with relative timestamps (e.g., `12 minutes ago`, `Just now`) and user attribution.

### 9. Ability to Open Project Details
- **Dedicated Project Details Drawer / Slide-Over Modal** featuring:
  - **Overview & ERP Metrics**: Project ID, Status, Priority, Creation Date, Target Schedule, Manager, Budget vs Actual Cost, Server IP.
  - **All Tasks Tab**: Full task inventory with inline status switcher and "+ Add Task" button.
  - **Category Progress Tab**: 5-category breakdown bars and completion statistics.
  - **Team Members Tab**: Detailed team roster with roles and emails.
  - **Direct ERPNext Desk Link**: 1-click button to open `/app/project/{id}` in your ERPNext Desk instance.

---

## 📊 Multiple Specialized Views
- 📊 **Executive Projects Grid**: Expandable cards with progress bars, categories, and inline task status changers.
- 📑 **Enterprise Table View**: Compact, sortable data table for high-density ERP workflows.
- 📌 **Category Matrix View**: Side-by-side comparative progress across Development, UI, Migration, Testing, and Documentation.
- 🗂️ **Agile Kanban Board**: Drag/select workflow columns (`Open`, `Working`, `Pending Review`, `Completed`).
- 🕒 **Recent Activities Feed**: Chronological log of team updates and status modifications.

---

## 🌐 ERPNext REST API Integration
The dashboard can connect directly to your live ERPNext instance or run in offline/mock mode:
1. Click the **ERPNext Settings (⚙️)** button in the top navigation bar.
2. Enter your ERPNext Host URL (e.g., `http://192.168.101.125` or `https://erp.yourcompany.com`).
3. Enter your **API Key** & **API Secret**.
4. Click **⚡ Test Connection** or **Save & Sync Now**.
5. Check "Enable Live Remote Sync" to persist all task updates to the live ERPNext DocTypes (`/api/resource/Project` and `/api/resource/Task`).

---

## 📂 Modular Project Structure
```
react_project_cockpit/
├── index.html                                  # 🚀 Clean HTML Entry Point with ES Module Map
├── package.json                                # React & Tailwind dependencies
├── vite.config.js                              # Vite bundler configuration
├── tailwind.config.js                          # Tailwind CSS design tokens
├── postcss.config.js                           # PostCSS configuration
├── serve.ps1                                   # Ultra-lightweight PowerShell Web Server
├── README.md
└── src/
    ├── main.jsx                                # React 18 root bootstrapping
    ├── App.jsx                                 # Main Dashboard Controller & State Orchestrator
    ├── index.css                               # Tailwind base & smooth animations
    ├── data/
    │   └── initialData.js                      # Preloaded dataset with 5 categories & activities
    ├── services/
    │   └── erpnextApi.js                       # ERPNext REST API client (Project & Task DocTypes)
    └── components/
        ├── common/
        │   ├── Header.jsx                      # App bar, search, sync indicator, dark mode, action buttons
        │   └── Toast.jsx                       # Slide-in toast notification banner
        ├── dashboard/
        │   ├── KPICards.jsx                    # Top KPI metric cards
        │   ├── CategoryFilterBar.jsx           # 5-Category quick filter bar with real-time counts
        │   └── FilterToolbar.jsx               # Search bar, Status/Priority/Assignee filters, view switchers
        ├── projects/
        │   ├── ProjectCard.jsx                 # Expandable project card with creation date & priority
        │   ├── TaskRow.jsx                     # Interactive task row with category badge & quick status changer
        │   ├── ProjectsGrid.jsx                # Responsive grid container for ProjectCards
        │   └── ProjectTableView.jsx            # High-density enterprise tabular view
        ├── categories/
        │   └── CategoryMatrixView.jsx          # Cross-project 5-category matrix comparison view
        ├── kanban/
        │   └── KanbanBoard.jsx                 # Agile task workflow columns
        ├── activity/
        │   └── ActivityFeed.jsx                # Chronological live operational activity log
        └── modals/
            ├── ProjectDetailsDrawer.jsx        # Slide-over inspector (Overview, All Tasks, Categories, Team)
            ├── NewTaskModal.jsx                # Create Task modal dialog with category picker
            ├── NewProjectModal.jsx             # Create Project modal dialog
            └── ApiConfigModal.jsx              # ERPNext REST API URL & Token configuration modal
```

# ERPNext Project Cockpit UI Page

A modern, responsive, and real-time visualization cockpit for ERPNext Projects and Tasks.

---

## 🌟 Key Features
- **Live KPI Overview**: Total Projects, Active Projects, Overall Completion %, Overdue Tasks.
- **Hierarchical Project Cards**: Expandable project cards showing total tasks, overdue warnings, and live progress bars.
- **Integrated Task Breakdown**: Full task table inside each project (Subject, Dates, Status, Progress).
- **Inline Quick Status Updater**: Change a task's status (e.g. from `Open` to `Completed`) directly from the table without navigating away.
- **Automatic Status Roll-up**: Automatically checks and marks the parent Project as `Completed` or `Working` when tasks are updated.
- **Interactive Kanban View**: Instant toggle to a cross-project agile Kanban board.

---

## 📂 File Structure
```
project_cockpit/
├── project_cockpit.json  # Frappe Page definition metadata
├── project_cockpit.py    # Backend Python controller with whitelisted methods
├── project_cockpit.js    # Frontend UI rendering, state, and quick-action handler
├── project_cockpit.css   # Styling (Dark & Light theme compatible)
└── README.md
```

---

## 🚀 How to Install in Your ERPNext / Frappe Instance

### Option 1: Via a Custom Frappe App (Recommended)
1. Copy the `project_cockpit` folder into your custom app's `page` directory:
   ```bash
   frappe-bench/apps/<your_custom_app>/<your_custom_app>/page/project_cockpit/
   ```
2. Run `bench migrate`:
   ```bash
   bench --site [your-site-name] migrate
   ```
3. Open your browser and navigate to:
   ```
   http://[your-site-url]/app/project-cockpit
   ```

---

### Option 2: Direct Setup via ERPNext Desk UI (Without Bench access)
1. Open ERPNext Desk and search for **Page List**.
2. Click **+ Add Page**.
3. Set **Page Name**: `project-cockpit` and **Title**: `Project Cockpit`.
4. Set **Standard**: `No`.
5. Open the created page in ERPNext Desk and paste:
   - Paste the contents of `project_cockpit.js` into the **Page JS** field.
   - Paste the contents of `project_cockpit.css` into the **Page CSS** field.
6. Create a **Server Script** (API Type) for the backend methods or copy the Python script into your custom app hooks.

---

## 🔗 Adding it to your Workspace Menu
1. Go to **Projects** Workspace.
2. Click **Edit / Customize**.
3. Add a **Shortcut** or **Card Link**:
   - **Type**: `Page`
   - **Link To**: `project-cockpit`
   - **Label**: `Project Cockpit / Visualizer`
4. Click **Save**.

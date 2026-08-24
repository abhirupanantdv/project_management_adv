# ERPNext v15 Custom React Desk Page: Project Tracker

A custom React 18 Desk Page built for **ERPNext v15** named **Project Tracker** (`/app/project-tracker`). It provides a single-screen project tracking experience by querying and updating existing standard **`Project`** and **`Task`** DocTypes through the Frappe API without creating any new database tables.

---

## 🌟 Key Features

1. **Unified Project Dashboard Table**: Single high-density table displaying all projects with:
   - Project Name & ID
   - Customer
   - Project Status
   - Priority (High/Medium/Low/Urgent)
   - Project Type
   - Created Date
   - Expected End Date
   - Assigned Users (Avatar stack)
   - Total Tasks
   - Overall Progress (%)
   - View Details Action
2. **Category-wise Progress (5 Work Domains)**: Real-time progress bars for:
   - 💻 **Development %**
   - 🎨 **UI %**
   - 🔄 **Migration %**
   - 🧪 **Testing %**
   - 📄 **Documentation %**
   - *Overall project progress is calculated automatically from linked completed tasks.*
3. **Streamlined Task Creation (Mandatory Fields Only)**: Form enforces strictly the required fields and saves directly into standard ERPNext `Task` DocType:
   - Subject (`subject`)
   - Project (`project`)
   - Category (`custom_category` / `type`)
   - Assignee (`_assign`)
   - Priority (`priority`)
   - Status (`status`)
   - Due Date (`exp_end_date`)
4. **Detailed Project Inspector View**: Modal drawer showing project info, metrics, team roster, category progress bars, and full task list with inline quick-action status updater.
5. **Jira-Style Kanban & Analytics**: Switch between Table, Grid, Kanban Board, and Visual Analytics.
6. **Native Frappe v15 Integration**: Built-in routing (`frappe.set_route`), session CSRF auth, permission checking, and toast alerts (`frappe.show_alert`).

---

## 📂 File Structure

```
project_tracker/
├── project_tracker.json  # Frappe Page DocType metadata (page_name: "project-tracker", title: "Project Tracker")
├── project_tracker.py    # Whitelisted Frappe API backend methods
├── project_tracker.js    # React 18 Desk Page frontend controller
├── project_tracker.css   # Desk styling & dark/light theme variables
└── README.md
```

---

## 🚀 How to Install in ERPNext v15

### Option 1: Via Custom Frappe App (Recommended)

1. Copy the `project_tracker` directory into your custom app's `page` directory:
   ```bash
   cp -r project_tracker frappe-bench/apps/<your_custom_app>/<your_custom_app>/page/
   ```
2. Run bench migration:
   ```bash
   bench --site [your-site-name] migrate
   ```
3. Open your browser and navigate to:
   ```
   http://[your-site-url]/app/project-tracker
   ```

---

### Option 2: Direct Setup via ERPNext Desk UI (Without Bench Access)

1. Log into ERPNext Desk as **System Manager**.
2. Search for **Page List** in the awesome bar (or navigate to `http://[your-site-url]/app/page`).
3. Click **+ Add Page**:
   - **Page Name**: `project-tracker`
   - **Title**: `Project Tracker`
   - **Module**: `Projects`
   - **Standard**: `No`
4. In the Page record:
   - Paste the contents of `project_tracker.js` into the **Page JS** field.
   - Paste the contents of `project_tracker.css` into the **Page CSS** field.
5. Save the page.
6. (Optional) If you have Server Script enabled, create a **Server Script (API Type)** with method `project_tracker.project_tracker.get_project_dashboard_data` from `project_tracker.py`, or the client will automatically fall back to standard `frappe.db.get_list`.

---

## 🔗 Adding it to the Projects Workspace Menu

1. Go to the **Projects** Workspace (`/app/projects`).
2. Click **Edit** (or **Customize**).
3. Add a **Shortcut** or **Card Link**:
   - **Type**: `Page`
   - **Link To**: `project-tracker`
   - **Label**: `Project Tracker`
   - **Icon**: `octicon octicon-checklist` or `project`
4. Click **Save**.

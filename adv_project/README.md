# adv_project - Advanced Project Management Cockpit for ERPNext

A complete, production-ready **Frappe / ERPNext Custom App** providing an enterprise Project Management & Tracking Cockpit accessible at `/adv-project`.

---

## ?? Highlights

- **Native Route**: Served directly by Frappe at `https://your-erpnext-domain/adv-project`.
- **Automatic Dynamic Login**: Unauthenticated visitors are automatically routed to `/adv-login?redirect_to=/adv-project`.
- **Shared ERPNext Session**: Uses native Frappe session cookies (`sid`). If a user is already logged into ERPNext Desk, `/adv-project` opens immediately without re-authenticating.
- **Role & Permission Safe**: Standard Frappe user permissions apply. Employees see their permitted projects and tasks.
- **Fast Consolidated API**: Includes `@frappe.whitelist()` backend endpoints in `adv_project.api` to batch load projects and tasks in optimized queries.
- **Modern UI & Views**:
  - ?? Executive Cards Grid
  - ?? High-Density Enterprise Table
  - ?? 5-Category Matrix (Dev, UI, Migration, QA, Docs)
  - ?? Agile Kanban Board (Open, Working, Review, Done)
  - ?? Full ERPNext Project Details Modal with Child Tables (Customer, Users, IP, App, Notes, Tasks)
  - ?? Adaptive Dark / Light mode with dynamic Anantdv branding.

---

## ?? Installation on Frappe Bench

Run these commands inside your bench directory (e.g. `/home/frappe/frappe-bench`):

### Step 1: Add App to Bench

#### Method A: If cloning from your GitHub repository:
```bash
bench get-app https://github.com/tanujaanantdv/project_management_adv.git --branch main
```

#### Method B: If copying the `adv_project` folder manually:
```bash
cp -r /path/to/adv_project apps/adv_project
bench setup requirements
bench build --app adv_project
```

---

### Step 2: Install to Your Site

Replace `<site-name>` with your active site (e.g., `erp.yourdomain.com` or `site1.local`):

```bash
bench --site <site-name> install-app adv_project
bench --site <site-name> migrate
bench --site <site-name> clear-cache
bench restart
```

---

## ?? Routes & Session Flow

| Route | Behavior |
| :--- | :--- |
| **`/adv-project`** | **Main Project Cockpit**. If the user is logged in, loads the dashboard with their live projects. If Guest, automatically redirects to `/adv-login?redirect_to=/adv-project`. |
| **`/adv-login`** | **Dynamic Branded Login Page**. Authenticates via `/api/method/login`, establishes the Frappe session, and redirects to `/adv-project`. If already logged in, automatically jumps to `/adv-project`. |
| **`/app`** | Standard ERPNext Desk (linked directly in the Cockpit header). |

---

## ? Backend Whitelisted API Endpoints

The app exposes optimized endpoints in `adv_project.api`:

- **`adv_project.api.get_project_cockpit_data`**: Single-query loader returning projects, tasks, overdue analytics, and user session.
- **`adv_project.api.update_task_status`**: Update task status and auto-sync project completion.
- **`adv_project.api.create_project`**: Create a new Project document.
- **`adv_project.api.create_task`**: Create a new Task and assign team members.

---

## ?? App Structure

```
adv_project/
|-- setup.py
|-- pyproject.toml
|-- requirements.txt
|-- README.md
`-- adv_project/
    |-- __init__.py
    |-- hooks.py                       # App metadata & route rules
    |-- api.py                         # Whitelisted Frappe API endpoints
    |-- modules.txt
    |-- public/
    |   `-- images/
    |       |-- anantdv_logo.png       # Light theme logo
    |       `-- anantdv_logo_dark.png  # Dark theme logo
    `-- www/
        |-- adv-login.py               # Login gatekeeper context
        |-- adv-login.html             # Dynamic authentication page
        |-- adv-project.py             # Session checker & context loader
        `-- adv-project.html           # Full Project Cockpit web page
```

---

## ?? License
MIT License. Developed for Anantdv & ERPNext deployments.

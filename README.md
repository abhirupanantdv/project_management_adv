# Advanced Project Management (project_management_adv)

Enterprise Project Management & Tracking Cockpit for **Frappe & ERPNext**.

[![Frappe](https://img.shields.io/badge/Frappe-v14%20%7C%20v15-blue.svg?logo=frappe&logoColor=white)](https://frappeframework.com/)
[![ERPNext](https://img.shields.io/badge/ERPNext-v14%20%7C%20v15-0089FF.svg?logo=frappe&logoColor=white)](https://erpnext.com/)
[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](license.txt)

---

## 🚀 Installation on Frappe / ERPNext Bench

This repository is structured as a standard Frappe application. You can directly install it into your Frappe Bench using the standard commands:

### 1. Get the App
```bash
bench get-app https://github.com/abhirupanantdv/project_management_adv.git
```

### 2. Install to Your Site
```bash
bench --site <your-site-name> install-app project_management_adv
```
*(Note: If you have an existing site with `adv_project`, `bench --site <your-site-name> install-app adv_project` is also fully supported!)*

### 3. Run Migrations & Build Assets
```bash
bench --site <your-site-name> migrate
bench build --app project_management_adv
bench --site <your-site-name> clear-cache
```

---

## 🌟 What's Included

### 1. ERPNext Desk Pages (Inside Desk `/app`)
- **Project Cockpit**: `/app/project-cockpit`
  - High-level KPI summaries (Total Projects, Active Projects, Overall Progress, Overdue Tasks).
  - Multi-workstream progress meters (Development, UI, Migration, Testing, Documentation).
  - 📋 **Project Details Modal**: View comprehensive project details, workstream metrics, and assigned team members, with 1-click navigation to the full ERPNext Project DocType form.
  - Quick task status updater directly inline.
  - Interactive Task Kanban board.
- **Project Tracker**: `/app/project-tracker`
  - Drag-and-drop / quick-action task tracker with priority & status filters.

### 2. Standalone Web Portal Views (Website Routes)
- **Web Cockpit Portal**: `/adv-project`
  - High-performance, full-featured React 18 cockpit.
  - Responsive dark/light theme, custom filters, and full ERPNext data synchronization.
  - High-visibility Logout button in navbar and modal headers.
- **Dedicated Login Portal**: `/adv-login`
  - Clean branded login portal with automatic session redirect.
  - Enforces secure ERPNext credential verification.

### 3. Whitelisted Python APIs (`project_management_adv.api`)
- `get_project_cockpit_data()`: Fast consolidated query loader.
- `get_project_dashboard_data()`: Real-time project & task KPI breakdown.
- `update_task_status()` / `update_task_status_quick()`: Updates task and recalculates parent project progress.
- `create_project()` & `create_task()`: Document creation with permission verification.
- `get_logged_user_info()`: Session inspection endpoint.

---

## 💻 Local Development & Standalone Usage

If you want to run or test the React frontend independently outside Frappe:

### 1. Zero-Dependency HTML Launch
Open `react_project_cockpit/index.html` directly in any web browser.

### 2. Vite Dev Server with Live Proxy
```bash
cd react_project_cockpit
npm install
npm run dev
```
The application will launch at `http://localhost:3000/`.

### 3. Production Build
```bash
cd react_project_cockpit
npm run build
```

---

## 📁 Repository Structure

```
project_management_adv/
├── setup.py                       # Frappe/Pip installer
├── pyproject.toml                 # Package metadata
├── requirements.txt               # App requirements
├── license.txt                    # MIT License
├── README.md                      # Documentation
├── project_management_adv/        # Main Frappe App Package
│   ├── __init__.py                # App version
│   ├── hooks.py                   # App hooks, routes, includes
│   ├── modules.txt                # "Project Management Adv"
│   ├── patches.txt                # Migration patches
│   ├── api.py                     # Whitelisted ERPNext backend APIs
│   ├── public/                    # Symlinked static assets (CSS, JS, logos)
│   ├── project_management_adv/    # Frappe Module
│   │   └── page/
│   │       ├── project_cockpit/   # Desk Page: /app/project-cockpit
│   │       └── project_tracker/   # Desk Page: /app/project-tracker
│   └── www/                       # Website routes
│       ├── adv-project.html       # Web Portal: /adv-project
│       └── adv-login.html         # Web Login: /adv-login
├── adv_project/                   # Compatible Frappe alias package
├── project_cockpit/               # Standalone desk page assets
├── project_tracker/               # Standalone tracker assets
└── react_project_cockpit/         # React 18 source codebase
```

---

## 🔒 Security & Authentication

- All API endpoints strictly enforce Frappe authentication checks (`frappe.session.user != 'Guest'`).
- Modals and forms include CSRF protection via `X-Frappe-CSRF-Token`.
- Safe state rollbacks on network disruptions or permission rejections.

---

## 📄 License

MIT License. Copyright (c) 2026 Anantdv.

# project_management_adv

Enterprise Project Management & Tracking Cockpit with Live ERPNext / Frappe Integration.

[![React](https://img.shields.io/badge/React-18.x-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![ERPNext](https://img.shields.io/badge/ERPNext-Frappe%20v14%2Fv15-0089FF?logo=frappe&logoColor=white)](https://frappe.io/)

---

## Overview

**project_management_adv** is an enterprise-grade project management and tracking cockpit built to supercharge ERPNext / Frappe workflows. It bridges real-time project metrics, agile execution, task-level time & category tracking, and rich visual dashboards into a responsive, modern interface.

---

## Key Features

### 1. Executive Project Cockpit & Dashboards
- **Multi-View Modes**: Switch effortlessly between:
  - **Cards Grid**: Visual project cards with category bars, priority badges, and quick actions.
  - **Enterprise Table**: High-density tabular layout with sorting, inline status dropdowns, and progress meters.
  - **Category Matrix**: Cross-project comparison across 5 functional domains (*Development*, *UI / Frontend*, *Migration*, *Testing & QA*, *Documentation*).
  - **Agile Kanban Board**: Drag-and-drop / click-to-move workflow columns (Open, Working, Pending Review, Completed).
  - **Operational Activity Stream**: Real-time chronological audit trail of task status transitions and team updates.

### 2. Comprehensive ERPNext Project Form & Inspection
- **Project Details Form Modal**: Complete mirror of the ERPNext project document structure with collapsible child sections:
  - **Customer Details**: Client contact, customer name, territory.
  - **Users & Stakeholders**: Assigned team leads, developers, and project owners.
  - **IP & Infrastructure**: Server host IP, port assignments, and credentials.
  - **Application Settings**: Associated ERPNext modules, repositories, and build environments.
  - **Notes & Costing**: Budget allocated, actual billable hours, and milestone remarks.
  - **Task Breakdown**: Live status badges sorted by Open, Working, and Done.

### 3. Customizable Brand Logo & Theme System
- Integrated **Anantdv Logo Customizer** with dynamic presets:
  - uto: Automatically adapts between light and dark modes (nantdv_logo.png / nantdv_logo_dark.png).
  - dynamic_vector: Animated SVG vector emblem with ambient neon glow and rotating particle rings.
  - custom: Direct image URL upload with adjustable glow colors (cyan, indigo, purple, emerald, amber, rainbow).

### 4. Live ERPNext REST API Synchronization
- Built-in live sync client for /api/resource/Project and /api/resource/Task.
- In-app **API Configuration Modal** for configuring:
  - ERPNext Server URL (e.g., http://192.168.101.175).
  - API Key & API Secret authentication tokens.
  - Automatic background polling intervals (default: 30s) or offline mock fallback mode.
- Vite dev proxy configured for seamless cross-origin communication without CORS hurdles.

### 5. SMTP Mail Server Notification System
- Configurable in-app SMTP mail settings dialog for automated task updates, project milestone reminders, and critical notifications.

---

## Repository Structure

`
project_management_adv/
|-- README.md                              # Main enterprise documentation
|-- react_project_cockpit/                 # Modern React 18 + Vite + Tailwind CSS Cockpit
|   |-- index.html                         # Standalone zero-dependency HTML build (1-click launch)
|   |-- vite.config.js                     # Vite dev server & ERPNext API proxy
|   |-- package.json                       # Dependencies & build scripts
|   |-- serve.ps1                          # Lightweight PowerShell static server
|   -- src/
|       |-- App.jsx                        # Main state orchestrator
|       |-- components/
|       |   |-- common/AnantdvLogo.jsx     # Dynamic branding component
|       |   |-- modals/LogoCustomizerModal.jsx # Logo settings modal
|       |   |-- modals/SmtpConfigModal.jsx # Email notification settings
|       |   |-- projects/ProjectDetailsPage.jsx # Full project inspection
|       |   -- ...
|       |-- config/erpConfig.js            # Default ERPNext server credentials
|       -- services/erpnextApi.js         # ERPNext REST API client
|-- project_cockpit/                       # Standalone Vanilla JS / Python Cockpit
|   |-- project_cockpit.html               # Vanilla web dashboard
|   |-- project_cockpit.py                 # Python integration backend
|   -- config.js                          # Local client config
-- project_tracker/                       # Lightweight Python Flask task tracker
    |-- project_tracker.py                 # Flask server
    -- project_tracker.html               # Task tracking frontend
`

---

## Frappe Custom App (dv_project)

A production-ready Frappe custom app installable directly onto any **Frappe Bench**:
- **Route**: Accessible at \/adv-project- **Dynamic Login**: Accessible at \/adv-login\ (auto-redirects unauthenticated users)
- **Shared Session**: Seamlessly shares active sessions with ERPNext Desk (\/app\)

### Install to Frappe Bench
\\ash
# 1. From bench directory:
bench get-app https://github.com/tanujaanantdv/project_management_adv.git --branch main

# 2. Install app to site:
bench --site <your-site> install-app adv_project
bench --site <your-site> migrate
bench --site <your-site> clear-cache
\

---

## Quick Start & Running

### Option 1: Instant 1-Click Launch (Zero Dependencies)
Open the pre-bundled standalone dashboard directly in any web browser:
`
react_project_cockpit/index.html
`
Double-click index.html or drag it into Chrome, Edge, Firefox, or Safari.

### Option 2: Lightweight PowerShell Server
From 
eact_project_cockpit/:
`powershell
.\serve.ps1
`
Spins up a local server on http://localhost:8080/.

### Option 3: Full React Dev Server (Vite)
`ash
cd react_project_cockpit
npm install
npm run dev
`
The application will be accessible at http://localhost:3000/ with live hot-module replacement and ERPNext proxying.

### Option 4: Production Build
`ash
cd react_project_cockpit
npm run build
`
Generates an optimized bundle in dist/.

---

## ERPNext API Configuration

To connect the cockpit to your live ERPNext instance:
1. Open the cockpit in your browser.
2. Click the **ERPNext Settings** icon in the header.
3. Provide your server details:
   - **Server URL**: http://192.168.101.175 (or your domain)
   - **API Key & Secret**: Generated from your ERPNext User profile.
4. Click **Test Connection** & **Save & Sync Now**.

---

## Contributing & License
Maintained for internal and enterprise deployments.
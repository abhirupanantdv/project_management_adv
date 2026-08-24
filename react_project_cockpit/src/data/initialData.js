// Enterprise Project & Task Categories
export const CATEGORIES = {
  DEVELOPMENT: "Development",
  UI: "UI",
  MIGRATION: "Migration",
  TESTING: "Testing",
  DOCUMENTATION: "Documentation"
};

export const CATEGORY_CONFIG = {
  "Development": {
    label: "Development",
    icon: "💻",
    bgClass: "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
    barColor: "bg-indigo-600 dark:bg-indigo-500"
  },
  "UI": {
    label: "UI",
    icon: "🎨",
    bgClass: "bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    barColor: "bg-purple-600 dark:bg-purple-500"
  },
  "Migration": {
    label: "Migration",
    icon: "🔄",
    bgClass: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    barColor: "bg-amber-500 dark:bg-amber-400"
  },
  "Testing": {
    label: "Testing",
    icon: "🧪",
    bgClass: "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    barColor: "bg-emerald-600 dark:bg-emerald-500"
  },
  "Documentation": {
    label: "Documentation",
    icon: "📄",
    bgClass: "bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800",
    barColor: "bg-sky-500 dark:bg-sky-400"
  }
};

// Helper: Flatten hierarchical task tree
export function flattenTasks(tasks = []) {
  const flat = [];
  function recurse(list, parentName = null) {
    list.forEach(t => {
      flat.push({ ...t, parentName });
      if (t.children && t.children.length > 0) {
        recurse(t.children, t.name || t.subject);
      }
    });
  }
  recurse(tasks);
  return flat;
}

// 40 Realistic Enterprise Projects
export const initialProjects = [
  {
    id: "PROJ-0001",
    name: "ADV-Nirolite ERP Core Modernization",
    company: "Anantdv",
    status: "In Progress",
    priority: "High",
    owner: "Niranjan Singh",
    startDate: "2026-07-01",
    dueDate: "2026-09-15",
    creation: "2026-07-01",
    assignedTeamCount: 5,
    budget: 85000,
    actualCost: 52000,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "Project Manager", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" },
      { name: "Dipanwita", avatar: "DP", role: "Backend Lead", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Tanuja", avatar: "TD", role: "UI/UX Designer", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "QA Engineer", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" },
      { name: "Alex Chen", avatar: "AC", role: "DevOps Engineer", color: "from-amber-500 to-yellow-600", email: "alex.c@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-001",
        name: "Database Architecture & Multi-Tenant Partitioning",
        category: "Development",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-07-20",
        children: [
          {
            id: "TASK-001-1",
            name: "PostgreSQL Schema Isolation Scripting",
            category: "Development",
            assignee: { name: "Dipanwita", avatar: "DP" },
            status: "Completed",
            priority: "High",
            progress: 100,
            dueDate: "2026-07-15",
            children: [
              {
                id: "TASK-001-1-A",
                name: "Tenant Connection Pool Manager",
                category: "Development",
                assignee: { name: "Dipanwita", avatar: "DP" },
                status: "Completed",
                priority: "Medium",
                progress: 100,
                dueDate: "2026-07-12"
              }
            ]
          },
          {
            id: "TASK-001-2",
            name: "Automated Data Migration Rollback Engine",
            category: "Migration",
            assignee: { name: "Niranjan Singh", avatar: "NS" },
            status: "Completed",
            priority: "High",
            progress: 100,
            dueDate: "2026-07-20"
          }
        ]
      },
      {
        id: "TASK-002",
        name: "REST API Gateway & Token Authentication Service",
        category: "Development",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "In Progress",
        priority: "High",
        progress: 70,
        dueDate: "2026-08-25",
        children: [
          {
            id: "TASK-002-1",
            name: "OAuth2 & JWT Refresh Token Mechanism",
            category: "Development",
            assignee: { name: "Dipanwita", avatar: "DP" },
            status: "Completed",
            priority: "High",
            progress: 100,
            dueDate: "2026-08-10"
          },
          {
            id: "TASK-002-2",
            name: "Rate Limiting & Redis In-Memory Cache",
            category: "Development",
            assignee: { name: "Alex Chen", avatar: "AC" },
            status: "In Progress",
            priority: "Medium",
            progress: 40,
            dueDate: "2026-08-25"
          }
        ]
      },
      {
        id: "TASK-003",
        name: "Enterprise Executive Dashboard UI & Analytics",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "In Progress",
        priority: "Medium",
        progress: 65,
        dueDate: "2026-09-05",
        children: [
          {
            id: "TASK-003-1",
            name: "Responsive KPI Cards & Chart Visualizations",
            category: "UI",
            assignee: { name: "Tanuja", avatar: "TD" },
            status: "Completed",
            priority: "Medium",
            progress: 100,
            dueDate: "2026-08-20"
          },
          {
            id: "TASK-003-2",
            name: "Dark/Light Mode Theme Switcher & Accessibility",
            category: "UI",
            assignee: { name: "Tanuja", avatar: "TD" },
            status: "In Progress",
            priority: "Low",
            progress: 30,
            dueDate: "2026-09-05"
          }
        ]
      },
      {
        id: "TASK-004",
        name: "End-to-End Stress Testing & Benchmark QA",
        category: "Testing",
        assignee: { name: "Sushmita", avatar: "SB" },
        status: "Not Started",
        priority: "High",
        progress: 0,
        dueDate: "2026-09-15"
      }
    ]
  },
  {
    id: "PROJ-0002",
    name: "ADV-VMS Visitor Management & QR Check-in",
    company: "Anantdv",
    status: "In Progress",
    priority: "Urgent",
    owner: "Sushmita",
    startDate: "2026-07-10",
    dueDate: "2026-08-30",
    creation: "2026-07-10",
    assignedTeamCount: 4,
    budget: 45000,
    actualCost: 29000,
    assignedUsers: [
      { name: "Sushmita", avatar: "SB", role: "Tech Lead", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" },
      { name: "Dipanwita", avatar: "DP", role: "Developer", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Niranjan Singh", avatar: "NS", role: "Architect", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-010",
        name: "Touchscreen Kiosk Guest Registration Flow",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-08-01",
        children: [
          {
            id: "TASK-010-1",
            name: "QR Badge Print Driver Integration",
            category: "Development",
            assignee: { name: "Dipanwita", avatar: "DP" },
            status: "Completed",
            priority: "High",
            progress: 100,
            dueDate: "2026-07-25"
          }
        ]
      },
      {
        id: "TASK-011",
        name: "SMS & WhatsApp Host Notification Webhooks",
        category: "Development",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "In Progress",
        priority: "Urgent",
        progress: 60,
        dueDate: "2026-08-20"
      },
      {
        id: "TASK-012",
        name: "Building Security LDAP / Active Directory Sync",
        category: "Migration",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "Completed",
        priority: "Medium",
        progress: 100,
        dueDate: "2026-08-15"
      },
      {
        id: "TASK-013",
        name: "Security Audit & Compliance Certification",
        category: "Testing",
        assignee: { name: "Sushmita", avatar: "SB" },
        status: "Not Started",
        priority: "High",
        progress: 0,
        dueDate: "2026-08-30"
      }
    ]
  },
  {
    id: "PROJ-0003",
    name: "AI Document OCR & Invoice Parser Suite",
    company: "Anantdv",
    status: "Completed",
    priority: "High",
    owner: "Tanuja",
    startDate: "2026-05-01",
    dueDate: "2026-08-10",
    creation: "2026-05-01",
    assignedTeamCount: 3,
    budget: 95000,
    actualCost: 88000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "AI Research Lead", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Dipanwita", avatar: "DP", role: "ML Engineer", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Alex Chen", avatar: "AC", role: "DevOps Engineer", color: "from-amber-500 to-yellow-600", email: "alex.c@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-020",
        name: "Custom Vision Layout Transformer Training",
        category: "Development",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-06-30",
        children: [
          {
            id: "TASK-020-1",
            name: "Tax Table & Line-Item Bounding Box Model",
            category: "Development",
            assignee: { name: "Dipanwita", avatar: "DP" },
            status: "Completed",
            priority: "High",
            progress: 100,
            dueDate: "2026-06-15"
          }
        ]
      },
      {
        id: "TASK-021",
        name: "FastAPI GPU Inference Microservice",
        category: "Development",
        assignee: { name: "Alex Chen", avatar: "AC" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-07-20"
      },
      {
        id: "TASK-022",
        name: "Interactive Document Review & Correction UI",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "Completed",
        priority: "Medium",
        progress: 100,
        dueDate: "2026-08-05"
      }
    ]
  },
  {
    id: "PROJ-0004",
    name: "ADV-IMEL Smart Factory Telemetry Hub",
    company: "Anantdv",
    status: "In Progress",
    priority: "Medium",
    owner: "Niranjan Singh",
    startDate: "2026-07-15",
    dueDate: "2026-09-30",
    creation: "2026-07-15",
    assignedTeamCount: 4,
    budget: 62000,
    actualCost: 28000,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "IoT Engineer", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "Firmware Lead", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Alex Chen", avatar: "AC", role: "Cloud Architect", color: "from-amber-500 to-yellow-600", email: "alex.c@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-030",
        name: "MQTT Broker & Sensor Packet Parser",
        category: "Development",
        assignee: { name: "Sushmita", avatar: "SB" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-08-10"
      },
      {
        id: "TASK-031",
        name: "Shopfloor Operator Tablet UI",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "In Progress",
        priority: "Medium",
        progress: 50,
        dueDate: "2026-09-10"
      },
      {
        id: "TASK-032",
        name: "Historical Downtime Analytics Pipeline",
        category: "Migration",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "Not Started",
        priority: "Medium",
        progress: 0,
        dueDate: "2026-09-30"
      }
    ]
  },
  {
    id: "PROJ-0005",
    name: "Carpenter Water Fiji ERP Cloud Instance",
    company: "Carpenter Water",
    status: "In Progress",
    priority: "High",
    owner: "Dipanwita",
    startDate: "2026-07-01",
    dueDate: "2026-09-20",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 70000,
    actualCost: 41000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Lead Consultant", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Niranjan Singh", avatar: "NS", role: "Integration Eng", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "QA Lead", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-040",
        name: "Fiji Customs & Tax Law Invoicing Module",
        category: "Development",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-08-05"
      },
      {
        id: "TASK-041",
        name: "General Ledger Historical Data Import",
        category: "Migration",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "In Progress",
        priority: "High",
        progress: 60,
        dueDate: "2026-08-25"
      },
      {
        id: "TASK-042",
        name: "Client User Acceptance Testing Signoff",
        category: "Testing",
        assignee: { name: "Sushmita", avatar: "SB" },
        status: "Not Started",
        priority: "High",
        progress: 0,
        dueDate: "2026-09-20"
      }
    ]
  },
  {
    id: "PROJ-0006",
    name: "Supplier Portal & Solomon Point of Purchase",
    company: "Solomon Retail",
    status: "Completed",
    priority: "Low",
    owner: "Tanuja",
    startDate: "2026-04-01",
    dueDate: "2026-06-30",
    creation: "2026-04-01",
    assignedTeamCount: 2,
    budget: 32000,
    actualCost: 31000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "Lead Dev", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Niranjan Singh", avatar: "NS", role: "Backend Eng", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-050",
        name: "Barcode Scanner & Inventory Receipt Logic",
        category: "Development",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "Completed",
        priority: "Low",
        progress: 100,
        dueDate: "2026-05-15"
      },
      {
        id: "TASK-051",
        name: "Vendor Quotation Submission Portal",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "Completed",
        priority: "Low",
        progress: 100,
        dueDate: "2026-06-20"
      }
    ]
  },
  {
    id: "PROJ-0007",
    name: "Global Multi-Region Cloud Infrastructure Migration",
    company: "Apex Cloud",
    status: "In Progress",
    priority: "Urgent",
    owner: "Alex Chen",
    startDate: "2026-06-15",
    dueDate: "2026-09-10",
    creation: "2026-06-15",
    assignedTeamCount: 4,
    budget: 120000,
    actualCost: 78000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "Lead Architect", color: "from-amber-500 to-yellow-600", email: "alex.c@anantdv.com" },
      { name: "Niranjan Singh", avatar: "NS", role: "DevOps", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" },
      { name: "Dipanwita", avatar: "DP", role: "Cloud Eng", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "Security Eng", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-060",
        name: "Terraform Infrastructure as Code Modules",
        category: "Development",
        assignee: { name: "Alex Chen", avatar: "AC" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-07-15"
      },
      {
        id: "TASK-061",
        name: "Kubernetes Cluster Auto-Scaling & Mesh Setup",
        category: "Development",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "In Progress",
        priority: "Urgent",
        progress: 75,
        dueDate: "2026-08-30"
      },
      {
        id: "TASK-062",
        name: "Database Zero-Downtime Replication",
        category: "Migration",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "In Progress",
        priority: "High",
        progress: 50,
        dueDate: "2026-09-10"
      }
    ]
  },
  {
    id: "PROJ-0008",
    name: "Omnichannel Mobile POS & Loyalty App",
    company: "RetailWave",
    status: "In Progress",
    priority: "High",
    owner: "Tanuja",
    startDate: "2026-07-01",
    dueDate: "2026-10-15",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 54000,
    actualCost: 22000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "Mobile Lead", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Dipanwita", avatar: "DP", role: "API Eng", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "Mobile QA", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-070",
        name: "React Native Cross-Platform UI Components",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-08-01"
      },
      {
        id: "TASK-071",
        name: "Stripe & Apple Pay Mobile SDK Integration",
        category: "Development",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "In Progress",
        priority: "High",
        progress: 45,
        dueDate: "2026-09-15"
      },
      {
        id: "TASK-072",
        name: "Offline Caching & Sync Queue Testing",
        category: "Testing",
        assignee: { name: "Sushmita", avatar: "SB" },
        status: "Not Started",
        priority: "Medium",
        progress: 0,
        dueDate: "2026-10-15"
      }
    ]
  },
  {
    id: "PROJ-0009",
    name: "Automated Payroll & Tax Compliance Engine",
    company: "FinServ Corp",
    status: "Completed",
    priority: "Medium",
    owner: "Dipanwita",
    startDate: "2026-03-01",
    dueDate: "2026-06-15",
    creation: "2026-03-01",
    assignedTeamCount: 3,
    budget: 48000,
    actualCost: 46000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Tax Consultant", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Niranjan Singh", avatar: "NS", role: "Backend Eng", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "QA Lead", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-080",
        name: "Year-End W2 & Tax Form Automated Generator",
        category: "Development",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-05-01"
      },
      {
        id: "TASK-081",
        name: "Direct Deposit ACH File Integration",
        category: "Development",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "Completed",
        priority: "Medium",
        progress: 100,
        dueDate: "2026-06-01"
      }
    ]
  },
  {
    id: "PROJ-0010",
    name: "Enterprise Customer 360 & CRM Integration",
    company: "OmniHealth",
    status: "Not Started",
    priority: "High",
    owner: "Sushmita",
    startDate: "2026-09-01",
    dueDate: "2026-11-30",
    creation: "2026-08-15",
    assignedTeamCount: 4,
    budget: 68000,
    actualCost: 0,
    assignedUsers: [
      { name: "Sushmita", avatar: "SB", role: "Solution Architect", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Dipanwita", avatar: "DP", role: "Integrations Lead", color: "from-emerald-500 to-teal-600", email: "dipanwita@anantdv.com" },
      { name: "Alex Chen", avatar: "AC", role: "Data Eng", color: "from-amber-500 to-yellow-600", email: "alex.c@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-090",
        name: "Salesforce & HubSpot Bidirectional Webhook Sync",
        category: "Development",
        assignee: { name: "Dipanwita", avatar: "DP" },
        status: "Not Started",
        priority: "High",
        progress: 0,
        dueDate: "2026-10-15"
      },
      {
        id: "TASK-091",
        name: "Customer Interaction Timeline & Call Log UI",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "Not Started",
        priority: "Medium",
        progress: 0,
        dueDate: "2026-11-15"
      }
    ]
  },
  // Projects 11 to 40
  {
    id: "PROJ-0011",
    name: "Automated Warehouse AGV Robotics Dispatch",
    company: "LogiTech Automation",
    status: "In Progress",
    priority: "High",
    owner: "Alex Chen",
    startDate: "2026-07-15",
    dueDate: "2026-10-01",
    creation: "2026-07-15",
    assignedTeamCount: 3,
    budget: 92000,
    actualCost: 45000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "Robotics Lead", color: "from-amber-500 to-yellow-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Backend Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "Hardware QA", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-101", name: "AGV Fleet Pathfinding Algorithm Service", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-08-15" },
      { id: "TASK-102", name: "Real-Time 3D Floor Heatmap Visualizer", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 60, dueDate: "2026-09-15" }
    ]
  },
  {
    id: "PROJ-0012",
    name: "Healthcare HIPAA Compliance & Audit Vault",
    company: "MedTrust Health",
    status: "Completed",
    priority: "Urgent",
    owner: "Sushmita",
    startDate: "2026-04-15",
    dueDate: "2026-07-30",
    creation: "2026-04-15",
    assignedTeamCount: 3,
    budget: 78000,
    actualCost: 75000,
    assignedUsers: [
      { name: "Sushmita", avatar: "SB", role: "Security Auditor", color: "from-rose-500 to-orange-500" },
      { name: "Dipanwita", avatar: "DP", role: "Encryption Lead", color: "from-emerald-500 to-teal-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Storage Eng", color: "from-blue-500 to-indigo-600" }
    ],
    tasks: [
      { id: "TASK-111", name: "AES-256 Field Level Patient Data Encryption", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "Urgent", progress: 100, dueDate: "2026-06-15" },
      { id: "TASK-112", name: "Immutable Access Audit Log on Write-Once Storage", category: "Migration", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-20" }
    ]
  },
  {
    id: "PROJ-0013",
    name: "Global B2B E-Commerce Marketplace",
    company: "TradeHub International",
    status: "In Progress",
    priority: "High",
    owner: "Tanuja",
    startDate: "2026-06-01",
    dueDate: "2026-09-30",
    creation: "2026-06-01",
    assignedTeamCount: 5,
    budget: 110000,
    actualCost: 64000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "Product Lead", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "Payment Gateway Lead", color: "from-emerald-500 to-teal-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Catalog Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Alex Chen", avatar: "AC", role: "DevOps", color: "from-amber-500 to-yellow-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Lead", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-121", name: "Multi-Currency Escrow & Settlement Engine", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-30" },
      { id: "TASK-122", name: "Bulk CSV/Excel Product Catalog Ingestion", category: "Migration", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "In Progress", priority: "Medium", progress: 70, dueDate: "2026-08-31" },
      { id: "TASK-123", name: "Vendor Analytics & Storefront Builder UI", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 40, dueDate: "2026-09-30" }
    ]
  },
  {
    id: "PROJ-0014",
    name: "Predictive Machine Maintenance AI Model",
    company: "HeavyMach Corp",
    status: "In Progress",
    priority: "Medium",
    owner: "Alex Chen",
    startDate: "2026-07-20",
    dueDate: "2026-10-15",
    creation: "2026-07-20",
    assignedTeamCount: 3,
    budget: 58000,
    actualCost: 21000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "ML Engineer", color: "from-amber-500 to-yellow-600" },
      { name: "Sushmita", avatar: "SB", role: "Data Scientist", color: "from-rose-500 to-orange-500" },
      { name: "Niranjan Singh", avatar: "NS", role: "IoT Eng", color: "from-blue-500 to-indigo-600" }
    ],
    tasks: [
      { id: "TASK-131", name: "Vibration & Thermal Anomaly Detection Autoencoder", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "In Progress", priority: "High", progress: 65, dueDate: "2026-09-10" },
      { id: "TASK-132", name: "Maintenance Work Order Auto-Generation Hook", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Not Started", priority: "Medium", progress: 0, dueDate: "2026-10-15" }
    ]
  },
  {
    id: "PROJ-0015",
    name: "Enterprise Single Sign-On & SAML 2.0 Identity Hub",
    company: "SecureGate Inc",
    status: "Completed",
    priority: "High",
    owner: "Dipanwita",
    startDate: "2026-05-15",
    dueDate: "2026-08-01",
    creation: "2026-05-15",
    assignedTeamCount: 2,
    budget: 42000,
    actualCost: 39000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Security Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Alex Chen", avatar: "AC", role: "Infra Eng", color: "from-amber-500 to-yellow-600" }
    ],
    tasks: [
      { id: "TASK-141", name: "Okta, Azure AD & Google Workspace SAML Bridge", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-01" },
      { id: "TASK-142", name: "SCIM 2.0 User Provisioning Daemon", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Completed", priority: "Medium", progress: 100, dueDate: "2026-07-25" }
    ]
  },
  {
    id: "PROJ-0016",
    name: "Interactive Supply Chain Live Map & Geofencing",
    company: "FleetTrack Global",
    status: "In Progress",
    priority: "Medium",
    owner: "Tanuja",
    startDate: "2026-07-01",
    dueDate: "2026-09-25",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 52000,
    actualCost: 31000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "GIS UI Designer", color: "from-purple-500 to-pink-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "GPS Stream Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "QA", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-151", name: "Mapbox Vector Tile Layer & Vessel Tracker", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-08-10" },
      { id: "TASK-152", name: "Geofence Entry/Exit Event Trigger Microservice", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "In Progress", priority: "Medium", progress: 40, dueDate: "2026-09-25" }
    ]
  },
  {
    id: "PROJ-0017",
    name: "Automated Cold-Storage Temperature Monitoring",
    company: "CryoLogistics",
    status: "Completed",
    priority: "Low",
    owner: "Niranjan Singh",
    startDate: "2026-04-01",
    dueDate: "2026-06-25",
    creation: "2026-04-01",
    assignedTeamCount: 2,
    budget: 28000,
    actualCost: 26500,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "IoT Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "Hardware QA", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-161", name: "Bluetooth Low Energy Sensor Ingestion Gateway", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "Medium", progress: 100, dueDate: "2026-05-20" },
      { id: "TASK-162", name: "Spike Alert Emergency SMS System", category: "Development", assignee: { name: "Sushmita", avatar: "SB" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-06-15" }
    ]
  },
  {
    id: "PROJ-0018",
    name: "AI Customer Support Voicebot & Agent Assist",
    company: "TeleCom Plus",
    status: "In Progress",
    priority: "High",
    owner: "Tanuja",
    startDate: "2026-06-15",
    dueDate: "2026-10-01",
    creation: "2026-06-15",
    assignedTeamCount: 4,
    budget: 89000,
    actualCost: 51000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "AI Lead", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "LLM Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Alex Chen", avatar: "AC", role: "Audio Pipeline", color: "from-amber-500 to-yellow-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Lead", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-171", name: "Real-Time WebSocket Speech-to-Text Stream", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-25" },
      { id: "TASK-172", name: "RAG Knowledge Base Dynamic Context Retrieval", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "In Progress", priority: "High", progress: 80, dueDate: "2026-08-30" },
      { id: "TASK-173", name: "Call Center Agent Co-Pilot Live Suggestion UI", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 35, dueDate: "2026-10-01" }
    ]
  },
  {
    id: "PROJ-0019",
    name: "Enterprise Digital Asset Management (DAM) 2.0",
    company: "MediaStudio",
    status: "Not Started",
    priority: "Low",
    owner: "Dipanwita",
    startDate: "2026-09-15",
    dueDate: "2026-12-15",
    creation: "2026-08-18",
    assignedTeamCount: 3,
    budget: 45000,
    actualCost: 0,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Backend Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600" },
      { name: "Alex Chen", avatar: "AC", role: "Storage Eng", color: "from-amber-500 to-yellow-600" }
    ],
    tasks: [
      { id: "TASK-181", name: "S3 Intelligent Tiering & Video Transcoding Pipeline", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Not Started", priority: "Medium", progress: 0, dueDate: "2026-10-30" },
      { id: "TASK-182", name: "AI Semantic Image Search & Auto-Tagging", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Not Started", priority: "Medium", progress: 0, dueDate: "2026-11-30" }
    ]
  },
  {
    id: "PROJ-0020",
    name: "Zero-Trust Network Perimeter & Micro-Segmentation",
    company: "CyberArmor",
    status: "In Progress",
    priority: "Urgent",
    owner: "Alex Chen",
    startDate: "2026-07-01",
    dueDate: "2026-09-15",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 80000,
    actualCost: 55000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "Security Architect", color: "from-amber-500 to-yellow-600" },
      { name: "Sushmita", avatar: "SB", role: "Infra Security", color: "from-rose-500 to-orange-500" },
      { name: "Niranjan Singh", avatar: "NS", role: "Network Eng", color: "from-blue-500 to-indigo-600" }
    ],
    tasks: [
      { id: "TASK-191", name: "eBPF Kernel Network Packet Filter Deployment", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Completed", priority: "Urgent", progress: 100, dueDate: "2026-08-05" },
      { id: "TASK-192", name: "Service-to-Service mTLS Certificate Authority", category: "Development", assignee: { name: "Sushmita", avatar: "SB" }, status: "In Progress", priority: "High", progress: 65, dueDate: "2026-09-15" }
    ]
  },
  {
    id: "PROJ-0021",
    name: "Solar Energy Microgrid Telemetry & Dispatch",
    company: "SunPower Grid",
    status: "In Progress",
    priority: "High",
    owner: "Niranjan Singh",
    startDate: "2026-06-20",
    dueDate: "2026-09-20",
    creation: "2026-06-20",
    assignedTeamCount: 3,
    budget: 65000,
    actualCost: 38000,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "Lead Engineer", color: "from-blue-500 to-indigo-600" },
      { name: "Alex Chen", avatar: "AC", role: "Data Eng", color: "from-amber-500 to-yellow-600" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600" }
    ],
    tasks: [
      { id: "TASK-201", name: "Inverter MODBUS RS485 Data Acquisition Daemon", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-20" },
      { id: "TASK-202", name: "Battery Storage Charge/Discharge Forecast UI", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 50, dueDate: "2026-09-20" }
    ]
  },
  {
    id: "PROJ-0022",
    name: "Automated Fleet Maintenance & Fuel Tracking",
    company: "SwiftLogistics",
    status: "Completed",
    priority: "Medium",
    owner: "Sushmita",
    startDate: "2026-03-15",
    dueDate: "2026-06-30",
    creation: "2026-03-15",
    assignedTeamCount: 2,
    budget: 38000,
    actualCost: 36000,
    assignedUsers: [
      { name: "Sushmita", avatar: "SB", role: "Fleet Lead", color: "from-rose-500 to-orange-500" },
      { name: "Dipanwita", avatar: "DP", role: "Backend Eng", color: "from-emerald-500 to-teal-600" }
    ],
    tasks: [
      { id: "TASK-211", name: "OBD-II Telematics Data Parser & Mileage Engine", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "Medium", progress: 100, dueDate: "2026-05-10" },
      { id: "TASK-212", name: "Fuel Card Purchase Reconciliation Script", category: "Migration", assignee: { name: "Sushmita", avatar: "SB" }, status: "Completed", priority: "Low", progress: 100, dueDate: "2026-06-25" }
    ]
  },
  {
    id: "PROJ-0023",
    name: "Self-Service Employee HR & Benefits Portal",
    company: "PeopleFirst HR",
    status: "In Progress",
    priority: "Medium",
    owner: "Tanuja",
    startDate: "2026-07-10",
    dueDate: "2026-10-15",
    creation: "2026-07-10",
    assignedTeamCount: 3,
    budget: 49000,
    actualCost: 23000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "Frontend Lead", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "Backend Lead", color: "from-emerald-500 to-teal-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Engineer", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-221", name: "Annual Health Insurance Open Enrollment Wizard", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "High", progress: 70, dueDate: "2026-09-01" },
      { id: "TASK-222", name: "PTO & Sick Leave Automatic Balance Calculator", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "In Progress", priority: "Medium", progress: 40, dueDate: "2026-10-15" }
    ]
  },
  {
    id: "PROJ-0024",
    name: "Real-Time Fraud Detection & Risk Scoring Engine",
    company: "PayGuard Financial",
    status: "In Progress",
    priority: "Urgent",
    owner: "Alex Chen",
    startDate: "2026-06-01",
    dueDate: "2026-09-05",
    creation: "2026-06-01",
    assignedTeamCount: 4,
    budget: 105000,
    actualCost: 72000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "Risk Architect", color: "from-amber-500 to-yellow-600" },
      { name: "Dipanwita", avatar: "DP", role: "ML Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Stream Processing", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Lead", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-231", name: "Kafka Event Stream Anomaly Rule Evaluator", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "Urgent", progress: 100, dueDate: "2026-07-20" },
      { id: "TASK-232", name: "Graph Neural Network Syndicate Fraud Detector", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "In Progress", priority: "High", progress: 75, dueDate: "2026-09-05" }
    ]
  },
  {
    id: "PROJ-0025",
    name: "Automated Hotel Revenue & Dynamic Pricing Engine",
    company: "GrandResort Hospitality",
    status: "Completed",
    priority: "Medium",
    owner: "Dipanwita",
    startDate: "2026-04-01",
    dueDate: "2026-07-15",
    creation: "2026-04-01",
    assignedTeamCount: 2,
    budget: 44000,
    actualCost: 42000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Pricing Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600" }
    ],
    tasks: [
      { id: "TASK-241", name: "Competitor Rate Scraping & Demand Curve Modeling", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "Medium", progress: 100, dueDate: "2026-06-10" },
      { id: "TASK-242", name: "PMS Channel Manager Two-Way Rate Sync", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-15" }
    ]
  },
  {
    id: "PROJ-0026",
    name: "Pharmaceutical Serialization & Track-and-Trace",
    company: "PharmaPure",
    status: "In Progress",
    priority: "High",
    owner: "Sushmita",
    startDate: "2026-07-01",
    dueDate: "2026-10-30",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 76000,
    actualCost: 34000,
    assignedUsers: [
      { name: "Sushmita", avatar: "SB", role: "Compliance Lead", color: "from-rose-500 to-orange-500" },
      { name: "Niranjan Singh", avatar: "NS", role: "Blockchain Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Alex Chen", avatar: "AC", role: "Data Eng", color: "from-amber-500 to-yellow-600" }
    ],
    tasks: [
      { id: "TASK-251", name: "GS1 2D DataMatrix Serialization Code Engine", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-08-15" },
      { id: "TASK-252", name: "FDA DSCSA Regulatory EPCIS Compliance Gateway", category: "Development", assignee: { name: "Sushmita", avatar: "SB" }, status: "In Progress", priority: "High", progress: 45, dueDate: "2026-10-30" }
    ]
  },
  {
    id: "PROJ-0027",
    name: "Smart Agriculture Drone NDVI Crop Health Suite",
    company: "AgriVision AI",
    status: "In Progress",
    priority: "Medium",
    owner: "Alex Chen",
    startDate: "2026-06-15",
    dueDate: "2026-09-15",
    creation: "2026-06-15",
    assignedTeamCount: 3,
    budget: 59000,
    actualCost: 35000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "Drone CV Lead", color: "from-amber-500 to-yellow-600" },
      { name: "Tanuja", avatar: "TD", role: "GIS UI Designer", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "Backend Eng", color: "from-emerald-500 to-teal-600" }
    ],
    tasks: [
      { id: "TASK-261", name: "Multispectral Orthomosaic Map Stitching Engine", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-30" },
      { id: "TASK-262", name: "Field Nitrogen & Soil Moisture Stress Heatmap", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 60, dueDate: "2026-09-15" }
    ]
  },
  {
    id: "PROJ-0028",
    name: "Automated Airport Baggage Sorting & RFID Flow",
    company: "SkyPort Authority",
    status: "Completed",
    priority: "Urgent",
    owner: "Niranjan Singh",
    startDate: "2026-03-01",
    dueDate: "2026-06-30",
    creation: "2026-03-01",
    assignedTeamCount: 3,
    budget: 98000,
    actualCost: 95000,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "Systems Architect", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "Hardware Lead", color: "from-rose-500 to-orange-500" },
      { name: "Alex Chen", avatar: "AC", role: "Network Eng", color: "from-amber-500 to-yellow-600" }
    ],
    tasks: [
      { id: "TASK-271", name: "Ultra-High Frequency RFID Conveyor Sensor Link", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "Urgent", progress: 100, dueDate: "2026-05-15" },
      { id: "TASK-272", name: "Mishandled Luggage Automated Recovery Webhook", category: "Development", assignee: { name: "Sushmita", avatar: "SB" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-06-30" }
    ]
  },
  {
    id: "PROJ-0029",
    name: "Legal Contract AI Redlining & Risk Analyzer",
    company: "LexiCounsel",
    status: "In Progress",
    priority: "High",
    owner: "Tanuja",
    startDate: "2026-07-01",
    dueDate: "2026-10-01",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 67000,
    actualCost: 33000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "NLP Lead", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "Backend Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Engineer", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-281", name: "Clause Extraction & Deviation Risk Classifier", category: "Development", assignee: { name: "Tanuja", avatar: "TD" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-08-15" },
      { id: "TASK-282", name: "Side-by-Side DOCX Redline Comparison Canvas", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 50, dueDate: "2026-10-01" }
    ]
  },
  {
    id: "PROJ-0030",
    name: "EV Charging Station OCPI Network Roaming Hub",
    company: "VoltCharge Networks",
    status: "In Progress",
    priority: "High",
    owner: "Dipanwita",
    startDate: "2026-06-10",
    dueDate: "2026-09-20",
    creation: "2026-06-10",
    assignedTeamCount: 3,
    budget: 72000,
    actualCost: 46000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Protocol Architect", color: "from-emerald-500 to-teal-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Billing Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Alex Chen", avatar: "AC", role: "DevOps", color: "from-amber-500 to-yellow-600" }
    ],
    tasks: [
      { id: "TASK-291", name: "OCPI 2.2.1 Tariff & CDR Exchange Service", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-25" },
      { id: "TASK-292", name: "Plug & Charge ISO 15118 Certificate Exchange", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "In Progress", priority: "High", progress: 60, dueDate: "2026-09-20" }
    ]
  },
  {
    id: "PROJ-0031",
    name: "Automated Insurance Claims Video Damage Estimator",
    company: "InsureSure",
    status: "Not Started",
    priority: "Medium",
    owner: "Alex Chen",
    startDate: "2026-09-01",
    dueDate: "2026-11-30",
    creation: "2026-08-20",
    assignedTeamCount: 3,
    budget: 63000,
    actualCost: 0,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "CV Engineer", color: "from-amber-500 to-yellow-600" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "Backend Eng", color: "from-emerald-500 to-teal-600" }
    ],
    tasks: [
      { id: "TASK-301", name: "Vehicle 360 Video Keyframe Extraction & Bumper Analysis", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Not Started", priority: "High", progress: 0, dueDate: "2026-10-15" },
      { id: "TASK-302", name: "Automated Parts & Labor Cost Lookup Matrix", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Not Started", priority: "Medium", progress: 0, dueDate: "2026-11-30" }
    ]
  },
  {
    id: "PROJ-0032",
    name: "Smart Water Utility Leakage Acoustic Sensor Grid",
    company: "AquaPure Municipal",
    status: "Completed",
    priority: "Low",
    owner: "Niranjan Singh",
    startDate: "2026-03-01",
    dueDate: "2026-05-30",
    creation: "2026-03-01",
    assignedTeamCount: 2,
    budget: 34000,
    actualCost: 32000,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "IoT Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Lead", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-311", name: "Hydrophone FFT Frequency Noise Classifier", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "Medium", progress: 100, dueDate: "2026-04-20" },
      { id: "TASK-312", name: "Municipal Pipe GIS GeoJSON Overlay", category: "UI", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Completed", priority: "Low", progress: 100, dueDate: "2026-05-30" }
    ]
  },
  {
    id: "PROJ-0033",
    name: "Campus Dining Micro-Payment & Meal Plan NFC",
    company: "UniCampus Systems",
    status: "In Progress",
    priority: "Medium",
    owner: "Tanuja",
    startDate: "2026-07-15",
    dueDate: "2026-09-30",
    creation: "2026-07-15",
    assignedTeamCount: 3,
    budget: 39000,
    actualCost: 22000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "Mobile Lead", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "Payment Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Engineer", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-321", name: "Apple Wallet & Google Pay Student ID Pass Integration", category: "Development", assignee: { name: "Tanuja", avatar: "TD" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-08-20" },
      { id: "TASK-322", name: "Dining Hall Turnstile Offline Verification Mode", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "In Progress", priority: "Medium", progress: 40, dueDate: "2026-09-30" }
    ]
  },
  {
    id: "PROJ-0034",
    name: "Biometric Border Control E-Passport Gateways",
    company: "National Border Agency",
    status: "Completed",
    priority: "Urgent",
    owner: "Sushmita",
    startDate: "2026-02-01",
    dueDate: "2026-06-15",
    creation: "2026-02-01",
    assignedTeamCount: 4,
    budget: 145000,
    actualCost: 140000,
    assignedUsers: [
      { name: "Sushmita", avatar: "SB", role: "Biometrics Lead", color: "from-rose-500 to-orange-500" },
      { name: "Alex Chen", avatar: "AC", role: "Security Eng", color: "from-amber-500 to-yellow-600" },
      { name: "Dipanwita", avatar: "DP", role: "Cryptographer", color: "from-emerald-500 to-teal-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Hardware Eng", color: "from-blue-500 to-indigo-600" }
    ],
    tasks: [
      { id: "TASK-331", name: "ICAO 9303 Doc9303 RFID Chip Cryptographic Verification", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "Urgent", progress: 100, dueDate: "2026-04-15" },
      { id: "TASK-332", name: "3D Infrared Facial Liveness & Anti-Spoofing Model", category: "Development", assignee: { name: "Sushmita", avatar: "SB" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-06-15" }
    ]
  },
  {
    id: "PROJ-0035",
    name: "Real-Time Crypto Settlement & Custody Gateway",
    company: "BitPrime Institutional",
    status: "In Progress",
    priority: "High",
    owner: "Dipanwita",
    startDate: "2026-06-01",
    dueDate: "2026-09-15",
    creation: "2026-06-01",
    assignedTeamCount: 3,
    budget: 115000,
    actualCost: 78000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "Blockchain Architect", color: "from-emerald-500 to-teal-600" },
      { name: "Alex Chen", avatar: "AC", role: "HSM Security", color: "from-amber-500 to-yellow-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Backend Eng", color: "from-blue-500 to-indigo-600" }
    ],
    tasks: [
      { id: "TASK-341", name: "Multi-Party Computation (MPC) Threshold Key Sharding", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "Urgent", progress: 100, dueDate: "2026-07-20" },
      { id: "TASK-342", name: "Omnibus Hot/Cold Vault Rebalancing Daemon", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "In Progress", priority: "High", progress: 65, dueDate: "2026-09-15" }
    ]
  },
  {
    id: "PROJ-0036",
    name: "Construction Jobsite 3D BIM Clash Detection",
    company: "BuildCorp Engineering",
    status: "In Progress",
    priority: "Medium",
    owner: "Alex Chen",
    startDate: "2026-07-01",
    dueDate: "2026-10-10",
    creation: "2026-07-01",
    assignedTeamCount: 3,
    budget: 68000,
    actualCost: 35000,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "BIM Specialist", color: "from-amber-500 to-yellow-600" },
      { name: "Tanuja", avatar: "TD", role: "3D WebGL UI", color: "from-purple-500 to-pink-600" },
      { name: "Sushmita", avatar: "SB", role: "QA Engineer", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-351", name: "IFC 3D Model Spatial Collision Pipeline", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-08-10" },
      { id: "TASK-352", name: "Three.js WebGL Interactive Jobsite Inspector UI", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Medium", progress: 55, dueDate: "2026-10-10" }
    ]
  },
  {
    id: "PROJ-0037",
    name: "AI Radiologist X-Ray Pneumonia Triage Tool",
    company: "Apex Healthcare AI",
    status: "In Progress",
    priority: "Urgent",
    owner: "Tanuja",
    startDate: "2026-06-15",
    dueDate: "2026-09-30",
    creation: "2026-06-15",
    assignedTeamCount: 3,
    budget: 92000,
    actualCost: 59000,
    assignedUsers: [
      { name: "Tanuja", avatar: "TD", role: "Medical AI Lead", color: "from-purple-500 to-pink-600" },
      { name: "Dipanwita", avatar: "DP", role: "DICOM Eng", color: "from-emerald-500 to-teal-600" },
      { name: "Sushmita", avatar: "SB", role: "Clinical QA", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-361", name: "DICOM Image Preprocessing & Contrast Normalization", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-07-25" },
      { id: "TASK-362", name: "ResNet-50 Heatmap CAM Overlay Triage Engine", category: "Development", assignee: { name: "Tanuja", avatar: "TD" }, status: "In Progress", priority: "Urgent", progress: 75, dueDate: "2026-09-30" }
    ]
  },
  {
    id: "PROJ-0038",
    name: "Autonomous Drone Delivery Fleet Dispatcher",
    company: "AirExpress Logistics",
    status: "Not Started",
    priority: "High",
    owner: "Alex Chen",
    startDate: "2026-09-01",
    dueDate: "2026-12-01",
    creation: "2026-08-20",
    assignedTeamCount: 3,
    budget: 84000,
    actualCost: 0,
    assignedUsers: [
      { name: "Alex Chen", avatar: "AC", role: "Avionics Lead", color: "from-amber-500 to-yellow-600" },
      { name: "Niranjan Singh", avatar: "NS", role: "Routing Eng", color: "from-blue-500 to-indigo-600" },
      { name: "Sushmita", avatar: "SB", role: "Safety QA", color: "from-rose-500 to-orange-500" }
    ],
    tasks: [
      { id: "TASK-371", name: "FAA Airspace Geofence Obstacle Routing Graph", category: "Development", assignee: { name: "Niranjan Singh", avatar: "NS" }, status: "Not Started", priority: "High", progress: 0, dueDate: "2026-10-30" },
      { id: "TASK-372", name: "Battery Level Dynamic Return-to-Home Thresholds", category: "Development", assignee: { name: "Alex Chen", avatar: "AC" }, status: "Not Started", priority: "Medium", progress: 0, dueDate: "2026-12-01" }
    ]
  },
  {
    id: "PROJ-0039",
    name: "Enterprise Energy Carbon Footprint ESG Ledger",
    company: "EcoMetric Carbon",
    status: "Completed",
    priority: "Medium",
    owner: "Dipanwita",
    startDate: "2026-03-01",
    dueDate: "2026-06-20",
    creation: "2026-03-01",
    assignedTeamCount: 2,
    budget: 47000,
    actualCost: 45000,
    assignedUsers: [
      { name: "Dipanwita", avatar: "DP", role: "ESG Analyst Lead", color: "from-emerald-500 to-teal-600" },
      { name: "Tanuja", avatar: "TD", role: "UI Designer", color: "from-purple-500 to-pink-600" }
    ],
    tasks: [
      { id: "TASK-381", name: "Scope 1, 2, 3 Greenhouse Gas Emission Calculator", category: "Development", assignee: { name: "Dipanwita", avatar: "DP" }, status: "Completed", priority: "High", progress: 100, dueDate: "2026-05-15" },
      { id: "TASK-382", name: "Sustainability Executive Summary & PDF Generator", category: "UI", assignee: { name: "Tanuja", avatar: "TD" }, status: "Completed", priority: "Medium", progress: 100, dueDate: "2026-06-20" }
    ]
  },
  {
    id: "PROJ-0040",
    name: "Intelligent Smart-City Traffic Light Synchronization",
    company: "MetroCity Transit",
    status: "In Progress",
    priority: "Urgent",
    owner: "Niranjan Singh",
    startDate: "2026-07-01",
    dueDate: "2026-10-15",
    creation: "2026-07-01",
    assignedTeamCount: 4,
    budget: 96000,
    actualCost: 51000,
    assignedUsers: [
      { name: "Niranjan Singh", avatar: "NS", role: "Lead Systems Architect", color: "from-blue-500 to-indigo-600", email: "niranjan.ks@anantdv.com" },
      { name: "Alex Chen", avatar: "AC", role: "Computer Vision Eng", color: "from-amber-500 to-yellow-600", email: "alex.c@anantdv.com" },
      { name: "Tanuja", avatar: "TD", role: "Traffic Dashboard UI", color: "from-purple-500 to-pink-600", email: "tanuja.d@anantdv.com" },
      { name: "Sushmita", avatar: "SB", role: "QA Engineer", color: "from-rose-500 to-orange-500", email: "sushmita.b@anantdv.com" }
    ],
    tasks: [
      {
        id: "TASK-391",
        name: "Junction Camera Vehicle Queue Length Vision Model",
        category: "Development",
        assignee: { name: "Alex Chen", avatar: "AC" },
        status: "Completed",
        priority: "High",
        progress: 100,
        dueDate: "2026-08-15"
      },
      {
        id: "TASK-392",
        name: "Adaptive Green Wave Intersection Timing Optimizer",
        category: "Development",
        assignee: { name: "Niranjan Singh", avatar: "NS" },
        status: "In Progress",
        priority: "Urgent",
        progress: 70,
        dueDate: "2026-09-20",
        children: [
          {
            id: "TASK-392-1",
            name: "Emergency Vehicle Blue-Light Priority Preemption",
            category: "Development",
            assignee: { name: "Niranjan Singh", avatar: "NS" },
            status: "Completed",
            priority: "High",
            progress: 100,
            dueDate: "2026-08-30"
          }
        ]
      },
      {
        id: "TASK-393",
        name: "City Operations Command Center Live Map UI",
        category: "UI",
        assignee: { name: "Tanuja", avatar: "TD" },
        status: "In Progress",
        priority: "Medium",
        progress: 45,
        dueDate: "2026-10-15"
      }
    ]
  }
];

// Helper to compute overall project completion % from all tasks recursively
export function calculateProjectProgress(project) {
  const allTasks = flattenTasks(project.tasks || []);
  if (allTasks.length === 0) {
    if (project.status === "Completed") return 100;
    if (project.status === "Not Started") return 0;
    return 50;
  }
  const completed = allTasks.filter(t => t.status === "Completed").length;
  return Math.round((completed / allTasks.length) * 100);
}

// Compute and attach initial completion % for each project
initialProjects.forEach(p => {
  p.percentCompleted = calculateProjectProgress(p);
  p.totalTasksCount = flattenTasks(p.tasks || []).length;
});

export const initialActivities = [
  {
    id: "act-1",
    projectId: "PROJ-0001",
    projectName: "ADV-Nirolite ERP Core Modernization",
    taskSubject: "PostgreSQL Schema Isolation Scripting completed",
    category: "Development",
    type: "status_change",
    user: "Dipanwita",
    userAvatar: "DP",
    timestamp: "10 mins ago"
  },
  {
    id: "act-2",
    projectId: "PROJ-0040",
    projectName: "Intelligent Smart-City Traffic Light Synchronization",
    taskSubject: "Emergency Vehicle Blue-Light Priority Preemption verified",
    category: "Development",
    type: "status_change",
    user: "Niranjan Singh",
    userAvatar: "NS",
    timestamp: "35 mins ago"
  },
  {
    id: "act-3",
    projectId: "PROJ-0002",
    projectName: "ADV-VMS Visitor Management & QR Check-in",
    taskSubject: "Touchscreen Kiosk Guest Registration Flow UI approved",
    category: "UI",
    type: "status_change",
    user: "Tanuja",
    userAvatar: "TD",
    timestamp: "1 hour ago"
  },
  {
    id: "act-4",
    projectId: "PROJ-0007",
    projectName: "Global Multi-Region Cloud Infrastructure Migration",
    taskSubject: "Kubernetes Cluster Auto-Scaling & Mesh Setup updated to 75%",
    category: "Development",
    type: "progress_update",
    user: "Alex Chen",
    userAvatar: "AC",
    timestamp: "2 hours ago"
  }
];

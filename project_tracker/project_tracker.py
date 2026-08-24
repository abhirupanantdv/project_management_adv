import frappe
from frappe.utils import getdate, nowdate, flt, cint
import json

CATEGORIES_LIST = ["Development", "UI", "Migration", "Testing", "Documentation"]

def infer_category(task):
    """
    Infers task category among Development, UI, Migration, Testing, Documentation
    from custom_category, type, or subject.
    """
    # Check custom_category if added by user
    if task.get("custom_category"):
        cat = task.get("custom_category")
        if cat in CATEGORIES_LIST:
            return cat

    task_type = (task.get("type") or "").lower()
    subject = (task.get("subject") or "").lower()

    if any(w in task_type for w in ["dev", "backend", "logic", "api", "database", "schema"]):
        return "Development"
    if any(w in task_type for w in ["ui", "frontend", "design", "layout", "screen"]):
        return "UI"
    if any(w in task_type for w in ["migrat", "import", "legacy", "convert"]):
        return "Migration"
    if any(w in task_type for w in ["test", "qa", "review", "bug", "bench"]):
        return "Testing"
    if any(w in task_type for w in ["doc", "manual", "spec", "wiki", "guide"]):
        return "Documentation"

    if any(w in subject for w in ["ui", "dashboard", "frontend", "screen", "kiosk", "portal", "layout"]):
        return "UI"
    if any(w in subject for w in ["migration", "migrate", "legacy", "ledger", "pop", "import"]):
        return "Migration"
    if any(w in subject for w in ["test", "qa", "stress", "bench", "compliance", "audit"]):
        return "Testing"
    if any(w in subject for w in ["doc", "manual", "whitepaper", "swagger", "spec", "guide"]):
        return "Documentation"

    return "Development"


@frappe.whitelist()
def get_project_dashboard_data(status_filter=None, search_term=None, priority_filter=None):
    """
    Fetches all projects along with linked tasks, categories, creation dates, assignees,
    and computed real-time metrics directly from existing Project and Task DocTypes.
    """
    filters = {}
    if status_filter and status_filter != "All":
        filters["status"] = status_filter
    if priority_filter and priority_filter != "All":
        filters["priority"] = priority_filter
    if search_term:
        filters["project_name"] = ["like", f"%{search_term}%"]

    # Fetch projects from standard Project DocType
    projects = frappe.get_all(
        "Project",
        filters=filters,
        fields=[
            "name", "project_name", "status", "priority", "customer",
            "percent_complete_method", "percent_completed",
            "expected_start_date", "expected_end_date", "company",
            "project_type", "estimated_cost", "total_costing_amount",
            "creation", "_assign", "owner"
        ],
        order_by="creation desc, modified desc",
        limit_page_length=100
    )

    project_names = [p.name for p in projects]

    # Fetch tasks linked to these projects from standard Task DocType
    tasks = []
    if project_names:
        tasks = frappe.get_all(
            "Task",
            filters={"project": ["in", project_names]},
            fields=[
                "name", "subject", "project", "status", "priority",
                "exp_start_date", "exp_end_date", "progress",
                "completed_on", "type", "creation", "_assign"
            ],
            order_by="exp_start_date asc, creation asc",
            limit_page_length=500
        )

    # Group tasks by project and attach category
    tasks_by_project = {}
    for task in tasks:
        task["category"] = infer_category(task)
        # Parse task assignee
        assignee_name = "Unassigned"
        if task.get("_assign"):
            try:
                raw = json.loads(task["_assign"]) if isinstance(task["_assign"], str) else task["_assign"]
                if isinstance(raw, list) and len(raw) > 0:
                    assignee_name = raw[0].split('@')[0].replace('.', ' ').title()
            except Exception:
                pass
        task["assignee"] = assignee_name
        tasks_by_project.setdefault(task.project, []).append(task)

    # Compute KPIs
    total_projects = len(projects)
    active_projects = 0
    completed_projects = 0
    total_tasks_count = len(tasks)
    completed_tasks_count = 0
    overdue_tasks_count = 0
    today = getdate(nowdate())

    category_summary = {c: {"total": 0, "completed": 0, "progress": 0} for c in CATEGORIES_LIST}
    project_list = []

    for p in projects:
        proj_tasks = tasks_by_project.get(p.name, [])
        total_p_tasks = len(proj_tasks)
        p_completed = len([t for t in proj_tasks if t.status == "Completed"])
        p_working = len([t for t in proj_tasks if t.status in ["Working", "In Progress"]])
        p_open = len([t for t in proj_tasks if t.status in ["Open", "Pending Review"]])
        p_overdue = 0

        # Project Category Breakdown
        p_cat_metrics = {c: {"total": 0, "completed": 0, "progress": 0} for c in CATEGORIES_LIST}

        for t in proj_tasks:
            cat = t["category"]
            if cat in p_cat_metrics:
                p_cat_metrics[cat]["total"] += 1
                category_summary[cat]["total"] += 1
                if t.status == "Completed":
                    p_cat_metrics[cat]["completed"] += 1
                    category_summary[cat]["completed"] += 1

            if t.status == "Completed":
                completed_tasks_count += 1
            else:
                if t.exp_end_date and getdate(t.exp_end_date) < today:
                    p_overdue += 1
                    overdue_tasks_count += 1

        for c in CATEGORIES_LIST:
            if p_cat_metrics[c]["total"] > 0:
                p_cat_metrics[c]["progress"] = round((p_cat_metrics[c]["completed"] / p_cat_metrics[c]["total"]) * 100, 1)

        # Calculate actual project progress %
        calc_progress = 0
        if total_p_tasks > 0:
            calc_progress = round((p_completed / total_p_tasks) * 100, 1)
        else:
            calc_progress = round(flt(p.percent_completed), 1)

        if p.status == "Completed":
            completed_projects += 1
        elif p.status in ["Open", "Working"]:
            active_projects += 1

        # Parse assigned users for project
        assigned_users = []
        if p.get("_assign"):
            try:
                assigned_raw = json.loads(p["_assign"]) if isinstance(p["_assign"], str) else p["_assign"]
                if isinstance(assigned_raw, list):
                    for email in assigned_raw:
                        clean_name = email.split('@')[0].replace('.', ' ').title()
                        assigned_users.append({
                            "name": clean_name,
                            "email": email,
                            "avatar": "".join([n[0] for n in clean_name.split()[:2]]).upper()
                        })
            except Exception:
                pass
        if not assigned_users and p.get("owner"):
            clean_owner = p["owner"].split('@')[0].replace('.', ' ').title()
            assigned_users.append({
                "name": clean_owner,
                "email": p["owner"],
                "avatar": "".join([n[0] for n in clean_owner.split()[:2]]).upper()
            })

        project_list.append({
            "name": p.name,
            "project_name": p.project_name or p.name,
            "customer": p.get("customer") or p.get("company") or "Enterprise",
            "status": p.status or "Open",
            "priority": p.priority or "Medium",
            "project_type": p.project_type or "Internal",
            "creation": str(p.creation).split(" ")[0] if p.creation else "",
            "percent_completed": calc_progress,
            "expected_start_date": str(p.expected_start_date) if p.expected_start_date else "",
            "expected_end_date": str(p.expected_end_date) if p.expected_end_date else "",
            "company": p.company,
            "total_tasks": total_p_tasks,
            "completed_tasks": p_completed,
            "working_tasks": p_working,
            "open_tasks": p_open,
            "overdue_tasks": p_overdue,
            "category_metrics": p_cat_metrics,
            "assigned_users": assigned_users,
            "tasks": proj_tasks
        })

    for c in CATEGORIES_LIST:
        if category_summary[c]["total"] > 0:
            category_summary[c]["progress"] = round((category_summary[c]["completed"] / category_summary[c]["total"]) * 100, 1)

    overall_progress = 0
    if total_tasks_count > 0:
        overall_progress = round((completed_tasks_count / total_tasks_count) * 100, 1)

    return {
        "kpi": {
            "total_projects": total_projects,
            "active_projects": active_projects,
            "completed_projects": completed_projects,
            "total_tasks": total_tasks_count,
            "completed_tasks": completed_tasks_count,
            "overdue_tasks": overdue_tasks_count,
            "overall_progress": overall_progress,
            "category_summary": category_summary
        },
        "projects": project_list
    }


@frappe.whitelist()
def update_task_status_quick(task_name, new_status):
    """
    Updates task status directly and recalculates parent project progress and status.
    """
    if not frappe.has_permission("Task", "write"):
        frappe.throw("You do not have permission to update Task records.")

    task = frappe.get_doc("Task", task_name)
    task.status = new_status
    if new_status == "Completed":
        task.progress = 100
        task.completed_on = nowdate()
    elif new_status == "Open":
        task.progress = 0
        task.completed_on = None
    elif new_status in ["Working", "In Progress"]:
        if flt(task.progress) == 0 or flt(task.progress) == 100:
            task.progress = 50

    task.save()

    # Automatically check sibling tasks and update parent project
    if task.project:
        all_tasks = frappe.get_all("Task", filters={"project": task.project}, fields=["status"])
        total = len(all_tasks)
        completed = len([t for t in all_tasks if t.status == "Completed"])
        cancelled = len([t for t in all_tasks if t.status == "Cancelled"])
        working = len([t for t in all_tasks if t.status in ["Working", "In Progress"]])

        project = frappe.get_doc("Project", task.project)
        new_progress = round((completed / total) * 100, 1) if total > 0 else 0
        project.percent_completed = new_progress

        if total > 0 and (completed + cancelled) == total:
            project.status = "Completed"
        elif completed > 0 or working > 0:
            if project.status in ["Completed", "Open"]:
                project.status = "Working"

        project.flags.ignore_permissions = True
        project.save()

    return {"status": "success", "project": task.project, "new_status": new_status}


@frappe.whitelist()
def create_task_quick(subject, project, category, assignee, priority, status, exp_end_date):
    """
    Creates a new Task in ERPNext directly into standard Task DocType using only mandatory fields.
    """
    if not subject or not project or not category or not assignee or not priority or not status or not exp_end_date:
        frappe.throw("All fields (Subject, Project, Category, Assignee, Priority, Status, Due Date) are mandatory.")

    if not frappe.has_permission("Task", "create"):
        frappe.throw("You do not have permission to create Task records.")

    task = frappe.new_doc("Task")
    task.subject = subject.strip()
    task.project = project.strip()
    task.type = category.strip()
    task.priority = priority.strip()
    task.status = status.strip()
    task.exp_end_date = getdate(exp_end_date)
    task.progress = 100 if status == "Completed" else (50 if status in ["Working", "In Progress"] else 0)

    task.insert()

    # Assign to user if valid user exists
    if assignee and "@" in assignee:
        try:
            from frappe.desk.form.assign_to import add as add_assign
            add_assign({
                "doctype": "Task",
                "name": task.name,
                "assign_to": [assignee.strip()]
            })
        except Exception:
            pass

    return {
        "status": "success",
        "task_name": task.name,
        "subject": task.subject,
        "project": task.project
    }

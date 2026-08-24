import frappe
from frappe.utils import getdate, nowdate, flt, cint
import json

def infer_category(task):
    """
    Infers task category among Development, UI, Migration, Testing, Documentation
    """
    task_type = (task.get("type") or "").lower()
    subject = (task.get("subject") or "").lower()

    if "ui" in task_type or "frontend" in task_type or "design" in task_type:
        return "UI"
    if "migrat" in task_type or "import" in task_type:
        return "Migration"
    if "test" in task_type or "qa" in task_type or "review" in task_type:
        return "Testing"
    if "doc" in task_type or "manual" in task_type or "spec" in task_type:
        return "Documentation"

    if any(w in subject for w in ["ui", "dashboard", "frontend", "screen", "kiosk", "portal"]):
        return "UI"
    if any(w in subject for w in ["migration", "migrate", "legacy", "ledger", "pop"]):
        return "Migration"
    if any(w in subject for w in ["test", "qa", "stress", "bench", "compliance"]):
        return "Testing"
    if any(w in subject for w in ["doc", "manual", "whitepaper", "swagger", "spec"]):
        return "Documentation"

    return "Development"


@frappe.whitelist()
def get_project_dashboard_data(status_filter=None, search_term=None, company_filter=None):
    """
    Fetches all projects along with their linked tasks, categories, creation dates, assignees, and computed real-time metrics.
    """
    filters = {}
    if status_filter and status_filter != "All":
        filters["status"] = status_filter
    if company_filter and company_filter != "All":
        filters["company"] = company_filter
    if search_term:
        filters["project_name"] = ["like", f"%{search_term}%"]

    # Fetch projects
    projects = frappe.get_all(
        "Project",
        filters=filters,
        fields=[
            "name", "project_name", "status", "percent_complete_method",
            "percent_completed", "expected_start_date", "expected_end_date",
            "priority", "company", "project_type", "estimated_cost",
            "total_costing_amount", "total_billable_amount", "total_billed_amount",
            "creation", "_assign", "owner"
        ],
        order_by="creation desc, modified desc"
    )

    project_names = [p.name for p in projects]

    # Fetch all tasks linked to these projects
    tasks = []
    if project_names:
        tasks = frappe.get_all(
            "Task",
            filters={"project": ["in", project_names]},
            fields=[
                "name", "subject", "project", "status", "priority",
                "exp_start_date", "exp_end_date", "progress",
                "duration", "is_group", "parent_task", "completed_on",
                "act_start_date", "act_end_date", "total_costing_amount",
                "actual_time", "expected_time", "type", "creation", "_assign"
            ],
            order_by="exp_start_date asc, creation asc"
        )

    # Group tasks by project and enrich with category
    tasks_by_project = {}
    for task in tasks:
        task["category"] = infer_category(task)
        tasks_by_project.setdefault(task.project, []).append(task)

    # Overall KPIs
    total_projects = len(projects)
    active_projects = 0
    completed_projects = 0
    total_tasks_count = len(tasks)
    completed_tasks_count = 0
    overdue_tasks_count = 0
    today = getdate(nowdate())

    categories_list = ["Development", "UI", "Migration", "Testing", "Documentation"]
    category_summary = {c: {"total": 0, "completed": 0, "progress": 0} for c in categories_list}

    project_list = []

    for p in projects:
        proj_tasks = tasks_by_project.get(p.name, [])
        total_p_tasks = len(proj_tasks)
        p_completed = len([t for t in proj_tasks if t.status == "Completed"])
        p_working = len([t for t in proj_tasks if t.status in ["Working", "In Progress"]])
        p_open = len([t for t in proj_tasks if t.status in ["Open", "Pending Review"]])
        p_overdue = 0

        # Project Category Breakdown
        p_cat_metrics = {c: {"total": 0, "completed": 0, "progress": 0} for c in categories_list}

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

        for c in categories_list:
            if p_cat_metrics[c]["total"] > 0:
                p_cat_metrics[c]["progress"] = round((p_cat_metrics[c]["completed"] / p_cat_metrics[c]["total"]) * 100, 1)

        # Calculate actual completion %
        calc_progress = 0
        if total_p_tasks > 0:
            calc_progress = round((p_completed / total_p_tasks) * 100, 1)
        else:
            calc_progress = round(flt(p.percent_completed), 1)

        if p.status == "Completed":
            completed_projects += 1
        elif p.status in ["Open", "Working"]:
            active_projects += 1

        # Parse assigned users
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
            "status": p.status,
            "priority": p.priority or "Medium",
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
            "estimated_cost": p.estimated_cost or 0,
            "category_metrics": p_cat_metrics,
            "assigned_users": assigned_users,
            "tasks": proj_tasks
        })

    for c in categories_list:
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
    Updates task status directly from UI and recalculates project status.
    """
    if not frappe.has_permission("Task", "write"):
        frappe.throw("Not permitted to update tasks")

    task = frappe.get_doc("Task", task_name)
    task.status = new_status
    if new_status == "Completed":
        task.progress = 100
        task.completed_on = nowdate()
    elif new_status == "Open":
        task.progress = 0
        task.completed_on = None
    task.save()

    # Automatically check sibling tasks to update project status
    if task.project:
        project = frappe.get_doc("Project", task.project)
        all_tasks = frappe.get_all("Task", filters={"project": task.project}, fields=["status"])
        
        total = len(all_tasks)
        completed = len([t for t in all_tasks if t.status == "Completed"])
        cancelled = len([t for t in all_tasks if t.status == "Cancelled"])

        if total > 0 and (completed + cancelled) == total:
            project.status = "Completed"
        elif completed > 0 or len([t for t in all_tasks if t.status in ["Working", "In Progress"]]) > 0:
            if project.status == "Completed":
                project.status = "Working"

        project.flags.ignore_permissions = True
        project.save()

    return {"status": "success", "project": task.project}

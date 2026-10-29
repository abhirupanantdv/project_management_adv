import frappe
from frappe import _
from frappe.utils import getdate, nowdate, flt, cint, get_fullname
import json

CATEGORIES_LIST = ["Development", "UI", "Migration", "Testing", "Documentation"]

def infer_category(task):
    """
    Infers task category among Development, UI, Migration, Testing, Documentation
    from custom_category, type, or subject.
    """
    if task.get("custom_category") and task.get("custom_category") in CATEGORIES_LIST:
        return task.get("custom_category")

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
def get_logged_user_info():
    """Returns authenticated session user details."""
    user = frappe.session.user
    if user == "Guest":
        return {
            "logged_in": False,
            "user": "Guest"
        }

    user_doc = frappe.get_cached_doc("User", user)
    return {
        "logged_in": True,
        "user": user,
        "full_name": get_fullname(user),
        "email": user_doc.email,
        "user_image": user_doc.user_image or "",
        "roles": frappe.get_roles(user)
    }


@frappe.whitelist()
def get_project_cockpit_data():
    """
    Consolidated high-performance loader.
    Fetches all accessible projects and linked tasks in 2 database queries.
    """
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    projects = frappe.get_all(
        "Project",
        fields=[
            "name as id",
            "project_name",
            "status",
            "priority",
            "percent_complete_method",
            "percent_complete",
            "percent_completed",
            "expected_start_date",
            "expected_end_date",
            "customer",
            "company",
            "project_type",
            "is_active",
            "department",
            "notes",
            "creation"
        ],
        order_by="creation desc",
        limit_page_length=200
    )

    if not projects:
        return {"projects": [], "summary": {}, "user": get_logged_user_info()}

    project_ids = [p["id"] for p in projects]

    tasks = frappe.get_all(
        "Task",
        filters={"project": ["in", project_ids]},
        fields=[
            "name as id",
            "subject",
            "status",
            "priority",
            "project",
            "exp_start_date",
            "exp_end_date",
            "expected_time",
            "actual_time",
            "progress",
            "type",
            "_assign",
            "creation"
        ],
        order_by="creation desc",
        limit_page_length=2000
    )

    tasks_by_project = {}
    today = getdate(nowdate())

    total_tasks_count = len(tasks)
    total_completed_tasks = 0
    total_working_tasks = 0
    total_open_tasks = 0
    total_overdue_tasks = 0

    for t in tasks:
        p_id = t["project"]
        if p_id not in tasks_by_project:
            tasks_by_project[p_id] = []

        assignees = []
        if t.get("_assign"):
            try:
                assignees = json.loads(t["_assign"])
            except Exception:
                assignees = [t["_assign"]]
        t["assigned_to"] = assignees
        t["category"] = infer_category(t)

        is_overdue = False
        if t.get("exp_end_date") and t.get("status") not in ["Completed", "Cancelled"]:
            if getdate(t["exp_end_date"]) < today:
                is_overdue = True
                total_overdue_tasks += 1
        t["is_overdue"] = is_overdue

        if t.get("status") == "Completed":
            total_completed_tasks += 1
        elif t.get("status") in ["Working", "In Progress"]:
            total_working_tasks += 1
        else:
            total_open_tasks += 1

        tasks_by_project[p_id].append(t)

    for p in projects:
        p_tasks = tasks_by_project.get(p["id"], [])
        p["tasks"] = p_tasks

        if p_tasks:
            comp = len([t for t in p_tasks if t.get("status") == "Completed"])
            calc_percent = round((comp / len(p_tasks)) * 100)
            p["calculated_percent"] = calc_percent
            if not p.get("percent_complete") and not p.get("percent_completed"):
                p["percent_complete"] = calc_percent
                p["percent_completed"] = calc_percent
        else:
            p["calculated_percent"] = p.get("percent_completed") or p.get("percent_complete") or 0

    return {
        "projects": projects,
        "summary": {
            "total_projects": len(projects),
            "total_tasks": total_tasks_count,
            "completed_tasks": total_completed_tasks,
            "working_tasks": total_working_tasks,
            "open_tasks": total_open_tasks,
            "overdue_tasks": total_overdue_tasks
        },
        "user": get_logged_user_info()
    }


@frappe.whitelist()
def get_project_dashboard_data(status_filter=None, search_term=None, company_filter=None, priority_filter=None):
    """
    Used by Desk Pages Project Cockpit and Project Tracker.
    Fetches all projects along with linked tasks, categories, assignees, and computed real-time metrics.
    """
    filters = {}
    if status_filter and status_filter != "All":
        filters["status"] = status_filter
    if company_filter and company_filter != "All":
        filters["company"] = company_filter
    if priority_filter and priority_filter != "All":
        filters["priority"] = priority_filter
    if search_term:
        filters["project_name"] = ["like", f"%{search_term}%"]

    projects = frappe.get_all(
        "Project",
        filters=filters,
        fields=[
            "name", "project_name", "status", "percent_complete_method",
            "percent_completed", "percent_complete", "expected_start_date", "expected_end_date",
            "priority", "company", "customer", "project_type", "estimated_cost",
            "total_costing_amount", "total_billable_amount", "total_billed_amount",
            "creation", "_assign", "owner"
        ],
        order_by="creation desc, modified desc",
        limit_page_length=200
    )

    project_names = [p.name for p in projects]
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
            order_by="exp_start_date asc, creation asc",
            limit_page_length=2000
        )

    tasks_by_project = {}
    for task in tasks:
        task["category"] = infer_category(task)
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

        calc_progress = 0
        if total_p_tasks > 0:
            calc_progress = round((p_completed / total_p_tasks) * 100, 1)
        else:
            calc_progress = round(flt(p.get("percent_completed") or p.get("percent_complete")), 1)

        if p.status == "Completed":
            completed_projects += 1
        elif p.status in ["Open", "Working"]:
            active_projects += 1

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
            "status": p.status or "Open",
            "priority": p.priority or "Medium",
            "creation": str(p.creation).split(" ")[0] if p.creation else "",
            "percent_completed": calc_progress,
            "expected_start_date": str(p.expected_start_date) if p.expected_start_date else "",
            "expected_end_date": str(p.expected_end_date) if p.expected_end_date else "",
            "company": p.company,
            "customer": p.get("customer") or p.get("company") or "Enterprise",
            "project_type": p.get("project_type") or "Internal",
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
def update_task_status(task_id, status):
    """Update task status with permission checks."""
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    task = frappe.get_doc("Task", task_id)
    task.status = status
    if status == "Completed":
        task.progress = 100
        task.completed_on = nowdate()
    elif status == "Open":
        task.progress = 0
        task.completed_on = None
    elif status in ["Working", "In Progress"]:
        if flt(task.progress) == 0 or flt(task.progress) == 100:
            task.progress = 50

    task.save(ignore_permissions=False)

    if task.project:
        try:
            proj = frappe.get_doc("Project", task.project)
            proj.flags.dont_sync_tasks = True
            all_tasks = frappe.get_all("Task", filters={"project": task.project}, fields=["status"])
            total = len(all_tasks)
            completed = len([t for t in all_tasks if t.status == "Completed"])
            cancelled = len([t for t in all_tasks if t.status == "Cancelled"])
            working = len([t for t in all_tasks if t.status in ["Working", "In Progress"]])

            if total > 0:
                proj.percent_completed = round((completed / total) * 100, 1)
                if (completed + cancelled) == total:
                    proj.status = "Completed"
                elif completed > 0 or working > 0:
                    if proj.status in ["Completed", "Open"]:
                        proj.status = "Working"
            proj.save(ignore_permissions=True)
        except Exception:
            pass

    return {
        "success": True,
        "task_id": task_id,
        "status": status
    }


@frappe.whitelist()
def update_task_status_quick(task_name, new_status):
    """Alias for update_task_status matching Desk Page signature."""
    return update_task_status(task_id=task_name, status=new_status)


@frappe.whitelist()
def create_project(project_name, project_type=None, customer=None, expected_end_date=None, priority=None):
    """Create a new Project document."""
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    doc = frappe.new_doc("Project")
    doc.project_name = project_name
    doc.status = "Open"
    if project_type:
        doc.project_type = project_type
    if customer:
        doc.customer = customer
    if expected_end_date:
        doc.expected_end_date = expected_end_date
    if priority:
        doc.priority = priority

    doc.insert(ignore_permissions=False)
    return doc.as_dict()


@frappe.whitelist()
def create_task(project, subject, status="Open", priority="Medium", exp_end_date=None, assigned_to=None):
    """Create a new Task and optionally assign it."""
    if frappe.session.user == "Guest":
        frappe.throw(_("Authentication required"), frappe.AuthenticationError)

    doc = frappe.new_doc("Task")
    doc.project = project
    doc.subject = subject
    doc.status = status
    doc.priority = priority
    if exp_end_date:
        doc.exp_end_date = exp_end_date

    doc.insert(ignore_permissions=False)

    if assigned_to:
        from frappe.desk.form import assign_to
        assign_to.add({
            "doctype": "Task",
            "name": doc.name,
            "assign_to": [assigned_to]
        })

    return doc.as_dict()


@frappe.whitelist()
def create_task_quick(subject, project, category, assignee, priority, status, exp_end_date):
    """Desk Page Quick Task Creator."""
    if not subject or not project:
        frappe.throw("Subject and Project are required.")

    doc = frappe.new_doc("Task")
    doc.subject = subject.strip()
    doc.project = project.strip()
    if category:
        doc.type = category.strip()
    if priority:
        doc.priority = priority.strip()
    if status:
        doc.status = status.strip()
        doc.progress = 100 if status == "Completed" else (50 if status in ["Working", "In Progress"] else 0)
    if exp_end_date:
        doc.exp_end_date = getdate(exp_end_date)

    doc.insert(ignore_permissions=False)

    if assignee and "@" in assignee:
        try:
            from frappe.desk.form.assign_to import add as add_assign
            add_assign({
                "doctype": "Task",
                "name": doc.name,
                "assign_to": [assignee.strip()]
            })
        except Exception:
            pass

    return {
        "status": "success",
        "task_name": doc.name,
        "subject": doc.subject,
        "project": doc.project
    }

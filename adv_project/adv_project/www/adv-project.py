import frappe
from frappe import _

no_cache = 1

def get_context(context):
    # Auto-session check: If Guest, redirect automatically to dynamic login
    if frappe.session.user == "Guest":
        frappe.local.flags.redirect_location = "/adv-login?redirect_to=/adv-project"
        raise frappe.Redirect

    user = frappe.session.user
    context.user = user
    context.full_name = frappe.utils.get_fullname(user)
    context.email = frappe.db.get_value("User", user, "email") or user
    context.user_image = frappe.db.get_value("User", user, "user_image") or ""
    context.roles = frappe.get_roles(user)
    context.title = _("Advanced Project Cockpit")
    
    # CSRF token for secure state modifications
    context.csrf_token = frappe.sessions.get_csrf_token() if hasattr(frappe, "sessions") else ""

    context.no_header = True
    context.no_footer = True
    context.no_breadcrumbs = True
    return context

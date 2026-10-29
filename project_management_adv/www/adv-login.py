import frappe

no_cache = 1

def get_context(context):
    if frappe.session.user != "Guest":
        redirect_to = frappe.form_dict.get("redirect_to") or "/adv-project"
        frappe.local.flags.redirect_location = redirect_to
        raise frappe.Redirect

    context.redirect_to = frappe.form_dict.get("redirect_to") or "/adv-project"
    context.title = "Login - Advanced Project Cockpit"
    context.no_header = True
    context.no_footer = True
    context.no_breadcrumbs = True
    return context

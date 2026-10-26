app_name = "adv_project"
app_title = "Advanced Project Management"
app_publisher = "Anantdv"
app_description = "Advanced Project Management and Tracking Cockpit for ERPNext"
app_email = "info@anantdv.com"
app_license = "MIT"
app_version = "0.0.1"

# Includes in <head>
# ------------------
# include js, css files in header of desk.html
# app_include_css = "/assets/adv_project/css/adv_project.css"
# app_include_js = "/assets/adv_project/js/adv_project.js"

# Website Routes
# --------------
# www/adv-project.html is automatically served at /adv-project
# www/adv-login.html is automatically served at /adv-login
website_route_rules = [
    {"from_route": "/adv-project", "to_route": "adv-project"},
    {"from_route": "/adv-login", "to_route": "adv-login"}
]

# Website Context
# ---------------
# update_website_context = "adv_project.website.update_website_context"

# Application Home Page
# ---------------------
# home_page = "adv-project"

# User Data Protection
# --------------------
user_data_fields = [
    {
        "doctype": "{doctype_1}",
        "filter_by": "{filter_by}",
        "redact_fields": ["{field_1}", "{field_2}"],
        "partial": 1,
    },
]

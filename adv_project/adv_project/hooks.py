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
app_include_css = [
    "/assets/adv_project/css/project_cockpit.css",
    "/assets/adv_project/css/project_tracker.css"
]
app_include_js = [
    "/assets/adv_project/js/project_cockpit.js",
    "/assets/adv_project/js/project_tracker.js"
]

# Website Routes
# --------------
website_route_rules = [
    {"from_route": "/adv-project", "to_route": "adv-project"},
    {"from_route": "/adv-login", "to_route": "adv-login"}
]

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

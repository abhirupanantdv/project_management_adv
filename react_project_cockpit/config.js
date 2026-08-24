/**
 * ============================================================================
 * ERPNEXT DYNAMIC SERVER CONFIGURATION
 * ============================================================================
 * Change the values below to connect the Project Dashboard to any ERPNext server.
 */

window.ERP_CONFIG = {
  // 1. ERPNext Server Base URL
  // Example: "http://192.168.101.175" or "http://localhost:8000" or "https://erp.yourdomain.com"
  serverUrl: "http://192.168.101.175",

  // 2. ERPNext API Key (generated in User Profile -> API Access in ERPNext)
  apiKey: "56d7e5504ef6796",

  // 3. ERPNext API Secret
  apiSecret: "9d6e53480ab4aa9",

  // 4. Combined Authorization Token (format: "apiKey:apiSecret")
  token: "56d7e5504ef6796:9d6e53480ab4aa9",

  // 5. Enable Dynamic REST API Synchronization
  // Set to true to fetch and sync live Projects & Tasks from ERPNext
  enableLiveApi: true,

  // 6. Auto-Refresh Poll Interval (in seconds, 0 = disabled)
  refreshIntervalSec: 30
};

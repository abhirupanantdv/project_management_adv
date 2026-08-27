/**
 * ============================================================================
 * ERPNEXT DYNAMIC SERVER CONFIGURATION
 * ============================================================================
 * Connected to live ERPNext Server: http://192.168.101.125:8080
 */

window.ERP_CONFIG = {
  // 1. ERPNext Server Base URL
  serverUrl: "http://192.168.101.125:8080",

  // 2. ERPNext API Key
  apiKey: "f13b1b924ac9194",

  // 3. ERPNext API Secret
  apiSecret: "fa26ad1326aef0c",

  // 4. Combined Authorization Token (format: "apiKey:apiSecret")
  token: "f13b1b924ac9194:fa26ad1326aef0c",

  // 5. Enable Dynamic REST API Synchronization
  enableLiveApi: true,

  // 6. Auto-Refresh Poll Interval (in seconds, 0 = disabled)
  refreshIntervalSec: 30
};

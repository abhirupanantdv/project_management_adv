param (
    [int]$Port = 3000,
    [string]$Path = "c:\Users\tanuj\Downloads\AI Agent\react_project_cockpit"
)

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Prefixes.Add("http://127.0.0.1:$Port/")

try {
    $listener.Start()
    Write-Host "Server running at http://localhost:$Port/ and http://127.0.0.1:$Port/"
} catch {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    $listener.Start()
    Write-Host "Server running at http://localhost:$Port/"
}

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".jsx"  = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
}

# Live ERPNext Target Instance and Token
$erpBaseUrl = "http://192.168.101.125:8080"
$erpToken = "f13b1b924ac9194:fa26ad1326aef0c"

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $relPath = $request.Url.LocalPath.TrimStart('/')

        # Handle ERPNext CORS Proxy
        if ($relPath.StartsWith("api/erpnext/")) {
            $erpEndpoint = $relPath.Substring("api/erpnext/".Length)
            $targetUrl = "$erpBaseUrl/api/$erpEndpoint" + $request.Url.Query

            try {
                $proxyReq = [System.Net.HttpWebRequest]::Create($targetUrl)
                $proxyReq.Method = $request.HttpMethod
                $proxyReq.Headers.Add("Authorization", "token $erpToken")
                $proxyReq.Timeout = 15000

                if ($request.HttpMethod -eq "POST" -or $request.HttpMethod -eq "PUT") {
                    $proxyReq.ContentType = "application/json"
                    $reqStream = $request.InputStream
                    $proxyStream = $proxyReq.GetRequestStream()
                    $reqStream.CopyTo($proxyStream)
                    $proxyStream.Close()
                }

                $proxyRes = $proxyReq.GetResponse()
                $resStream = $proxyRes.GetResponseStream()
                $reader = New-Object System.IO.StreamReader($resStream)
                $resBody = $reader.ReadToEnd()

                $bytes = [System.Text.Encoding]::UTF8.GetBytes($resBody)
                $response.ContentType = "application/json; charset=utf-8"
                $response.ContentLength64 = $bytes.Length
                $response.StatusCode = 200
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            } catch {
                $errJson = '{"error": "' + $_.Exception.Message.Replace('"', '\"') + '"}'
                $bytes = [System.Text.Encoding]::UTF8.GetBytes($errJson)
                $response.ContentType = "application/json"
                $response.StatusCode = 502
                $response.AddHeader("Access-Control-Allow-Origin", "*")
                $response.OutputStream.Write($bytes, 0, $bytes.Length)
            }
            $response.Close()
            continue
        }

        if ([string]::IsNullOrWhiteSpace($relPath)) {
            $relPath = "index.html"
        }

        $fullPath = Join-Path $Path $relPath

        if (Test-Path $fullPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($fullPath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
            $bytes = [System.IO.File]::ReadAllBytes($fullPath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $indexPath = Join-Path $Path "index.html"
            $bytes = [System.IO.File]::ReadAllBytes($indexPath)
            $response.ContentType = "text/html; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        }
        $response.Close()
    } catch {
        # ignore transient client disconnects
    }
}

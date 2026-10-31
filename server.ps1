# ==============================================================================
# ROOH | رُوح — Premium Beauty E-Commerce Local Web Server
# High-Performance HTTP Server via System.Net.HttpListener
# ==============================================================================

param(
    [int]$Port = 3000
)

$currentDir = $PSScriptRoot
if (-not $currentDir) { $currentDir = (Get-Location).Path }

# Find available port if 3000 is occupied
$listener = $null
while ($Port -lt 3050) {
    try {
        $prefix = "http://localhost:$Port/"
        $listener = New-Object System.Net.HttpListener
        $listener.Prefixes.Add($prefix)
        $listener.Start()
        break
    } catch {
        $Port++
        if ($listener) { $listener.Close() }
    }
}

if (-not $listener -or -not $listener.IsListening) {
    Write-Error "Could not start HttpListener. Please open index.html directly in your browser."
    exit 1
}

$url = "http://localhost:$Port/"
Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkRed
Write-Host "       ROOH | رُوح — Haute Parfumerie & Beauté Platform           " -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor DarkRed
Write-Host "  ✨ Storefront URL:    $url" -ForegroundColor Green
Write-Host "  ⚙️ Admin Ecosystem:  $url"admin.html -ForegroundColor Cyan
Write-Host "  🚚 ROOH Delivery:    $url"track.html -ForegroundColor Magenta
Write-Host "------------------------------------------------------------------" -ForegroundColor Gray
Write-Host "  Serving files from:  $currentDir" -ForegroundColor Gray
Write-Host "  Press Ctrl+C in this terminal window to stop the server." -ForegroundColor Yellow
Write-Host "==================================================================" -ForegroundColor DarkRed
Write-Host ""

# Open default browser automatically
Start-Process $url

# MIME types mapping
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
    ".wav"  = "audio/wav"
    ".mp3"  = "audio/mpeg"
}

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $reqPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($reqPath)) {
            $reqPath = "index.html"
        }

        # Clean URL query params & directory traversal
        $reqPath = $reqPath.Replace('/', [System.IO.Path]::DirectorySeparatorChar)
        $filePath = Join-Path $currentDir $reqPath

        if (Test-Path $filePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $mime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mime
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found - ROOH Platform</h1>")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.OutputStream.Close()
    }
} finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
}


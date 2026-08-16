# ArtMind Backend - Demo script cho 11 nhóm chức năng
# Cách dùng:
#   1. Terminal 1: cd artmind-backend/server && npm start
#   2. Terminal 2: powershell -ExecutionPolicy Bypass -File scripts/demo-backend.ps1

$Base = "http://localhost:5000/api"
$Pass = 0
$Fail = 0

function Write-Section($num, $title) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host " [$num] $title" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
}

function Test-Api {
    param(
        [string]$Name,
        [scriptblock]$Action
    )
    try {
        $result = & $Action
        Write-Host "  PASS  $Name" -ForegroundColor Green
        if ($result) { Write-Host "        -> $result" -ForegroundColor DarkGray }
        $script:Pass++
    } catch {
        $msg = $_.ErrorDetails.Message
        if (-not $msg) { $msg = $_.Exception.Message }
        Write-Host "  FAIL  $Name" -ForegroundColor Red
        Write-Host "        -> $msg" -ForegroundColor DarkRed
        $script:Fail++
    }
}

Write-Host "ArtMind Backend Demo - $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow

# Kiem tra server
Test-Api "Server health check" {
    $r = Invoke-RestMethod "$Base/health"
    if (-not $r.success) { throw "health failed" }
    return $r.message
}

# --- 1. Authentication ---
Write-Section 1 "Authentication & Bao mat"

$Token = $null
Test-Api "POST /auth/login (admin)" {
    $body = @{ email = "admin@artmind.local"; password = "Admin@123" } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Post -Uri "$Base/auth/login" -ContentType "application/json" -Body $body
    $script:Token = $r.token
    return "role=$($r.user.role), token OK"
}

$Headers = @{ Authorization = "Bearer $Token" }

Test-Api "GET /auth/me" {
    $r = Invoke-RestMethod -Uri "$Base/auth/me" -Headers $Headers
    return $r.user.email
}

Test-Api "POST /auth/register (user moi)" {
    $suffix = Get-Random -Maximum 99999
    $body = @{
        username = "demo_user_$suffix"
        email = "demo_$suffix@artmind.local"
        password = "Demo@123"
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Post -Uri "$Base/auth/register" -ContentType "application/json" -Body $body
    return $r.user.username
}

Test-Api "POST /auth/logout" {
    $r = Invoke-RestMethod -Method Post -Uri "$Base/auth/logout" -Headers $Headers
    return $r.message
}

# --- 2. Recommendation ---
Write-Section 2 "Recommendation System"

Test-Api "GET /recommendations (ca nhan)" {
    $r = Invoke-RestMethod -Uri "$Base/recommendations" -Headers $Headers
    return "personalized=$($r.personalized), count=$($r.recommendations.Count)"
}

Test-Api "GET /recommendations/trending" {
    $r = Invoke-RestMethod -Uri "$Base/recommendations/trending"
    return "$($r.data.Count) tranh trending"
}

# --- 3. Painting Detail ---
Write-Section 3 "Painting Detail API"

Test-Api "GET /paintings/p1 (chi tiet)" {
    $r = Invoke-RestMethod -Uri "$Base/paintings/p1"
    return "$($r.data.title) by $($r.data.artist)"
}

Test-Api "GET /paintings/p1/similar" {
    $r = Invoke-RestMethod -Uri "$Base/paintings/p1/similar"
    return "$($r.data.Count) tranh tuong tu"
}

Test-Api "GET /paintings/p1/summary (AI)" {
    $r = Invoke-RestMethod -Uri "$Base/paintings/p1/summary"
    $short = $r.data.summary.Substring(0, [Math]::Min(60, $r.data.summary.Length))
    return "cached=$($r.data.cached): $short..."
}

Test-Api "POST /paintings/p1/view (tang luot xem)" {
    $r = Invoke-RestMethod -Method Post -Uri "$Base/paintings/p1/view" -Headers $Headers
    return "views=$($r.data.views), popularity=$($r.data.popularity)"
}

# --- 4. Smart Categorization ---
Write-Section 4 "Smart Categorization"

Test-Api "GET /paintings?category=Abstract (loc)" {
    $r = Invoke-RestMethod -Uri "$Base/paintings?category=Abstract&limit=5"
    return "total=$($r.pagination.total), page=$($r.pagination.page)"
}

Test-Api "GET /categories" {
    $r = Invoke-RestMethod -Uri "$Base/categories"
    return "$($r.data.categories.Count) categories, $($r.data.styles.Count) styles"
}

Test-Api "GET /categories/trending" {
    $r = Invoke-RestMethod -Uri "$Base/categories/trending"
    return "$($r.data.paintings.Count) tranh, $($r.data.categories.Count) category trends"
}

Test-Api "POST /paintings/p2/auto-tag (admin AI tag)" {
    $r = Invoke-RestMethod -Method Post -Uri "$Base/paintings/p2/auto-tag" -Headers $Headers
    return "tags: $($r.data.ai_tags -join ', ')"
}

# --- 5. Intelligent Search ---
Write-Section 5 "Intelligent Search"

Test-Api "GET /search?q=landscape (tim thuong)" {
    $r = Invoke-RestMethod -Uri "$Base/search?q=landscape&limit=5"
    return "found=$($r.pagination.total)"
}

Test-Api "POST /search/smart (NLP)" {
    $body = @{ query = "Show oil paintings with blue color theme"; page = 1; limit = 5 } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Post -Uri "$Base/search/smart" -ContentType "application/json" -Body $body
    return "extracted style=$($r.ai_extracted.style), results=$($r.pagination.total)"
}

# --- 6. User Dashboard ---
Write-Section 6 "User Dashboard APIs"

Test-Api "POST /users/me/favorites/p1" {
    $r = Invoke-RestMethod -Method Post -Uri "$Base/users/me/favorites/p1" -Headers $Headers
    return $r.message
}

Test-Api "GET /users/me/favorites" {
    $r = Invoke-RestMethod -Uri "$Base/users/me/favorites" -Headers $Headers
    return "$($r.data.Count) favorites"
}

Test-Api "POST /users/me/recent/p2" {
    $r = Invoke-RestMethod -Method Post -Uri "$Base/users/me/recent/p2" -Headers $Headers
    return $r.message
}

Test-Api "GET /users/me/recent" {
    $r = Invoke-RestMethod -Uri "$Base/users/me/recent" -Headers $Headers
    return "$($r.data.Count) recent"
}

Test-Api "GET /users/me/recommendations" {
    $r = Invoke-RestMethod -Uri "$Base/users/me/recommendations" -Headers $Headers
    return "$($r.recommendations.Count) goi y ca nhan"
}

Test-Api "GET /users/me/collections" {
    $r = Invoke-RestMethod -Uri "$Base/users/me/collections" -Headers $Headers
    return "$($r.data.aiCurated.Count) bo suu tap AI"
}

# --- 7. AI Analytics ---
Write-Section 7 "AI Analytics Module"

Test-Api "POST /analytics/track" {
    $body = @{ eventType = "click"; paintingId = "p1"; metadata = @{ source = "demo" } } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Post -Uri "$Base/analytics/track" -ContentType "application/json" -Body $body -Headers $Headers
    return "tracked click OK"
}

Test-Api "GET /analytics/trending" {
    $r = Invoke-RestMethod -Uri "$Base/analytics/trending"
    return "$($r.data.Count) tranh pho bien"
}

Test-Api "GET /analytics/trends" {
    $r = Invoke-RestMethod -Uri "$Base/analytics/trends"
    return "categories=$($r.data.categories.Count), searches=$($r.data.topSearches.Count)"
}

Test-Api "GET /analytics/insights (ca nhan)" {
    $r = Invoke-RestMethod -Uri "$Base/analytics/insights" -Headers $Headers
    return "favorites=$($r.data.totalFavorites), topStyle=$($r.data.topStyle)"
}

# --- 8. Gallery API ---
Write-Section 8 "Gallery API (pagination + sort)"

Test-Api "GET /paintings?page=1&limit=3&sort=popular" {
    $r = Invoke-RestMethod -Uri "$Base/paintings?page=1&limit=3&sort=popular"
    return "page $($r.pagination.page)/$($r.pagination.totalPages), $($r.data.Count) items"
}

Test-Api "GET /paintings?sort=price_desc" {
    $r = Invoke-RestMethod -Uri "$Base/paintings?sort=price_desc&limit=1"
    return "top price: $($r.data[0].price)"
}

# --- 9. Chatbot + DB ---
Write-Section 9 "Chatbot tich hop DB"

Test-Api "POST /chat (goi y tranh tu DB)" {
    $body = @{ message = "Show me abstract paintings with blue themes" } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Post -Uri "$Base/chat" -ContentType "application/json" -Body $body
    return "reply OK, suggested=$($r.suggested_paintings.Count) tranh"
}

# --- 10. Export ---
Write-Section 10 "Export Word/PDF"

$ExportDir = Join-Path $PSScriptRoot "demo-output"
New-Item -ItemType Directory -Force -Path $ExportDir | Out-Null

Test-Api "GET /paintings/p1/export/pdf" {
    $out = Join-Path $ExportDir "ArtMind_p1_demo.pdf"
    Invoke-WebRequest -Uri "$Base/paintings/p1/export/pdf" -OutFile $out
    $size = (Get-Item $out).Length
    return "saved $out ($size bytes)"
}

Test-Api "GET /paintings/p1/export/docx" {
    $out = Join-Path $ExportDir "ArtMind_p1_demo.docx"
    Invoke-WebRequest -Uri "$Base/paintings/p1/export/docx" -OutFile $out
    $size = (Get-Item $out).Length
    return "saved $out ($size bytes)"
}

# --- 11. CRUD Admin ---
Write-Section 11 "CRUD Admin (Paintings)"

$DemoId = "demo-p-" + (Get-Random -Maximum 9999)

Test-Api "POST /paintings (tao moi)" {
    $body = @{
        id = $script:DemoId
        title = "Demo Painting"
        artist = "Demo Artist"
        style = "Abstract"
        category = "Abstract Paintings"
        medium = "Oil"
        surface = "Canvas"
        price = 999
        image_url = "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=500"
        description = "Tranh demo de test CRUD"
    } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Post -Uri "$Base/paintings" -ContentType "application/json" -Body $body -Headers $Headers
    return "created id=$($r.data.id)"
}

Test-Api "PUT /paintings/$DemoId (cap nhat)" {
    $body = @{ price = 1299; description = "Updated demo painting" } | ConvertTo-Json
    $r = Invoke-RestMethod -Method Put -Uri "$Base/paintings/$DemoId" -ContentType "application/json" -Body $body -Headers $Headers
    return "new price=$($r.data.price)"
}

Test-Api "DELETE /paintings/$DemoId (xoa)" {
    $r = Invoke-RestMethod -Method Delete -Uri "$Base/paintings/$DemoId" -Headers $Headers
    return $r.message
}

# --- Tong ket ---
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host " KET QUA: $Pass PASS | $Fail FAIL" -ForegroundColor $(if ($Fail -eq 0) { "Green" } else { "Yellow" })
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "File export demo: $ExportDir" -ForegroundColor DarkGray
Write-Host "Chup man hinh output nay de nop bao cao / demo video." -ForegroundColor DarkGray

if ($Fail -gt 0) { exit 1 }

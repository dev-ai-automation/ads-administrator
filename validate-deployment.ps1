# validate-deployment.ps1
Write-Host "🔍 Starting Pre-Deployment Validation..." -ForegroundColor Cyan

$errors = 0

# 1. Check package.json for correct port
if (Select-String -Path "frontend/package.json" -Pattern "next dev -p 10000") {
    Write-Host "✅ [PASS] package.json enforces port 10000" -ForegroundColor Green
} else {
    Write-Host "❌ [FAIL] package.json MISSING port 10000 flag" -ForegroundColor Red
    $errors++
}

# 2. Check docker-compose.yml for correct port mapping
if (Select-String -Path "docker-compose.yml" -Pattern "10000:10000") {
    Write-Host "✅ [PASS] docker-compose.yml maps port 10000" -ForegroundColor Green
} else {
    Write-Host "❌ [FAIL] docker-compose.yml maps WRONG port (expected 10000:10000)" -ForegroundColor Red
    $errors++
}

# 3. Check for .env.local
if (Test-Path "frontend/.env.local") {
    $envContent = Get-Content "frontend/.env.local"
    if ($envContent -match "AUTH0_BASE_URL=http://localhost:10000") {
        Write-Host "✅ [PASS] .env.local configured with http://localhost:10000" -ForegroundColor Green
    } elseif ($envContent -match "https://localhost:10000") {
        Write-Host "❌ [FAIL] .env.local uses HTTPS (change to HTTP)" -ForegroundColor Red
        $errors++
    } else {
        Write-Host "⚠️  [WARN] .env.local exists but AUTH0_BASE_URL might be wrong" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ [FAIL] frontend/.env.local DOES NOT EXIST (Create it!)" -ForegroundColor Red
    $errors++
}

# 4. Check if Dockerfile.dev exists
if (Test-Path "frontend/Dockerfile.dev") {
    Write-Host "✅ [PASS] frontend/Dockerfile.dev found" -ForegroundColor Green
} else {
    Write-Host "❌ [FAIL] frontend/Dockerfile.dev MISSING" -ForegroundColor Red
    $errors++
}

Write-Host "--------------------------------------------------------"
if ($errors -eq 0) {
    Write-Host "🚀 READY TO DEPLOY! Configuration looks correct." -ForegroundColor Green
} else {
    Write-Host "🛑 FOUND $errors ERRORS. Fix them before pushing." -ForegroundColor Red
}

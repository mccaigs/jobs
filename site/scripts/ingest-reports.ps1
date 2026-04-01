# Ingest local markdown reports into Convex
# Usage: .\scripts\ingest-reports.ps1

$convexUrl = "https://third-lark-419.convex.site/ingest"
$reportsDir = "..\reports"

Write-Host "Starting ingestion to $convexUrl" -ForegroundColor Cyan

$reportFiles = Get-ChildItem -Path $reportsDir -Filter "*.md"
$results = @()

foreach ($file in $reportFiles) {
    Write-Host "`nProcessing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw
    $body = @{
        filename = "reports/$($file.Name)"
        content = $content
        sourceRepo = "mccaigs/jobs"
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri $convexUrl -Method POST -Body $body -ContentType "application/json"
        Write-Host "  ✓ Success: $($response.slug)" -ForegroundColor Green
        $results += @{ file = $file.Name; status = "success"; slug = $response.slug }
    }
    catch {
        $errorMsg = $_.Exception.Message
        Write-Host "  ✗ Failed: $errorMsg" -ForegroundColor Red
        $results += @{ file = $file.Name; status = "failed"; error = $errorMsg }
    }
}

Write-Host "`n=== Ingestion Summary ===" -ForegroundColor Cyan
$successCount = ($results | Where-Object { $_.status -eq "success" }).Count
$failedCount = ($results | Where-Object { $_.status -eq "failed" }).Count
Write-Host "Total: $($results.Count) | Success: $successCount | Failed: $failedCount"

if ($failedCount -gt 0) {
    Write-Host "`nFailed files:" -ForegroundColor Red
    $results | Where-Object { $_.status -eq "failed" } | ForEach-Object {
        Write-Host "  - $($_.file): $($_.error)"
    }
}

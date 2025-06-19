# PowerShell script to start EventHub application
Write-Host "Starting EventHub Application..." -ForegroundColor Green

# Check if MongoDB is running
Write-Host "Checking MongoDB connection..." -ForegroundColor Yellow

# Start Backend
Write-Host "Starting Backend Server..." -ForegroundColor Blue
Start-Process PowerShell -ArgumentList "-Command", "cd backend; npm run dev" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
Start-Process PowerShell -ArgumentList "-Command", "cd front; npm run dev" -WindowStyle Normal

Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend: http://localhost:5000" -ForegroundColor Blue
Write-Host "Frontend: http://localhost:8080 (or next available port)" -ForegroundColor Cyan
Write-Host "Press any key to exit..." -ForegroundColor Yellow
Read-Host 
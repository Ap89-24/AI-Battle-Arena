# AI Battle Arena - Setup Script
# Run this in PowerShell from the Frontend directory

Write-Host "Installing AI Battle Arena dependencies..." -ForegroundColor Cyan

Set-Location -Path "d:\AI-Battle-Arena\Frontend"

npm install framer-motion react-markdown react-syntax-highlighter lucide-react gsap @gsap/react --legacy-peer-deps

Write-Host ""
Write-Host "Dependencies installed! Starting dev server..." -ForegroundColor Green
npm run dev

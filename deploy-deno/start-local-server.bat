@echo off
echo Starting Grok API Proxy local development server...
echo.
echo This will forward requests from http://localhost:8000 to https://api.xai.com/v1/chat/completions
echo.
echo Press Ctrl+C to stop the server
echo.

deno run --allow-net --allow-env local-dev.ts

# CloudFlare Workers Deployment Guide

This guide will help you deploy the Grok API proxy to CloudFlare Workers and configure a custom domain.

## Prerequisites

1. A CloudFlare account
2. A domain managed on CloudFlare
3. Node.js and npm installed (for the Wrangler CLI)

## Step 1: Install the Wrangler CLI

Wrangler is CloudFlare's command-line tool for deploying and managing Workers.

```bash
npm install -g wrangler
```

## Step 2: Log in to CloudFlare

```bash
wrangler login
```

This will open a browser window asking you to authorize Wrangler to access your CloudFlare account.

## Step 3: Configure wrangler.toml

Edit the `deploy-deno/wrangler.toml` file to configure your custom domain:

```toml
name = "grok-api-proxy"
main = "grok-api-proxy.ts"
compatibility_date = "2023-12-01"

# Configure your custom domain routes
routes = [
  { pattern = "api-grok.yourdomain.com/*", zone_name = "yourdomain.com" }
]
```

Replace `yourdomain.com` with your actual domain and `api-grok` with your desired subdomain.

## Step 4: Deploy the Worker

```bash
cd deploy-deno
wrangler deploy
```

## Step 5: Configure DNS

In the CloudFlare dashboard, add a CNAME record for your subdomain:

1. Log in to the CloudFlare dashboard
2. Select your domain
3. Click on the "DNS" tab
4. Add a new CNAME record:
   - Name: `api-grok` (or your chosen subdomain)
   - Target: `your-worker.your-subdomain.workers.dev` (Wrangler will show this address after deployment)
   - Proxy status: Proxied (orange cloud icon)

## Step 6: Test Your Proxy

Test your proxy using curl or another tool:

```bash
curl -X POST https://api-grok.yourdomain.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_XAI_API_KEY" \
  -d '{
    "model": "grok-1",
    "messages": [
      {
        "role": "user",
        "content": "Hello, how are you?"
      }
    ]
  }'
```

## Troubleshooting

### Problem: Deployment Fails

- Make sure you're logged in to Wrangler
- Check for syntax errors in your `wrangler.toml` file
- Try running `wrangler whoami` to confirm you're properly logged in

### Problem: DNS Configuration Issues

- Ensure the CNAME record is set up correctly
- Wait for DNS propagation (can take up to 24 hours, but usually just minutes)
- Make sure CloudFlare proxying is enabled (orange cloud icon)

### Problem: API Requests Fail

- Ensure your Xai API key is valid
- Check that your request format is correct
- View the CloudFlare Workers logs for more information

## Advanced Configuration

### Adding Multiple Custom Domains

If you want to use multiple custom domains, you can add multiple routes in `wrangler.toml`:

```toml
routes = [
  { pattern = "api-grok.yourdomain.com/*", zone_name = "yourdomain.com" },
  { pattern = "grok-api.anotherdomain.com/*", zone_name = "anotherdomain.com" }
]
```

### Adding Rate Limiting

CloudFlare provides rate limiting features to prevent API abuse:

1. In the CloudFlare dashboard, go to "Security" > "WAF" > "Rate limiting rules"
2. Create a new rule to limit the number of requests to your Worker

### Monitoring and Analytics

CloudFlare provides detailed analytics and monitoring tools:

1. In the CloudFlare dashboard, go to "Analytics" > "Workers"
2. View request counts, CPU usage, and error rates for your Worker

## Important Notes

- This proxy does not store any information locally; it only forwards requests to the Xai API endpoint
- All authentication and authorization are handled by the Xai API, and you need to include a valid API key in your requests
- This proxy does not modify the content of requests or responses; it simply forwards them

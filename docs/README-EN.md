# Grok API Transform - English Documentation

A proxy service for forwarding requests to the Xai API (Grok) through custom domains using Deno and CloudFlare Workers.

## Overview

This project provides a simple proxy that forwards API requests from your custom domain to the Xai API endpoint at `https://api.xai.com/v1/chat/completions`. It allows you to use Grok's API through your own domain without enforcing specific model configurations, giving you the flexibility to configure models in your local chat software.

## Features

- Forwards requests from your custom domain to the Xai API
- Preserves all headers and request body
- Allows client-side model configuration
- Simple deployment to CloudFlare Workers
- Written in TypeScript for Deno

## Deployment

### Prerequisites

- A CloudFlare account
- Wrangler CLI installed (`npm install -g wrangler`)
- A custom domain configured in CloudFlare

### Deploying to CloudFlare Workers

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/GrokAPITransform.git
   cd GrokAPITransform
   ```

2. Deploy using Wrangler:
   ```
   cd deploy-deno
   wrangler publish grok-api-proxy.ts
   ```

3. Configure your custom domain in the CloudFlare dashboard to point to your worker.

### Local Development

To test the proxy locally:

1. Install Deno: https://deno.land/manual/getting_started/installation

2. Run the local development server:
   ```
   cd deploy-deno
   deno run --allow-net local-dev.ts
   ```

3. The server will start at http://localhost:8000

## Usage

Once deployed, you can send requests to your custom domain (e.g., `https://api-grok.yourdomain.com/v1/chat/completions`) and they will be forwarded to the Xai API.

Example request:

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

## Configuration

The proxy is designed to be simple and transparent, forwarding requests without modification. There are no configuration options required, as the goal is to allow your client application to handle all model configuration.

## License

[MIT License](../LICENSE)

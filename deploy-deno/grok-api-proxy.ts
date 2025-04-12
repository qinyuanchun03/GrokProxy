/**
 * Grok API Proxy for CloudFlare Workers
 *
 * This script forwards requests from a custom domain to the Xai API endpoint
 * at https://api.xai.com/v1/chat/completions
 *
 * It preserves all headers and request body, allowing the client to configure
 * model parameters directly rather than enforcing them in the proxy.
 *
 * IMPORTANT: This proxy does not store any information locally. It only forwards
 * requests to the API endpoint and returns the response.
 */

// Define ExecutionContext interface for Deno compatibility
interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

interface Env {
  // Define any environment variables here if needed
  // API_KEY?: string; // Not required as we're passing through client auth
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // The target API endpoint
    const targetUrl = "https://api.xai.com/v1/chat/completions";

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      // Clone the request to modify it
      const requestInit: RequestInit = {
        method: request.method,
        headers: new Headers(request.headers),
        redirect: 'follow',
      };

      // Only include body for non-GET requests
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        // Clone the body since it can only be read once
        const clonedRequest = request.clone();
        const bodyText = await clonedRequest.text();

        // Add the body back to the request
        requestInit.body = bodyText;
      }

      // Create a new request to the target API
      const apiRequest = new Request(targetUrl, requestInit);

      // Forward the request to the Xai API
      const response = await fetch(apiRequest);

      // Create a new response with the same body and headers
      const responseBody = await response.text();
      const newResponse = new Response(responseBody, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers),
      });

      // Add CORS headers
      newResponse.headers.set('Access-Control-Allow-Origin', '*');
      newResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      newResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      newResponse.headers.set('Access-Control-Expose-Headers', '*');

      return newResponse;
    } catch (error) {
      // Handle any errors
      console.error('Error forwarding request:', error);
      return new Response(JSON.stringify({
        error: 'Failed to forward request',
        message: error instanceof Error ? error.message : String(error),
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
